import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Zap, X } from 'lucide-react';

const notifications = [
  { id: 1, title: 'New reasoning model available', body: 'Cognitive Chain v3.2 is now live in your workspace.', time: '10 min ago', type: 'info' },
  { id: 2, title: 'Usage threshold reached', body: 'You have used 75% of your monthly task quota.', time: '1h ago', type: 'warning' },
  { id: 3, title: 'Agent completed', body: 'Research agent #482 finished synthesis report.', time: '3h ago', type: 'success' },
];

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  const dismiss = (id: number) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-card text-ash hover:text-cream hover:border-gold/20 transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4.5 w-4.5" />
        {items.length > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-ink" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-card to-ink shadow-2xl shadow-black/40 overflow-hidden z-50">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
            <h3 className="font-sans text-sm font-bold text-cream">Notifications</h3>
            <button onClick={() => setOpen(false)} className="text-fog hover:text-cream"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="divide-y divide-white/[0.07] max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-5 py-6 text-xs text-fog text-center">No notifications</div>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-sans text-sm font-semibold text-cream truncate">{n.title}</h4>
                        {n.type === 'success' && <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />}
                        {n.type === 'warning' && <AlertCircle className="h-3 w-3 text-amber-400 shrink-0" />}
                        {n.type === 'info' && <Zap className="h-3 w-3 text-gold shrink-0" />}
                      </div>
                      <p className="text-xs text-ash leading-relaxed">{n.body}</p>
                      <div className="mt-1.5 font-mono text-[10px] text-fog">{n.time}</div>
                    </div>
                    <button onClick={() => dismiss(n.id)} className="text-fog hover:text-cream opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Dismiss"><X className="h-3 w-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-3 border-t border-white/[0.07] text-center">
            <button onClick={() => setOpen(false)} className="text-xs font-medium text-gold hover:underline underline-offset-4">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}
