import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24 lg:pb-32" aria-label="Call to action">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border-subtle shadow-2xl shadow-black/30">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full bg-gold-soft blur-[120px] opacity-60" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-[200px] w-[200px] rounded-full bg-copper/30 blur-[100px] opacity-40" />

        <div className="relative px-8 py-16 lg:px-16 lg:py-20 text-center lg:text-left lg:flex lg:items-center lg:justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="font-sans text-3xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[1.1]">Start building with <span className="font-serif italic font-normal text-parchment">AlphaMind</span> today.</h2>
            <p className="mt-5 text-ash text-base lg:text-lg leading-relaxed">Get 14 days at full capacity. No credit card required. Scale when you are ready.</p>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end gap-3">
            <Link to="/signup" className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[15px] font-bold text-ink hover:bg-parchment transition-colors shadow-[0_0_30px_-6px_rgba(200,166,110,0.4)]">
              Get started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-ink px-7 py-3.5 text-[15px] font-medium text-cream hover:bg-card-hover hover:border-gold/30 transition-colors">Talk to sales</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
