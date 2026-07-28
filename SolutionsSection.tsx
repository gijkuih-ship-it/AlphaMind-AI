
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    tag: 'Strategy',
    title: 'Strategic Synthesis',
    desc: 'Transform market signals and internal data into coherent strategic recommendations with cited reasoning.',
    link: '/solutions/strategy',
  },
  {
    tag: 'Operations',
    title: 'Operational Intelligence',
    desc: 'Automate workflow decisions, triage incoming requests, and surface anomalies before they become incidents.',
    link: '/solutions/operations',
  },
  {
    tag: 'Research',
    title: 'Deep Research',
    desc: 'Conduct multi-source research with rigorous citation, contradiction detection, and synthesized reports.',
    link: '/solutions/research',
  },
];

export default function SolutionsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32" aria-label="Solutions">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <div>
          <h2 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[1.05]">Solutions that <br /><span className="font-serif italic font-normal text-parchment">fit your domain.</span></h2>
          <p className="mt-4 text-ash text-base lg:text-lg max-w-xl leading-relaxed">Specialized capabilities for complex organizational needs across finance, operations, and research.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link key={c.title} to={c.link} className="group relative rounded-2xl border border-border-subtle bg-card p-8 lg:p-10 hover:bg-card-hover hover:border-gold/20 transition-all shadow-sm shadow-black/10 hover:shadow-xl hover:shadow-black/25 block">
            <div className="mb-6 inline-block rounded-md bg-ink border border-border-subtle px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-parchment">{c.tag}</div>
            <h3 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-3">{c.title}</h3>
            <p className="text-sm leading-relaxed text-ash mb-8">{c.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:underline underline-offset-4">Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
