import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    desc: 'For small teams and pilots.',
    features: ['10K tasks / month', '3 reasoning models', 'Email support', 'Standard security'],
    cta: 'Choose Starter',
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/month',
    desc: 'For growing product and ops teams.',
    features: ['500K tasks / month', 'All reasoning models', 'Priority support', 'Advanced governance', 'Custom integrations'],
    cta: 'Choose Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations with strict requirements.',
    features: ['Unlimited tasks', 'Dedicated cluster', 'SLA guarantee', 'Private deployment', 'Dedicated CSM', 'Custom contracts'],
    cta: 'Contact sales',
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-sans text-4xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95] text-cream">Simple <span className="font-serif italic font-normal text-parchment">pricing.</span></h1>
        <p className="mt-6 text-lg text-ash leading-relaxed">Start small, scale confidently. All plans include core reasoning capabilities with transparent usage metrics.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <div key={t.name} className={`relative rounded-3xl border p-8 lg:p-10 flex flex-col ${t.highlight ? 'bg-card border-gold/30 shadow-2xl shadow-black/30 ring-1 ring-gold/10' : 'bg-card border-border-subtle shadow-lg shadow-black/15'}`}>
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-ink shadow-lg shadow-gold/30">Most popular</div>
            )}
            <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">{t.name}</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-sans text-5xl font-extrabold tracking-tighter text-cream">{t.price}</span>
              <span className="text-ash text-base font-medium">{t.period}</span>
            </div>
            <p className="mt-3 text-sm text-fog">{t.desc}</p>
            <ul className="mt-8 space-y-3 flex-1">
              {t.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-ash"><Check className="h-4 w-4 text-gold shrink-0" /> {f}</li>
              ))}
            </ul>
            <a href="#" onClick={e => e.preventDefault()} className={`mt-8 w-full rounded-full py-3.5 text-center text-sm font-bold transition-colors ${t.highlight ? 'bg-gold text-ink hover:bg-parchment shadow-[0_0_20px_-6px_rgba(200,166,110,0.35)]' : 'bg-card border border-border-subtle text-cream hover:bg-card-hover hover:border-gold/30'}`}>{t.cta}</a>
          </div>
        ))}
      </div>
    </main>
  );
}
