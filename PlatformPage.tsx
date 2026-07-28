import { useState } from 'react';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function PlatformPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  const modules = [
    { label: 'Reasoning Engine', desc: 'Multi-hop chain-of-thought with full provenance.', icon: Sparkles },
    { label: 'Synthesis Core', desc: 'Merge divergent sources into coherent outputs.', icon: Layers },
    { label: 'Validation Layer', desc: 'Cross-check outputs against ground truth.', icon: Sparkles },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="max-w-3xl mb-16">
        <h1 className="font-sans text-4xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95] text-cream">The <span className="font-serif italic font-normal text-parchment">platform.</span></h1>
        <p className="mt-6 text-lg text-ash leading-relaxed">A composable architecture built for reliability, auditability, and scale. Deploy on our cloud, your VPC, or air-gapped environments.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-24">
        {modules.map((m, i) => (
          <div
            key={m.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={`group relative rounded-2xl border p-8 lg:p-10 transition-all ${hovered === i ? 'bg-card-hover border-gold/30 shadow-xl shadow-black/20' : 'bg-card border-border-subtle'}`}
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft border border-gold/10 text-gold"><m.icon className="h-6 w-6" /></div>
            <h3 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-3">{m.label}</h3>
            <p className="text-sm leading-relaxed text-ash">{m.desc}</p>
            <a href="#" onClick={e => e.preventDefault()} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline underline-offset-4">Learn more <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>
        ))}
      </div>

      <section aria-label="Architecture" className="rounded-3xl bg-card border border-border-subtle p-8 lg:p-14 shadow-xl shadow-black/20">
        <h2 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-cream mb-6">Enterprise-grade architecture.</h2>
        <p className="text-ash leading-relaxed max-w-3xl">From request ingestion through reasoning, synthesis, validation, and delivery — every stage is instrumented, retryable, and auditable. Multi-region deployment with automatic failover ensures continuity.</p>
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { stat: '99.997%', label: 'Uptime (30d)' },
            { stat: '<150ms', label: 'Median latency' },
            { stat: 'ISO 27001', label: 'Certified' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border-subtle bg-ink px-6 py-6 text-center">
              <div className="font-sans text-3xl font-extrabold text-cream">{s.stat}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-widest text-fog">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
