import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Zap, Sparkles, BookOpen, Lock } from 'lucide-react';
import { categories, tools } from '../lib/aiToolsData';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../lib/authContext';
import { callAI } from '../services/aiService';
import { getProvider } from '../services/aiProviders';
import type { ProviderKey } from '../services/aiProviders';
import ProviderDemo from '../components/ProviderDemo';

export default function AIToolsEnginePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('alphamind_favorites') || '[]'); } catch { return []; }
  });
  const [providerKey, setProviderKey] = useState<ProviderKey>('openai');
  const [apiKey, setApiKey] = useState('');
  const [runningTool, setRunningTool] = useState<string | null>(null);
  const [toolResult, setToolResult] = useState<{ text: string; error?: string; streamed?: boolean } | null>(null);
  const [toolStreamText, setToolStreamText] = useState('');

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('alphamind_favorites', JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) || t.shortDesc.toLowerCase().includes(query.toLowerCase());
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesPrice = pricingFilter === 'all' || t.pricing === pricingFilter;
      return matchesQuery && matchesCat && matchesPrice;
    });
  }, [query, categoryFilter, pricingFilter]);

  const featured = tools.filter(t => t.pricing === 'premium').slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      {/* Hero intro */}
      <div className="mb-12 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-card via-ink to-card p-10 lg:p-14 shadow-2xl shadow-black/30">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-gold-soft via-amber-900/10 to-transparent blur-[120px] opacity-60 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-soft px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-gold mb-6">
            <Zap className="h-3 w-3" /> AI Engine
          </div>
          <h1 className="font-sans text-5xl lg:text-7xl font-extrabold tracking-[-0.045em] leading-[0.92] text-cream">AI Tools <span className="font-serif italic font-normal text-parchment">Engine.</span></h1>
          <p className="mt-5 text-lg text-ash max-w-2xl leading-relaxed">Browse, search, and activate tools across 12 categories. Data loads from a central source — add new tools without touching the UI.</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-fog" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, tags, or descriptions..."
            className="w-full rounded-2xl border border-white/[0.1] bg-ink pl-11 pr-4 py-3.5 text-base text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all shadow-lg shadow-black/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button onClick={() => setCategoryFilter('all')} className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${categoryFilter === 'all' ? 'bg-gold text-ink shadow-[0_0_16px_-4px_rgba(200,166,110,0.4)]' : 'bg-white/[0.05] text-ash border border-white/[0.08] hover:text-cream'}`}>All</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${categoryFilter === c.id ? 'bg-gold text-ink shadow-[0_0_16px_-4px_rgba(200,166,110,0.4)]' : 'bg-white/[0.05] text-ash border border-white/[0.08] hover:text-cream'}`}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Pricing filters */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-mono uppercase tracking-[0.1em] text-fog">Pricing</span>
        {[
          { label: 'All', val: 'all' },
          { label: 'Free', val: 'free' },
          { label: 'Premium', val: 'premium' },
        ].map(p => (
          <button key={p.val} onClick={() => setPricingFilter(p.val)} className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${pricingFilter === p.val ? 'bg-ink border border-gold/30 text-gold' : 'bg-white/[0.03] border border-white/[0.08] text-fog hover:text-cream'}`}>{p.label}</button>
        ))}
      </div>

      <ProviderDemo />

      {toolResult && (
        <div className="mb-14 rounded-2xl border border-white/[0.1] bg-ink p-6 shadow-lg shadow-black/20">
          {toolResult.error ? (
            <div className="text-rose-300 text-sm font-medium">Error: {toolResult.error}</div>
          ) : (
            <div className="text-sm text-cream whitespace-pre-wrap leading-relaxed">{toolResult.text || toolStreamText}</div>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-fog font-mono">
            <span>Provider: {getProvider(providerKey).displayName}</span>
            <span>Model: {getProvider(providerKey).model}</span>
            {toolResult.streamed && <span>Streamed: yes</span>}
          </div>
        </div>
      )}

      {/* Featured premium row */}
      <section aria-label="Premium featured" className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-soft to-copper/10 flex items-center justify-center text-gold"><Sparkles className="h-4.5 w-4.5" /></div>
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-cream">Premium Featured</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(t => (
            <Link key={t.id} to={`/tools/${t.id}`} className="group relative rounded-2xl border border-white/[0.1] bg-gradient-to-b from-card/60 to-ink p-7 hover:border-gold/30 shadow-xl shadow-black/20 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-gold-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-gold">Premium</span>
                  <span className="font-mono text-xs text-fog">{t.category}</span>
                </div>
              </div>
              <h3 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-2">{t.name}</h3>
              <p className="text-sm text-ash leading-relaxed mb-4">{t.shortDesc}</p>
              <div className="flex items-center gap-2 text-xs text-fog"><BookOpen className="h-3 w-3" /> {t.usageCount.toLocaleString()} runs</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section aria-label="Categories" className="mb-14">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-cream mb-5">Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map(c => {
            const count = tools.filter(t => t.category === c.id).length;
            return (
              <button key={c.id} onClick={() => setCategoryFilter(c.id)} className="text-left rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 hover:border-gold/20 hover:from-white/[0.06] transition-all shadow-sm hover:shadow-lg hover:shadow-black/10">
                <h3 className="font-sans text-base font-extrabold text-cream">{c.label}</h3>
                <p className="text-xs text-ash mt-1">{c.desc}</p>
                <div className="mt-3 font-mono text-xs text-fog">{count} tools</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Provider config bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl border border-white/[0.08] bg-ink">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fog">Provider</span>
        <select value={providerKey} onChange={e => setProviderKey(e.target.value as ProviderKey)} className="rounded-lg bg-ink border border-white/[0.1] px-2 py-1 text-xs font-medium text-cream focus:outline-none"><option value="openai">OpenAI</option><option value="gemini">Gemini</option><option value="anthropic">Claude</option><option value="groq">Groq</option><option value="deepseek">DeepSeek</option></select>
        <input type="password" placeholder="API Key (localStorage)" value={apiKey} onChange={e => setApiKey(e.target.value)} className="rounded-lg bg-ink border border-white/[0.1] px-2 py-1 text-xs text-cream placeholder:text-fog w-48" />
      </div>

      {/* Tools grid */}
      <section aria-label="AI Tools" className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-cream flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-gold" /> {filtered.length} Tools</h2>
          <button onClick={() => { setQuery(''); setCategoryFilter('all'); setPricingFilter('all'); }} className="text-xs font-medium text-fog hover:text-gold transition-colors underline underline-offset-2">Clear filters</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <article key={t.id} className="group relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/40 to-ink p-6 hover:border-gold/20 transition-all shadow-sm hover:shadow-xl hover:shadow-black/15">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-gold-soft to-copper/10 flex items-center justify-center text-gold shadow-sm shadow-black/10">{t.icon}</div>
                  <div>
                    <h3 className="font-sans text-lg font-extrabold text-cream tracking-tight leading-tight">{t.name}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-fog">{categories.find(c => c.id === t.category)?.label}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${t.pricing === 'premium' ? 'bg-amber-900/20 text-amber-300 border border-amber-500/10' : 'bg-emerald-900/20 text-emerald-300 border border-emerald-500/10'}`}>{t.pricing === 'premium' ? 'Premium' : 'Free'}</span>
              </div>
              <p className="text-sm text-ash leading-relaxed mb-4">{t.shortDesc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {t.tags.map(tag => <span key={tag} className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-ash">{tag}</span>)}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs font-bold text-cream">{t.rating}</span>
                  <span className="font-mono text-[10px] text-fog">{t.reviews.toLocaleString()} reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <FavoriteButton active={favorites.includes(t.id)} onClick={() => toggleFav(t.id)} />
                  <button onClick={async () => { if (!user) { alert('Sign in to use AI tools'); return; } setRunningTool(t.id); setToolResult(null); setToolStreamText(''); const res = await callAI({ provider: providerKey, apiKey, prompt: `Use ${t.name} (${t.category}): ${t.shortDesc}`, stream: true, toolId: t.id }, (chunk) => setToolStreamText(prev => prev + chunk)); setToolResult({ text: res.text || toolStreamText, error: res.error, streamed: res.streamed }); setRunningTool(null); }} disabled={runningTool === t.id} className="rounded-full bg-gradient-to-r from-gold to-copper px-3 py-1.5 text-xs font-extrabold text-ink shadow-[0_0_12px_-4px_rgba(200,166,110,0.35)] hover:brightness-110 transition-all disabled:opacity-50">{runningTool === t.id ? 'Running...' : 'Run Tool'}</button>
                  <Link to={`/tools/${t.id}`} className="rounded-lg bg-white/[0.06] border border-white/[0.1] px-3 py-1.5 text-xs font-bold text-cream hover:bg-card-hover transition-colors">Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-ash text-sm">No tools match your filters. Try adjusting category or pricing.</div>
        )}

        {toolResult && (
          <div className="mb-14 rounded-2xl border border-white/[0.1] bg-ink p-6 shadow-xl shadow-black/20">
            <h3 className="font-sans text-lg font-extrabold text-cream tracking-tight mb-3">AI Response</h3>
            <div className="text-sm text-cream whitespace-pre-wrap leading-relaxed">{toolResult.text || toolStreamText}</div>
            {toolResult.error && <div className="mt-3 text-xs text-rose-300">Error: {toolResult.error}</div>}
            <div className="mt-3 flex items-center gap-3 text-xs text-fog font-mono">
              <span>Provider: {getProvider(providerKey).displayName}</span>
              <span>Model: {getProvider(providerKey).model}</span>
              {toolResult.streamed && <span>Streamed</span>}
            </div>
          </div>
        )}
      </section>

      {/* Recent / Recently added */}
      <section aria-label="Recently added" className="mb-4">
        <h2 className="font-sans text-xl font-extrabold text-cream mb-4">Recently Added</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[...tools].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map(t => (
            <Link key={t.id} to={`/tools/${t.id}`} className="rounded-2xl border border-white/[0.08] bg-card p-5 hover:border-gold/20 transition-colors shadow-sm hover:shadow-lg">
              <div className="font-mono text-[10px] text-fog mb-2">{categories.find(c => c.id === t.category)?.label}</div>
              <h4 className="font-sans text-base font-bold text-cream">{t.name}</h4>
              <p className="text-xs text-ash mt-1">{t.shortDesc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
