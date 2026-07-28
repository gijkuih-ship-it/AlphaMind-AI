import { Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import UsageStats from '../components/UsageStats';
import QuickActions from '../components/QuickActions';
import FavoritesSection from '../components/FavoritesSection';
import ActivityHistory from '../components/ActivityHistory';
import NotificationsPanel from '../components/NotificationsPanel';

export default function DashboardPage() {
  const { user } = useAuth();
  const [planData, setPlanData] = useState<{ plan: string; status: string; billing: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'subscriptions', user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setPlanData({ plan: d.plan || 'free', status: d.status || 'active', billing: d.billingCycle || 'monthly' });
      } else {
        setPlanData({ plan: 'free', status: 'inactive', billing: 'monthly' });
      }
    });
  }, [user]);

  const plan = planData?.plan || 'free';
  const planDisplay = plan === 'free' ? 'Starter' : plan === 'pro' ? 'Pro' : 'Enterprise';
  const statusDisplay = planData?.status === 'active' ? 'Active' : 'Inactive';

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95]">Dashboard</h1>
          <p className="text-ash mt-2">Your workspace overview and quick controls.</p>
        </div>
        <div className="hidden md:block"><NotificationsPanel /></div>
      </div>

      <UserProfile />
      <UsageStats />
      <QuickActions />
      <FavoritesSection />
      <ActivityHistory />

      <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink p-8 lg:p-10 shadow-xl shadow-black/20" aria-label="Subscription status">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-sans text-2xl font-extrabold text-cream tracking-tight">Subscription</h2>
            <p className="text-sm text-ash mt-1">{planDisplay} Plan • {statusDisplay} • {planData?.billing || 'monthly'} billing</p>
          </div>
          <div className="flex gap-3">
            <Link to="/pricing" className="rounded-full border border-white/[0.1] bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-card-hover transition-colors">Manage billing</Link>
            <Link to="/pricing" className="rounded-full bg-gradient-to-r from-gold to-copper px-5 py-2.5 text-sm font-extrabold text-ink shadow-[0_0_24px_-6px_rgba(200,166,110,0.35)] hover:brightness-110 transition-all">Upgrade</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
