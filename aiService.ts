import { getProvider, type ProviderKey } from './aiProviders';

export interface AICompletionRequest {
  provider: ProviderKey;
  apiKey: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  toolId?: string;
}

export interface AICompletionResponse {
  text: string;
  provider: ProviderKey;
  model: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  streamed?: boolean;
  error?: string;
}

function buildHeaders(p: ReturnType<typeof getProvider>, apiKey: string): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' };
  if (p.key === 'openai' || p.key === 'groq') {
    h['Authorization'] = `Bearer ${apiKey}`;
  } else if (p.key === 'anthropic') {
    h['x-api-key'] = apiKey;
    h['anthropic-version'] = '2023-06-01';
  } else if (p.key === 'gemini') {
    // Gemini uses key in URL or header; we pass in URL param for simplicity
    // But for header approach: x-goog-api-key
    h['x-goog-api-key'] = apiKey;
  } else if (p.key === 'deepseek') {
    h['Authorization'] = `Bearer ${apiKey}`;
  }
  return h;
}

function buildBody(p: ReturnType<typeof getProvider>, req: AICompletionRequest): any {
  if (p.key === 'openai' || p.key === 'groq') {
    const messages: any[] = [];
    if (req.systemPrompt) messages.push({ role: 'system', content: req.systemPrompt });
    messages.push({ role: 'user', content: req.prompt });
    return {
      model: p.model,
      messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.maxTokens ?? 1200,
      stream: req.stream ?? false,
    };
  }
  if (p.key === 'anthropic') {
    return {
      model: p.model,
      max_tokens: req.maxTokens ?? 1200,
      temperature: req.temperature ?? 0.7,
      system: req.systemPrompt,
      messages: [{ role: 'user', content: req.prompt }],
      stream: req.stream ?? false,
    };
  }
  if (p.key === 'gemini') {
    return {
      contents: [{ parts: [{ text: req.systemPrompt ? `${req.systemPrompt}\n\n${req.prompt}` : req.prompt }] }],
      generationConfig: { temperature: req.temperature ?? 0.7, maxOutputTokens: req.maxTokens ?? 1200 },
    };
  }
  if (p.key === 'deepseek') {
    const messages: any[] = [];
    if (req.systemPrompt) messages.push({ role: 'system', content: req.systemPrompt });
    messages.push({ role: 'user', content: req.prompt });
    return {
      model: p.model,
      messages,
      temperature: req.temperature ?? 0.7,
      max_tokens: req.maxTokens ?? 1200,
      stream: req.stream ?? false,
    };
  }
  throw new Error('Unsupported provider body');
}

function parseResponse(p: ReturnType<typeof getProvider>, data: any, stream: boolean): string {
  if (stream) return '';
  try {
    if (p.key === 'openai' || p.key === 'groq' || p.key === 'deepseek') {
      return data.choices?.[0]?.message?.content || '';
    }
    if (p.key === 'anthropic') {
      return data.content?.[0]?.text || '';
    }
    if (p.key === 'gemini') {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
  } catch {
      return '';
  }
  return '';
}

export async function callAI(req: AICompletionRequest, onChunk?: (chunk: string) => void): Promise<AICompletionResponse> {
  const p = getProvider(req.provider);

  try {
    if (!req.apiKey) {
      return { text: '', provider: req.provider, model: p.model, error: 'API key required. Add your key in Settings / Provider config.' };
    }

    const url = p.key === 'gemini' ? `${p.endpoint}?key=${req.apiKey}` : p.endpoint;
    const headers = buildHeaders(p, req.apiKey);
    const body = buildBody(p, req);

    if (req.stream && p.supportsStreaming && onChunk) {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => 'Unknown error');
        return { text: '', provider: req.provider, model: p.model, error: `Provider error (${res.status}): ${errText.slice(0, 200)}` };
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Simple SSE parsing - extract data lines
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataStr);
                let textFragment = '';
                if (p.key === 'openai' || p.key === 'groq' || p.key === 'deepseek') {
                  textFragment = parsed.choices?.[0]?.delta?.content || '';
                } else if (p.key === 'anthropic') {
                  textFragment = parsed.delta?.text || '';
                }
                if (textFragment) {
                  accumulated += textFragment;
                  onChunk(textFragment);
                }
              } catch { /* ignore malformed */ }
            }
          }
        }
      }
      return { text: accumulated, provider: req.provider, model: p.model, streamed: true };
    }

    // Non-streaming
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error');
      return { text: '', provider: req.provider, model: p.model, error: `Provider error (${res.status}): ${errText.slice(0, 200)}` };
    }

    const data = await res.json();
    const text = parseResponse(p, data, false);
    let usage: AICompletionResponse['usage'] = undefined;
    try {
      if (p.key === 'openai' || p.key === 'groq' || p.key === 'deepseek') {
        usage = { promptTokens: data.usage?.prompt_tokens || 0, completionTokens: data.usage?.completion_tokens || 0, totalTokens: data.usage?.total_tokens || 0 };
      } else if (p.key === 'anthropic') {
        usage = { promptTokens: data.usage?.input_tokens || 0, completionTokens: data.usage?.output_tokens || 0, totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0) };
      } else if (p.key === 'gemini') {
        usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      }
    } catch { /* ignore usage parse */ }

    return { text, provider: req.provider, model: p.model, usage, streamed: false };
  } catch (err: any) {
    return { text: '', provider: req.provider, model: p.model, error: err?.message || 'Network or parsing error' };
  }
}
