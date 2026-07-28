import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/' },
      { label: 'Platform', href: '/platform' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Enterprise', href: '/enterprise' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Research', href: '/research' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-ink">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5" aria-label="AlphaMind AI Home">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border-subtle shadow-md shadow-black/20">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-sans text-base font-extrabold tracking-tight text-cream">AlphaMind</span>
                <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fog uppercase">AI</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-fog max-w-md">
              Enterprise-grade artificial intelligence for reasoning, synthesis, and decision-making at scale. Built for production, designed for trust.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => { e.preventDefault(); }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-card text-ash hover:text-cream hover:border-gold/30 hover:bg-card-hover transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-parchment mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="text-sm text-ash hover:text-cream transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-divider flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-fog font-mono">
            <span>© {new Date().getFullYear()} AlphaMind AI, Inc.</span>
            <span className="hidden md:inline text-divider">|</span>
            <Link to="/privacy" className="hover:text-cream transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-cream transition-colors">Terms</Link>
            <Link to="/security" className="hover:text-cream transition-colors">Security</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-fog font-mono">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System operational
          </div>
        </div>
      </div>
    </footer>
  );
}
