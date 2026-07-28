import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      {/* Ambient glow behind text */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-soft blur-[140px] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-16 lg:pt-36 lg:pb-28">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-soft px-3.5 py-1.5 mb-8 text-[13px] font-medium text-parchment shadow-[inset_0_1px_0_rgba(200,166,110,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Enterprise AI platform — now in general availability
          </div>

          <h1 className="font-sans text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-[-0.04em] leading-[0.92] text-cream">
            Intelligence that
            <br />
            <span className="font-serif italic text-parchment font-normal">scales with you.</span>
          </h1>

          <p className="mt-7 text-lg lg:text-xl leading-relaxed text-ash max-w-2xl">
            AlphaMind is a production-grade reasoning engine for enterprises that need reliable, auditable AI — from strategic synthesis to operational automation.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-[15px] font-semibold text-ink shadow-[0_0_40px_-10px_rgba(200,166,110,0.45)] hover:bg-parchment transition-colors"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/platform"
              className="group inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-6 py-3.5 text-[15px] font-medium text-cream hover:bg-card-hover hover:border-gold/30 transition-colors"
            >
              Explore platform
              <ChevronRight className="h-4 w-4 text-ash group-hover:text-cream group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        <div className="mt-20 lg:mt-24 rounded-2xl border border-border-subtle bg-card/60 backdrop-blur-sm p-4 lg:p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-fog">Live dashboard</span>
            <span className="h-px flex-1 bg-divider" />
            <span className="font-mono text-[11px] text-fog">Last updated 2m ago</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
            {[
              { label: 'Active agents', value: '14,203', delta: '+12.4%', positive: true },
              { label: 'Tasks processed', value: '2.8M', delta: '+8.1%', positive: true },
              { label: 'Average latency', value: '142ms', delta: '-6.2%', positive: true },
              { label: 'Uptime (30d)', value: '99.997%', delta: '+0.003%', positive: true },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border-subtle bg-ink p-4 lg:p-5 hover:border-gold/20 transition-colors">
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-fog mb-2">{s.label}</div>
                <div className="font-sans text-2xl lg:text-3xl font-extrabold text-cream tracking-tight leading-none">{s.value}</div>
                <div className={`mt-2 text-xs font-medium ${s.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{s.delta} this week</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
