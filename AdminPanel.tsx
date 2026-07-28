import { useState, useEffect } from 'react';
import { Users, ShieldCheck, CreditCard, Layers, BarChart3, Sparkles, Search, Trash2, Edit3, Plus, CheckCircle, X } from 'lucide-react';
import { getAllUsers, getAllSubscriptions, getAllCategories, getAllTools, getAnalytics, saveUser, saveSubscription, saveCategory, saveTool, deleteCategory, deleteTool } from '../lib/firestore';
import type { UserRecord, SubscriptionRecord, CategoryRecord, AnalyticsRecord } from '../lib/firestore';

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'subs', label: 'Subscriptions', icon: CreditCard },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'tools', label: 'AI Tools', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminPanel() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState<(UserRecord & { id: string })[]>([]);
  const [subs, setSubs] = useState<(SubscriptionRecord & { id: string })[]>([]);
  const [categories, setCategories] = useState<(CategoryRecord & { id: string })[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<(AnalyticsRecord & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllUsers(), getAllSubscriptions(), getAllCategories(), getAllTools(), getAnalytics(),
    ]).then(([u, s, c, t, a]) => {
      setUsers(u);
      setSubs(s);
      setCategories(c);
      setTools(t);
      setAnalytics(a);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [tab]);

  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.displayName?.toLowerCase().includes(search.toLowerCase()));
  const filteredSubs = subs.filter(s => s.uid?.includes(search) || s.plan?.includes(search));
  const filteredCats = categories.filter(c => c.label?.toLowerCase().includes(search.toLowerCase()));
  const filteredTools = tools.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredAnalytics = analytics.filter(a => a.date?.includes(search));

  const refresh = () => {
    setLoading(true);
    Promise.all([
      getAllUsers(), getAllSubscriptions(), getAllCategories(), getAllTools(), getAnalytics(),
    ]).then(([u, s, c, t, a]) => {
      setUsers(u); setSubs(s); setCategories(c); setTools(t); setAnalytics(a);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleSaveUser = async (uid: string, updates: Partial<UserRecord>) => {
    await saveUser(uid, updates);
    refresh();
    setEditId(null);
  };

  const handleSaveSub = async (uid: string, updates: Partial<SubscriptionRecord>) => {
    await saveSubscription(uid, updates);
    refresh();
    setEditId(null);
  };

  const handleSaveCat = async (id: string, updates: Partial<CategoryRecord>) => {
    await saveCategory(id, updates);
    refresh();
    setEditId(null);
  };

  const handleSaveTool = async (id: string, updates: Partial<any>) => {
    await saveTool(id, updates);
    refresh();
    setEditId(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-soft to-copper/20 flex items-center justify-center text-gold shadow-md"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95]">Admin Panel</h1>
          <p className="text-sm text-ash">Manage all data from Firestore only.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setEditId(null); }} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${tab === t.id ? 'bg-gold text-ink shadow-[0_0_16px_-4px_rgba(200,166,110,0.35)]' : 'bg-white/[0.05] text-ash border border-white/[0.08] hover:text-cream'}`}><t.icon className="h-3.5 w-3.5" /> {t.label}</button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-fog" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-white/[0.1] bg-ink pl-9 pr-3 py-2 text-sm text-cream placeholder:text-fog focus:outline-none focus:border-gold/50" />
        </div>
        <button onClick={refresh} className="rounded-xl bg-card border border-white/[0.1] px-3 py-2 text-xs font-bold text-cream hover:bg-card-hover">Refresh</button>
      </div>

      {loading ? <div className="text-ash text-sm">Loading from Firestore...</div> : (
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-card to-ink shadow-2xl shadow-black/20 overflow-hidden">
          {tab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-parchment bg-white/[0.03] border-b border-white/[0.07]">
                  <tr><th className="px-5 py-3">UID</th><th>Email</th><th>Plan</th><th>Role</th><th>Created</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-ash truncate max-w-[140px]">{u.uid}</td>
                      <td className="px-3 py-3">{editId === u.id ? <input defaultValue={u.email} onBlur={e => handleSaveUser(u.uid, { email: e.target.value })} className="rounded bg-ink border border-white/[0.1] px-2 py-1 text-xs w-48" /> : <span className="font-medium text-cream">{u.email}</span>}</td>
                      <td className="px-3 py-3">{editId === u.id ? <select defaultValue={u.plan} onChange={e => handleSaveUser(u.uid, { plan: e.target.value as any })} className="rounded bg-ink border border-white/[0.1] text-xs"><option>free</option><option>pro</option><option>enterprise</option></select> : <span className={`font-bold text-xs ${u.plan === 'enterprise' ? 'text-gold' : 'text-cream'}`}>{u.plan}</span>}</td>
                      <td className="px-3 py-3">{editId === u.id ? <input defaultValue={u.role || 'user'} onBlur={e => handleSaveUser(u.uid, { role: e.target.value as any })} className="rounded bg-ink border border-white/[0.1] px-2 py-1 text-xs w-20" /> : <span className="text-ash">{u.role || 'user'}</span>}</td>
                      <td className="px-3 py-3 text-xs text-fog">{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => setEditId(editId === u.id ? null : u.id)} className="text-ash hover:text-cream text-xs font-bold"><Edit3 className="h-3 w-3 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'subs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-parchment bg-white/[0.03] border-b border-white/[0.07]">
                  <tr><th className="px-5 py-3">UID</th><th>Plan</th><th>Status</th><th>Cycle</th><th>Amount</th><th>Updated</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredSubs.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-ash truncate max-w-[140px]">{s.uid}</td>
                      <td className="px-3 py-3"><span className={`font-bold text-xs ${s.plan === 'enterprise' ? 'text-gold' : 'text-cream'}`}>{s.plan}</span></td>
                      <td className="px-3 py-3"><span className={`font-bold text-xs ${s.status === 'active' ? 'text-emerald-300' : s.status === 'past_due' ? 'text-amber-300' : 'text-rose-300'}`}>{s.status}</span></td>
                      <td className="px-3 py-3 text-xs text-ash">{s.billingCycle}</td>
                      <td className="px-3 py-3 text-xs text-cream">${s.amount}</td>
                      <td className="px-3 py-3 text-xs text-fog">{s.updatedAt?.toDate ? s.updatedAt.toDate().toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => handleSaveSub(s.uid, { status: s.status === 'active' ? 'canceled' : 'active' })} className="text-xs font-bold text-ash hover:text-gold underline">Toggle</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'categories' && (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-sans text-lg font-extrabold text-cream">Categories</h3>
                <button onClick={() => { const id = 'cat-' + Date.now(); saveCategory(id, { id, label: 'New', desc: '', color: 'from-gold to-copper', toolCount: 0 }); refresh(); }} className="rounded-lg bg-gold text-ink px-2.5 py-1 text-xs font-extrabold hover:brightness-110"><Plus className="h-3 w-3 inline mr-1" /> Add</button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {filteredCats.map(c => (
                  <div key={c.id} className="rounded-2xl border border-white/[0.08] bg-card p-5 hover:border-gold/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-sans text-base font-extrabold text-cream">{editId === c.id ? <input defaultValue={c.label} onBlur={e => handleSaveCat(c.id, { label: e.target.value })} className="rounded bg-ink border border-white/[0.1] px-2 py-0.5 text-sm w-32" /> : c.label}</h4>
                      <button onClick={() => deleteCategory(c.id).then(refresh)} className="text-rose-300 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-xs text-ash">{c.desc}</p>
                    <div className="mt-2 font-mono text-[10px] text-fog">{c.toolCount} tools • {c.id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tools' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-parchment bg-white/[0.03] border-b border-white/[0.07]">
                  <tr><th className="px-5 py-3">Name</th><th>Category</th><th>Pricing</th><th>Rating</th><th>Usage</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredTools.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3 font-medium text-cream">{t.name}</td>
                      <td className="px-3 py-3 text-xs text-ash">{t.category}</td>
                      <td className="px-3 py-3"><span className={`text-xs font-bold ${t.pricing === 'premium' ? 'text-gold' : 'text-emerald-300'}`}>{t.pricing}</span></td>
                      <td className="px-3 py-3 text-xs text-amber-300">{t.rating}</td>
                      <td className="px-3 py-3 text-xs text-fog">{t.usageCount?.toLocaleString() || 0}</td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => deleteTool(t.id).then(refresh)} className="text-rose-300 hover:text-rose-400 text-xs"><Trash2 className="h-3 w-3 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'analytics' && (
            <div className="p-6">
              <h3 className="font-sans text-lg font-extrabold text-cream mb-4">Analytics Overview (Firestore)</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl border border-white/[0.08] bg-ink p-6 shadow-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog mb-1">Active Users (30d)</div>
                  <div className="font-sans text-3xl font-extrabold text-cream">{analytics.reduce((sum, a) => sum + (a.activeUsers || 0), 0).toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-ink p-6 shadow-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog mb-1">Tasks Processed</div>
                  <div className="font-sans text-3xl font-extrabold text-cream">{analytics.reduce((sum, a) => sum + (a.tasksProcessed || 0), 0).toLocaleString()}</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-ink p-6 shadow-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog mb-1">Revenue (30d)</div>
                  <div className="font-sans text-3xl font-extrabold text-cream">${analytics.reduce((sum, a) => sum + (a.totalRevenue || 0), 0).toLocaleString()}</div>
                </div>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="font-mono text-[10px] uppercase tracking-[0.1em] text-parchment bg-white/[0.03] border-b border-white/[0.07]"><tr><th className="px-5 py-3">Date</th><th>Active Users</th><th>Tasks</th><th>Revenue</th><th>Latency</th></tr></thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredAnalytics.map(a => (
                    <tr key={a.id} className="hover:bg-white/[0.03] transition-colors"><td className="px-5 py-3 font-mono text-xs text-ash">{a.date}</td><td className="px-3 py-3 text-cream">{a.activeUsers}</td><td className="px-3 py-3 text-ash">{a.tasksProcessed}</td><td className="px-3 py-3 text-cream">${a.totalRevenue}</td><td className="px-3 py-3 text-ash">{a.avgLatencyMs}ms</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
