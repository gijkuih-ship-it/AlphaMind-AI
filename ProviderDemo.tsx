import { useState, useCallback } from 'react';
import { Sparkles, Zap, AlertTriangle, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { providers, getProvider } from '../services/aiProviders';
import { callAI } from '../services/aiService';
import type { ProviderKey } from '../services/aiProviders';

export default function ProviderDemo() {
  const [providerKey, setProviderKey] = useState<ProviderKey>('openai');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('alphamind_api_key') || '');
  const [prompt, setPrompt] = useState('Explain quantum computing in simple terms for a business audience.');
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [response, setResponse] = useState<{ text: string; error?: string } | null>(null);

  const handleRun = useCallback(async () => {
    if (apiKey) localStorage.setItem('alphamind_api_key', apiKey);
    setLoading(true);
    setResponse(null);
    setStreamText('');

    const res = await callAI({
      provider: providerKey,
      apiKey,
      prompt,
      stream: true,
    }, (chunk) => {
      setStreamText((prev) => prev + chunk);
    });

    setResponse({ text: res.text || streamText, error: res.error });
    setLoading(false);
  }, [providerKey, apiKey, prompt, streamText]);

  const provider = getProvider(providerKey);

  return (
    <section aria-label="AI Provider Demo" className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-12 shadow-2xl shadow-black/30 mb-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-soft to-copper/10 flex items-center justify-center text-gold"><Sparkles className="h-4.5 w-4.5" /></div>
        <h2 className="font-sans text-2xl lg:text-3xl font-extrabold tracking-tight text-cream">Live AI Engine</h2>
      </div>
      <p className="text-ash mb-8">Run real requests against 5 providers. Add your API key in Settings / Provider config, or test with the demo prompt below.</p>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label htmlFor="provider" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Provider</label>
            <select id="provider" value={providerKey} onChange={e => setProviderKey(e.target.value as ProviderKey)} className="w-full rounded-xl border border-white/[0.1] bg-ink px-3 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50">
              {providers.map(p => <option key={p.key} value={p.key}>{p.displayName}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="key" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">API Key</label>
            <input id="key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." className="w-full rounded-xl border border-white/[0.1] bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50" />
            <p className="text-[10px] text-fog mt-1">Stored locally. Never sent to our servers.</p>
          </div>
          <div>
            <label htmlFor="prompt" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Prompt</label>
            <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="w-full rounded-xl border border-white/[0.1] bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 resize-none" />
          </div>
          <button onClick={handleRun} disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-copper px-4 py-3 text-sm font-extrabold text-ink hover:brightness-110 transition-all shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)] flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Zap className="h-4 w-4 animate-pulse" /> : <SlidersHorizontal className="h-4 w-4" />}
            {loading ? 'Running...' : `Run with ${provider.displayName}`}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-white/[0.08] bg-ink min-h-[300px] p-6 shadow-inner shadow-black/10 relative">
            {loading && !streamText && <div className="absolute top-4 right-4 text-xs font-mono text-fog">Streaming...</div>}
            {response?.error ? (
              <div className="flex items-start gap-3 text-rose-300">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-base">Error</h4>
                  <p className="text-sm leading-relaxed">{response.error}</p>
                  <p className="text-xs text-fog mt-2">Check your API key and provider endpoint.</p>
                </div>
              </div>
            ) : response?.text || streamText ? (
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-cream whitespace-pre-wrap">
                {streamText || response?.text}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-fog">
                <CheckCircle className="h-10 w-10 mb-3 text-gold/40" />
                <p className="text-sm">Response will appear here.</p>
                <p className="text-xs mt-1">Select a provider and click Run.</p>
              </div>
            )}
            {streamText && !response && loading && (
              <div className="mt-3 flex items-center gap-2 text-xs text-fog font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Receiving stream...
              </div>
            )}
          </div>
          {response?.text && !response.error && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300 font-mono">
              <CheckCircle className="h-3.5 w-3.5" /> Completed via {provider.displayName} ({provider.model})
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
