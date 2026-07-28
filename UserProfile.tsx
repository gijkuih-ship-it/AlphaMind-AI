import { Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function UserProfile() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-28 rounded-2xl bg-card border border-white/[0.08] animate-pulse" />;
  if (!user) return null;

  const initial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

  return (
    <section aria-label="User profile" className="mb-10">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-card via-ink to-card shadow-2xl shadow-black/20 p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-gold-soft via-copper/20 to-transparent blur-[100px] opacity-60 pointer-events-none" />
        <div className="flex items-center gap-5 relative">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold to-copper flex items-center justify-center text-ink text-3xl font-extrabold shadow-xl shadow-gold/20 ring-4 ring-ink/50">
            {initial}
          </div>
          <div>
            <h2 className="font-sans text-2xl lg:text-3xl font-extrabold text-cream tracking-tight">{user.displayName || 'Enterprise User'}</h2>
            <p className="text-sm text-ash mt-1">{user.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/20 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300"><ShieldCheck className="h-3 w-3" /> Verified</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft border border-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold"><Zap className="h-3 w-3" /> Pro Plan</span>
            </div>
          </div>
        </div>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Member since', value: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024' },
            { label: 'Last login', value: user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today' },
            { label: 'Workspace', value: 'AlphaMind Enterprise' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.08] bg-ink px-5 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog mb-1">{item.label}</div>
              <div className="font-sans text-base font-bold text-cream">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
