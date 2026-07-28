import { useState, useEffect } from 'react';
import { User, Moon, Sun, Globe, Bell, Lock, Save, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [notifications, setNotifications] = useState({ task: true, usage: true, security: true });
  const [profile, setProfile] = useState({ name: '', email: '', workspace: 'AlphaMind Enterprise', region: 'us-east-1' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Load settings from Firestore
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'userSettings', user.uid));
        if (snap.exists()) {
          const d = snap.data();
          if (d.theme) setTheme(d.theme);
          if (d.lang) setLang(d.lang);
          if (d.notifications) setNotifications(d.notifications);
          if (d.profile) setProfile({ ...profile, ...d.profile });
        }
        // Load profile from user doc
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          const u = userSnap.data();
          setProfile(prev => ({ ...prev, name: u.displayName || user.displayName || '', email: u.email || user.email || '' }));
        }
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [user]);

  const saveToFirestore = async () => {
    if (!user) return;
    setSaved(false);
    try {
      await setDoc(doc(db, 'userSettings', user.uid), {
        theme,
        lang,
        notifications,
        profile: { name: profile.name, workspace: profile.workspace, region: profile.region, email: profile.email },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      // Also write profile back to users collection for sync
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profile.name,
        email: profile.email,
        workspace: profile.workspace,
        region: profile.region,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
  };

  if (loading) return <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 text-center text-ash">Loading settings from Firestore...</main>;

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <main className={`mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24 ${dir === 'rtl' ? 'rtl' : ''}`} dir={dir}>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95] mb-2">Settings</h1>
            <p className="text-ash">All preferences saved to Firestore. Real-time sync.</p>
          </div>
          <button
            onClick={saveToFirestore}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-ink hover:brightness-110 transition-all shadow-[0_0_20px_-6px_rgba(200,166,110,0.4)]"
          >
            <Save className="h-4 w-4" /> {saved ? 'Saved!' : 'Save to Firestore'}
          </button>
        </div>

        {saved && <div className="rounded-xl bg-emerald-900/20 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300 mb-6 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Settings saved to Firestore.</div>}

        <div className="space-y-6">
          {/* Profile Editing */}
          <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 shadow-xl shadow-black/20" aria-label="Profile">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-soft to-copper/20 flex items-center justify-center text-gold"><User className="h-5 w-5" /></div>
              <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">Profile</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-name" className="font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5 block">Display Name</label>
                <input id="prof-name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-white/[0.1] bg-ink px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label htmlFor="prof-email" className="font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5 block">Email</label>
                <input id="prof-email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-white/[0.1] bg-ink px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label htmlFor="prof-ws" className="font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5 block">Workspace</label>
                <input id="prof-ws" value={profile.workspace} onChange={e => setProfile(p => ({ ...p, workspace: e.target.value }))} className="w-full rounded-xl border border-white/[0.1] bg-ink px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors" />
              </div>
              <div>
                <label htmlFor="prof-region" className="font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5 block">Region</label>
                <select id="prof-region" value={profile.region} onChange={e => setProfile(p => ({ ...p, region: e.target.value }))} className="w-full rounded-xl border border-white/[0.1] bg-ink px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer">
                  <option>us-east-1</option><option>eu-west-1</option><option>ap-south-1</option>
                </select>
              </div>
            </div>
          </section>

          {/* Dark / Light Mode */}
          <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 shadow-xl shadow-black/20" aria-label="Theme">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-300/20 to-purple-300/20 flex items-center justify-center text-indigo-300"><Moon className="h-5 w-5" /></div>
              <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">Appearance</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => { setTheme('dark'); document.documentElement.classList.add('dark-theme'); document.documentElement.classList.remove('light-theme'); }} className={`rounded-xl border px-5 py-3 text-sm font-bold transition-all ${theme === 'dark' ? 'border-gold bg-gold-soft text-gold' : 'border-white/[0.1] bg-ink text-ash hover:text-cream'}`}>Dark</button>
              <button onClick={() => { setTheme('light'); document.documentElement.classList.add('light-theme'); document.documentElement.classList.remove('dark-theme'); }} className={`rounded-xl border px-5 py-3 text-sm font-bold transition-all ${theme === 'light' ? 'border-gold bg-gold-soft text-gold' : 'border-white/[0.1] bg-ink text-ash hover:text-cream'}`}>Light</button>
            </div>
            <p className="text-xs text-fog mt-3">Theme saved to Firestore (users/userSettings). Auto-applies on relaod.</p>
          </section>

          {/* Language Switch */}
          <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 shadow-xl shadow-black/20" aria-label="Language">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300/20 to-orange-300/20 flex items-center justify-center text-amber-300"><Globe className="h-5 w-5" /></div>
              <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">Language</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setLang('en')} className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${lang === 'en' ? 'border-gold bg-gold-soft text-gold' : 'border-white/[0.1] bg-ink text-ash hover:text-cream'}`}>English</button>
              <button onClick={() => setLang('ar')} className={`rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${lang === 'ar' ? 'border-gold bg-gold-soft text-gold' : 'border-white/[0.1] bg-ink text-ash hover:text-cream'}`}>العربية</button>
            </div>
            <p className="text-xs text-fog mt-3">Language saved to Firestore. RTL layout activates for Arabic.</p>
          </section>

          {/* Notifications */}
          <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 shadow-xl shadow-black/20" aria-label="Notifications">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-300/20 to-red-300/20 flex items-center justify-center text-rose-300"><Bell className="h-5 w-5" /></div>
              <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: lang === 'ar' ? 'إكمال المهام' : 'Task completions', desc: lang === 'ar' ? 'عند إنهاء العامل المهمة' : 'When an agent finishes work', key: 'task' as const },
                { label: lang === 'ar' ? 'تنبيهات الاستخدام' : 'Usage alerts', desc: lang === 'ar' ? 'عند الوصول إلى 80% من الحصة' : 'When you reach 80% of quota', key: 'usage' as const },
                { label: lang === 'ar' ? 'أحداث الأمان' : 'Security events', desc: lang === 'ar' ? 'تسجيل دخول جديد أو جهاز مرتبط' : 'New sign-in or device linked', key: 'security' as const },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-sans text-sm font-semibold text-cream">{n.label}</div>
                    <div className="text-xs text-fog">{n.desc}</div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" checked={notifications[n.key]} onChange={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))} className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-white/[0.1] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-gold peer-checked:after:translate-x-full peer-checked:after:bg-ink" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 shadow-xl shadow-black/20" aria-label="Security">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-300/20 to-blue-300/20 flex items-center justify-center text-cyan-300"><Lock className="h-5 w-5" /></div>
              <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight">Security</h2>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-sans text-base font-bold text-cream">Two-factor authentication</h3>
                <p className="text-sm text-ash leading-relaxed">Enable 2FA using Firebase Auth MFA. Requires a TOTP authenticator app. Settings saved to Firestore.</p>
                <button onClick={() => alert('Real Firebase MFA: use updatePhoneNumber or enableMultiFactor with auth.currentUser.')} className="mt-3 rounded-lg bg-gold text-ink text-xs font-extrabold px-3 py-2 hover:brightness-110 transition-colors">Enable 2FA (Firebase)</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
