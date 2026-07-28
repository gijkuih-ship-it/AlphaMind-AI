import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BrainCircuit, Star, Clock, CreditCard, Settings, User, ShieldCheck, ChevronRight, Sparkles
} from 'lucide-react';

const items = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Tools', href: '/tools', icon: BrainCircuit },
  { label: 'Favorites', href: '/dashboard/favorites', icon: Star },
  { label: 'History', href: '/dashboard/history', icon: Clock },
  { label: 'Pricing', href: '/pricing-preview', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Admin', href: '/admin', icon: ShieldCheck },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex md:hidden flex-col lg:sticky lg:top-20 h-[calc(100vh-5rem)] border-r border-white/[0.07] bg-gradient-to-b from-card/60 to-ink/80 backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-20 px-2' : 'w-72 px-4'}`}
      aria-label="Dashboard sidebar"
    >
      <div className={`flex items-center gap-3 h-16 border-b border-white/[0.07] ${collapsed ? 'justify-center' : 'justify-start'}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft to-copper/20 text-gold shadow-[inset_0_1px_0_rgba(200,166,110,0.1)]">
          <Sparkles className="h-4 w-4" />
        </div>
        {!collapsed && <span className="font-sans text-sm font-extrabold tracking-tight text-cream truncate">AlphaMind</span>}
      </div>

      <nav className="flex-1 py-5 space-y-0.5" aria-label="Dashboard navigation">
        {items.map((item) => {
          const active = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? 'bg-gold-soft text-gold border border-gold/10 shadow-[inset_0_1px_0_rgba(200,166,110,0.1)]' : 'text-ash hover:text-cream hover:bg-white/[0.04]'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-gold' : 'text-fog'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className={`py-4 border-t border-white/[0.07] ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-fog hover:text-cream transition-colors font-mono uppercase tracking-widest"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '« Collapse'}
        </button>
      </div>
    </aside>
  );
}
