import { useState, useEffect } from 'react';
import { BrainCircuit, Zap, ShieldCheck, Search, Lock } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const tools = [
  { name: 'Cognitive Chain', category: 'Reasoning', desc: 'Multi-step logical inference with full provenance.', status: 'Active', usage: '12.4K tasks/mo', icon: BrainCircuit },
  { name: 'Synthesized Reports', category: 'Synthesis', desc: 'Merge sources into coherent executive deliverables.', status: 'Active', usage: '3.2K reports/mo', icon: Zap },
  { name: 'Agent Mesh', category: 'Orchestration', desc: 'Coordinate autonomous agents with dependency graphs.', status: 'Active', usage: '842 agents', icon: ShieldCheck },
  { name: 'Audit Trail', category: 'Governance', desc: 'Every decision logged, versioned, recoverable.', status: 'Active', usage: '99.998% uptime', icon: BrainCircuit },
];

export default function ToolPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    if (!user) { setPlan('free'); setLoadingPlan(false); return; }
    setLoadingPlan(true);
    getDoc(doc(db, 'subscriptions', user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setPlan(d.plan || 'free');
      } else {
        setPlan('free');
      }
      setLoadingPlan(false);
    }).catch(() => { setPlan('free'); setLoadingPlan(false); });
  }, [user]);

  const filtered = tools.filter(t => {
    if (t.name === 'Agent Mesh' || t.name === 'Audit Trail') {
      // Lock premium tools
      if (plan === 'free') return false;
    }
    return t.name.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95]">AI Tools</h1>
          <p className="text-ash mt-2">Your enabled modules and usage metrics.</p>
        </div>
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-fog" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools..." className="w-full rounded-xl border border-white/[0.1] bg-ink pl-9 pr-3 py-2 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(t => (
          <div key={t.name} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/50 to-ink p-6 hover:border-gold/20 transition-all shadow-sm hover:shadow-xl hover:shadow-black/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold-soft flex items-center justify-center text-gold"><t.icon className="h-5 w-5" /></div>
                <div>
                  <h3 className="font-sans text-base font-bold text-cream">{t.name}</h3>
                  <span className="font-mono text-[10px] text-fog uppercase tracking-widest">{t.category}</span>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${t.name === 'Agent Mesh' || t.name === 'Audit Trail' ? 'bg-rose-900/20 border-rose-400/20 text-rose-300' : 'bg-emerald-900/20 border-emerald-500/20 text-emerald-300'}`}>{t.name === 'Agent Mesh' || t.name === 'Audit Trail' ? (plan === 'free' ? <span className="flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Premium</span> : 'Premium') : t.status}</span>
            </div>
            <p className="text-sm text-ash mb-4">{t.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
              <span className="font-mono text-xs text-fog">Usage: <span className="text-cream font-medium">{t.usage}</span></span>
              <a href="#" onClick={e => e.preventDefault()} className="text-xs font-bold text-gold hover:underline">Configure</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
