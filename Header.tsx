import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Overview', href: '/' },
  { label: 'Platform', href: '/platform' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Research', href: '/research' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle backdrop-blur-xl bg-ink/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="AlphaMind AI Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border-subtle shadow-sm shadow-black/20 group-hover:border-gold/30 transition-colors">
            <Sparkles className="h-4.5 w-4.5 text-gold" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-sans text-sm font-bold tracking-tight text-cream">AlphaMind</span>
            <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-fog uppercase">AI</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((l) => {
            const active = location.pathname === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  active ? 'text-cream' : 'text-ash hover:text-cream'
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-gold/60 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-card px-3.5 py-2 text-[13px] font-medium text-cream hover:bg-card-hover transition-colors">
                <User className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <button onClick={async () => { await signOut(auth); navigate('/'); }} className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-card px-3.5 py-2 text-[13px] font-medium text-ash hover:text-cream hover:border-rose-400/30 transition-colors" aria-label="Sign out"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-border-subtle bg-card px-4 py-2 text-[13px] font-medium text-cream hover:bg-card-hover hover:border-gold/30 transition-colors">Sign in</Link>
              <Link to="/register" className="rounded-full bg-gold text-ink px-4 py-2 text-[13px] font-semibold hover:bg-parchment transition-colors shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)]">Start free trial</Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-card text-cream hover:bg-card-hover transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border-subtle bg-ink/95 backdrop-blur-2xl" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-0.5 px-6 py-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-ash hover:text-cream hover:bg-card transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="w-full rounded-xl border border-border-subtle bg-card px-4 py-3 text-sm font-medium text-cream text-center hover:bg-card-hover transition-colors">Dashboard</Link>
                  <button onClick={async () => { await signOut(auth); setOpen(false); navigate('/'); }} className="w-full rounded-xl border border-border-subtle bg-card px-4 py-3 text-sm font-medium text-ash text-center hover:text-cream transition-colors">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="w-full rounded-xl border border-border-subtle bg-card px-4 py-3 text-sm font-medium text-cream text-center hover:bg-card-hover transition-colors">Sign in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="w-full rounded-xl bg-gold text-ink px-4 py-3 text-sm font-semibold text-center hover:bg-parchment transition-colors">Start free trial</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
