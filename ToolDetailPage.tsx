import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { tools, categories } from '../lib/aiToolsData';
import FavoriteButton from '../components/FavoriteButton';
import { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { callAI } from '../services/aiService';
import { getProvider } from '../services/aiProviders';
import type { ProviderKey } from '../services/aiProviders';

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tool = tools.find(t => t.id === id);
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [providerKey, setProviderKey] = useState<ProviderKey>('openai');
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ text: string; error?: string; streamed?: boolean } | null>(null);
  const [streamText, setStreamText] = useState('');

  if (!tool) {
    return (
      <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-24 text-center">
        <h1 className="font-sans text-4xl font-extrabold text-cream">Tool not found</h1>
        <Link to="/dashboard/tools" className="mt-4 inline-block text-gold">Back to AI Tools</Link>
      </main>
    );
  }

  const cat = categories.find(c => c.id === tool.category);

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <Link to="/dashboard/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-ash hover:text-cream mb-8 transition-colors"><ArrowLeft className="h-4 w-4" /> Back to engine</Link>

      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-10 lg:p-14 shadow-2xl shadow-black/30 mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-gold">{cat?.label}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-widest ${tool.pricing === 'premium' ? 'bg-amber-900/20 text-amber-300 border border-amber-500/20' : 'bg-emerald-900/20 text-emerald-300 border border-emerald-500/20'}`}>{tool.pricing}</span>
        </div>
        <h1 className="font-sans text-4xl lg:text-6xl font-extrabold tracking-[-0.035em] text-cream leading-[0.95] mb-3">{tool.name}</h1>
        <p className="text-lg text-ash leading-relaxed max-w-3xl">{tool.shortDesc}</p>

        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300"><Star className="h-4 w-4 fill-amber-300" /> {tool.rating}</div>
          <div className="text-sm text-fog">{tool.reviews.toLocaleString()} reviews</div>
          <div className="text-sm text-fog">{tool.usageCount.toLocaleString()} runs</div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {tool.tags.map(tag => <span key={tag} className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 text-xs font-medium text-ash">{tag}</span>)}
        </div>

        <div className="flex items-center gap-3 mt-8">
          <FavoriteButton active={favorited} onClick={() => setFavorited(!favorited)} />
          <button onClick={async () => {
            setRunning(true); setResult(null); setStreamText('');
            const res = await callAI({ provider: providerKey, apiKey, prompt, stream: true, toolId: tool?.id }, (chunk) => setStreamText(prev => prev + chunk));
            setResult({ text: res.text || streamText, error: res.error, streamed: res.streamed });
            setRunning(false);
          }} disabled={running} className="rounded-full bg-gradient-to-r from-gold to-copper px-6 py-2.5 text-sm font-extrabold text-ink shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)] hover:brightness-110 transition-all disabled:opacity-60">{running ? 'Running...' : 'Run Tool'}</button>
        </div>
        {running && <p className="mt-3 text-xs text-fog font-mono">Streaming via {getProvider(providerKey).displayName}...</p>}
        {result && (
          <div className="mt-6 rounded-2xl border border-white/[0.1] bg-ink p-6">
            {result.error ? (
              <div className="text-rose-300 text-sm">Error: {result.error}</div>
            ) : (
              <div className="text-sm text-cream whitespace-pre-wrap leading-relaxed">{result.text || streamText}</div>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-fog font-mono">
              <span>Provider: {getProvider(providerKey).displayName}</span>
              <span>Model: {getProvider(providerKey).model}</span>
              {result.streamed && <span>Streamed: yes</span>}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-sans text-2xl font-extrabold text-cream tracking-tight mb-4">About</h2>
          <p className="text-ash leading-relaxed text-base">{tool.fullDesc}</p>
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/40 to-ink p-6 shadow-sm">
            <h3 className="font-sans text-lg font-bold text-cream mb-3">Capabilities</h3>
            <ul className="space-y-2">
              {tool.tags.map(tag => <li key={tag} className="flex items-center gap-2 text-sm text-ash"><CheckCircle className="h-4 w-4 text-gold" /> {tag}</li>)}
            </ul>
          </div>
        </div>
        <aside className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-7 h-fit shadow-xl shadow-black/20">
          <h3 className="font-sans text-lg font-extrabold text-cream mb-4">Details</h3>
          <dl className="space-y-4 text-sm">
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog">Category</dt><dd className="font-medium text-cream">{cat?.label}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog">Pricing</dt><dd className={`font-medium ${tool.pricing === 'premium' ? 'text-gold' : 'text-emerald-300'}`}>{tool.pricing === 'premium' ? 'Premium' : 'Free'}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog">Created</dt><dd className="font-medium text-cream">{new Date(tool.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</dd></div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
