import { CreditCard, CheckCircle, Zap, ArrowRight } from 'lucide-react';

export default function PricingPreviewPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="mx-auto max-w-3xl mb-16">
        <h1 className="font-sans text-4xl lg:text-6xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95] mb-4">Pricing</h1>
        <p className="text-ash leading-relaxed">Transparent, usage-based billing with no hidden fees. Scale when you're ready.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {[
          { name: 'Starter', price: '$49', period: '/mo', desc: 'Small teams and pilots.', features: ['10K tasks/mo', '3 reasoning models', 'Standard security', 'Email support'], highlight: false },
          { name: 'Pro', price: '$299', period: '/mo', desc: 'Growing product and ops.', features: ['500K tasks/mo', 'All reasoning models', 'Advanced governance', 'Priority support'], highlight: true },
          { name: 'Enterprise', price: 'Custom', period: '', desc: 'Regulated and high-scale.', features: ['Unlimited tasks', 'Dedicated cluster', 'SLA guarantee', 'Private deployment'], highlight: false },
        ].map((t) => (
          <div key={t.name} className={`relative rounded-3xl border p-8 lg:p-10 flex flex-col ${t.highlight ? 'bg-gradient-to-b from-card to-ink border-gold/30 shadow-2xl shadow-black/30 ring-1 ring-gold/10' : 'bg-card border-white/[0.08] shadow-xl shadow-black/15'}`}>
            {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-copper px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-ink shadow-lg shadow-gold/20">Best value</div>}
            <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">{t.name}</h2>
            <div className="mt-4 flex items-baseline gap-1.5"><span className="font-sans text-5xl font-extrabold tracking-tight text-cream">{t.price}</span><span className="text-ash text-base font-medium">{t.period}</span></div>
            <p className="mt-1 text-sm text-fog">{t.desc}</p>
            <ul className="mt-6 space-y-2.5 flex-1">
              {t.features.map(f => <li key={f} className="flex items-center gap-2.5 text-sm text-ash"><CheckCircle className="h-4 w-4 text-gold shrink-0" />{f}</li>)}
            </ul>
            <a href="#" onClick={e => e.preventDefault()} className={`mt-7 w-full rounded-full py-3 text-center text-sm font-extrabold transition-all ${t.highlight ? 'bg-gradient-to-r from-gold to-copper text-ink shadow-[0_0_30px_-8px_rgba(200,166,110,0.4)] hover:brightness-110' : 'bg-white/[0.06] border border-white/10 text-cream hover:bg-white/[0.1]'}`}>Choose {t.name}</a>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-12 shadow-xl shadow-black/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="font-sans text-2xl lg:text-3xl font-extrabold tracking-tight text-cream">Need a custom plan?</h2>
            <p className="mt-2 text-ash">Enterprise contracts with dedicated clusters, SLAs, and private deployment.</p>
          </div>
          <a href="#" onClick={e => e.preventDefault()} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink shadow-[0_0_30px_-8px_rgba(200,166,110,0.4)] hover:brightness-110 transition-all">Contact sales <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </main>
  );
}
