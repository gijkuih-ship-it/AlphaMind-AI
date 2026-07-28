import { ArrowUpRight } from 'lucide-react';

const actions = [
  { label: 'Run reasoning agent', desc: 'Launch a cognitive task', color: 'from-gold to-copper' },
  { label: 'Synthesize report', desc: 'Generate from sources', color: 'from-violet-400 to-fuchsia-400' },
  { label: 'Validate output', desc: 'Cross-check accuracy', color: 'from-emerald-400 to-teal-400' },
  { label: 'Invite teammate', desc: 'Add to workspace', color: 'from-amber-300 to-orange-300' },
];

export default function QuickActions() {
  return (
    <section aria-label="Quick actions" className="mb-10">
      <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((a) => (
          <a key={a.label} href="#" onClick={e => e.preventDefault()} className="group relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 hover:border-gold/20 transition-all shadow-sm hover:shadow-lg hover:shadow-black/20">
            <div className={`mb-3 h-9 w-9 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md`}>
              <ArrowUpRight className="h-4 w-4 text-ink" />
            </div>
            <h3 className="font-sans text-base font-bold text-cream tracking-tight">{a.label}</h3>
            <p className="text-xs text-ash mt-1">{a.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
