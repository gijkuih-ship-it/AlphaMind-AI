import { Clock, BrainCircuit, FileText } from 'lucide-react';

const history = [
  { id: 1, title: 'Strategic synthesis — Q3 report', type: 'Synthesis', time: '2 hours ago', icon: FileText },
  { id: 2, title: 'Agent Mesh — Workflow #1042', type: 'Agent', time: '5 hours ago', icon: BrainCircuit },
  { id: 3, title: 'Cognitive Chain — Market analysis', type: 'Reasoning', time: 'Yesterday', icon: BrainCircuit },
  { id: 4, title: 'Validation — Compliance check', type: 'Validation', time: '2 days ago', icon: FileText },
];

export default function ActivityHistory() {
  return (
    <section aria-label="Recent activity" className="mb-10">
      <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-amber-300" /> Recent Activity</h2>
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/40 to-ink overflow-hidden shadow-sm">
        {history.map((h, i) => (
          <a key={h.id} href="#" onClick={e => e.preventDefault()} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors ${i !== history.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
            <div className="h-9 w-9 rounded-xl bg-gold-soft flex items-center justify-center text-gold shrink-0"><h.icon className="h-4 w-4" /></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sans text-sm font-bold text-cream truncate">{h.title}</h4>
              <div className="font-mono text-[10px] text-fog">{h.type}</div>
            </div>
            <div className="text-xs text-ash whitespace-nowrap">{h.time}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
