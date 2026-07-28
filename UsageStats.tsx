import { Zap, ShieldCheck, ExternalLink } from 'lucide-react';

const stats = [
  { label: 'Tasks today', value: '2,847', delta: '+14%', trend: 'up' as const },
  { label: 'Active agents', value: '42', delta: '+3', trend: 'up' as const },
  { label: 'Avg latency', value: '138ms', delta: '-6ms', trend: 'down' as const },
  { label: 'Uptime (7d)', value: '99.998%', delta: '+0.001%', trend: 'up' as const },
];

export default function UsageStats() {
  return (
    <section aria-label="Usage statistics" className="mb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/60 to-ink p-6 shadow-sm shadow-black/10 hover:border-gold/20 transition-colors">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-fog mb-2">{s.label}</div>
            <div className="font-sans text-3xl font-extrabold text-cream tracking-tight">{s.value}</div>
            <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${s.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              <Zap className="h-3 w-3" /> {s.delta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
