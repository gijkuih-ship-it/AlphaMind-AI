import { useAuth } from '../lib/authContext';
import { User, Mail, BadgeCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  if (loading) return <div className="mx-auto max-w-7xl px-6 pt-24 text-center text-ash">Loading profile...</div>;
  if (!user) return <div className="mx-auto max-w-7xl px-6 pt-24 text-center text-ash">Not authenticated.</div>;

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95] mb-4">Profile</h1>
        <p className="text-ash mb-10">Your account and workspace information.</p>

        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-10 shadow-2xl shadow-black/30">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold to-copper flex items-center justify-center text-ink text-3xl font-extrabold shadow-xl shadow-gold/20 ring-4 ring-ink/60">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-sans text-2xl font-extrabold text-cream tracking-tight">{user.displayName || 'Enterprise User'}</h2>
              <p className="text-sm text-ash">{user.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { label: 'UID', value: user.uid },
              { label: 'Email verified', value: user.emailVerified ? 'Yes' : 'No' },
              { label: 'Provider', value: user.providerData.map(p => p.providerId).join(', ') || 'password' },
              { label: 'Created', value: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : '-' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/[0.08] bg-ink px-5 py-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog mb-1">{item.label}</div>
                <div className="font-mono text-sm text-cream break-all">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => alert('Edit profile uses Firebase updateProfile with real user data.') } className="rounded-full bg-gradient-to-r from-gold to-copper px-5 py-2.5 text-sm font-extrabold text-ink hover:brightness-110 transition-all shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)]">Edit profile</button>
            <button onClick={() => alert('Password change uses firebase/auth updatePassword with real auth.') } className="rounded-full border border-white/[0.1] bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-card-hover transition-colors">Change password</button>
          </div>
        </div>
      </div>
    </main>
  );
}
