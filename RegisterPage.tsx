import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: email.split('@')[0] });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: email.split('@')[0],
        plan: 'free',
        role: 'user',
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed');
    } finally {
      setLoading(false);
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
          <h1 className="font-sans text-3xl lg:text-4xl font-extrabold tracking-tight text-cream">Create account</h1>
          <p className="mt-2 text-sm text-ash">Start your 14-day free trial. No card required.</p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-10 shadow-2xl shadow-black/30">
          <form onSubmit={handleRegister} className="space-y-4" aria-label="Sign up form">
            <div>
              <label htmlFor="reg-email" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-fog" />
                <input id="reg-email" type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-ink pl-11 pr-4 py-3 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-password" className="block font-mono text-[11px] font-medium uppercase tracking-widest text-parchment mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-fog" />
                <input id="reg-password" type={showPass ? 'text' : 'password'} required placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-ink pl-11 pr-10 py-3 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-fog hover:text-cream" aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="rounded-lg bg-rose-900/20 border border-rose-500/20 px-4 py-3 text-sm text-rose-300">{error}</div>}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-copper px-4 py-3.5 text-sm font-extrabold text-ink hover:brightness-110 transition-all shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)] disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? 'Creating account...' : 'Create account'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-white/[0.08]" /></div>
            <div className="relative flex justify-center"><span className="bg-ink px-3 font-mono text-xs text-fog">OR</span></div>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="mt-4 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-cream hover:bg-white/[0.07] transition-colors flex items-center justify-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.18 3.32v2.77h3.54c2.07-1.89 3.26-4.68 3.26-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.54-2.77c-.98.66-2.23 1.06-3.74 1.06-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-fog">By signing up, you agree to our <a href="#" onClick={e => e.preventDefault()} className="text-ash hover:text-cream underline underline-offset-2">Terms</a> and <a href="#" onClick={e => e.preventDefault()} className="text-ash hover:text-cream underline underline-offset-2">Privacy Policy</a>.</p>
          <p className="mt-3 text-center text-xs text-fog">Already have an account? <Link to="/login" className="text-gold font-medium hover:underline underline-offset-2">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
