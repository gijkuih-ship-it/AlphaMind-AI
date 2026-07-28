export type ProviderKey = 'openai' | 'gemini' | 'anthropic' | 'groq' | 'deepseek';

export interface ProviderConfig {
  key: ProviderKey;
  name: string;
  displayName: string;
  endpoint: string;
  model: string;
  supportsStreaming: boolean;
  requiresKey: boolean;
}

export const providers: ProviderConfig[] = [
  { key: 'openai', name: 'OpenAI', displayName: 'OpenAI', endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o', supportsStreaming: true, requiresKey: true },
  { key: 'gemini', name: 'Google Gemini', displayName: 'Google Gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent', model: 'gemini-1.5-pro', supportsStreaming: true, requiresKey: true },
  { key: 'anthropic', name: 'Anthropic Claude', displayName: 'Anthropic Claude', endpoint: 'https://api.anthropic.com/v1/messages', model: 'claude-3-5-sonnet-20240620', supportsStreaming: true, requiresKey: true },
  { key: 'groq', name: 'Groq', displayName: 'Groq', endpoint: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile', supportsStreaming: true, requiresKey: true },
  { key: 'deepseek', name: 'DeepSeek', displayName: 'DeepSeek', endpoint: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', supportsStreaming: true, requiresKey: true },
];

export function getProvider(key: ProviderKey): ProviderConfig {
  const p = providers.find(x => x.key === key);
  if (!p) throw new Error(`Unknown provider: ${key}`);
  return p;
}
