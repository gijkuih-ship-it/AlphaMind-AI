import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Ensure user record exists in Firestore on login (idempotent)
      try {
        await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, email: cred.user.email, lastLogin: serverTimestamp() }, { merge: true });
      } catch { /* ignore write errors */ }
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) { setError('Enter your email to reset'); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Reset failed');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4" aria-label="AlphaMind AI Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-card to-surface border border-white/[0.08] shadow-md shadow-black/20"><Sparkles className="h-5 w-5 text-gold" /></div>
            <div className="flex flex-col leading-none"><span className="font-sans text-base font-extrabold tracking-tight text-cream">AlphaMind</span><span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fog uppercase">AI</span></div>
          </Link>
          <h1 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight text-cream">Sign in</h1>
          <p className="mt-2 text-sm text-ash">Access your enterprise workspace securely.</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-10 shadow-2xl shadow-black/30">
          <form onSubmit={handleLogin} className="space-y-4" aria-label="Sign in form">
            <div>
              <label htmlFor="email" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-fog" />
                <input id="email" type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-ink pl-11 pr-4 py-3 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-fog" />
                <input id="password" type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-ink pl-11 pr-10 py-3 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-fog hover:text-cream" aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="rounded-lg bg-rose-900/20 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">{error}</div>}
            {resetSent && <div className="rounded-lg bg-emerald-900/20 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300">Reset email sent. Check your inbox.</div>}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-copper px-4 py-3.5 text-sm font-extrabold text-ink hover:brightness-110 transition-all shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)] disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs">
            <button onClick={handleForgot} className="text-ash hover:text-gold transition-colors underline underline-offset-2">Forgot password?</button>
            <Link to="/register" className="text-gold font-medium hover:underline underline-offset-2">Create account</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
