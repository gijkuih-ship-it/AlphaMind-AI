import { Zap, ShieldCheck, Layers, Workflow, BarChart3, Lock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Cognitive Reasoning',
    desc: 'Multi-step reasoning chains that decompose complex problems into verifiable steps with full traceability.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Governance',
    desc: 'Fine-grained access controls, audit logs, and compliance frameworks for regulated industries.',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    desc: 'Composable AI modules — reasoning, synthesis, extraction, validation — wired together by your rules.',
  },
  {
    icon: Workflow,
    title: 'Agent Orchestration',
    desc: 'Coordinate hundreds of autonomous agents with dependency graphs, retries, and graceful degradation.',
  },
  {
    icon: BarChart3,
    title: 'Observability',
    desc: 'Real-time metrics, cost attribution, and latency profiling at the task, agent, and model level.',
  },
  {
    icon: Lock,
    title: 'Data Sovereignty',
    desc: 'Private deployment options with end-to-end encryption. Your data never trains our models.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32" aria-label="Platform capabilities">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <div>
          <h2 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[1.05]">Built for <span className="font-serif italic font-normal text-parchment">production.</span></h2>
          <p className="mt-4 text-ash text-base lg:text-lg max-w-xl leading-relaxed">Every component is engineered to meet enterprise demands for reliability, security, and scale.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="group relative rounded-2xl border border-border-subtle bg-card p-7 lg:p-8 hover:bg-card-hover hover:border-gold/20 transition-all shadow-sm shadow-black/10 hover:shadow-lg hover:shadow-black/20">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft border border-gold/10 text-gold shadow-[inset_0_1px_0_rgba(200,166,110,0.1)]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-sans text-lg font-bold text-cream mb-2 tracking-tight">{f.title}</h3>
            <p className="text-sm leading-relaxed text-ash">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
