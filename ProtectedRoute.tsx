import { useAuth } from '../lib/authContext';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-24 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-white/[0.08] mb-4"><ShieldCheck className="h-6 w-6 text-gold animate-pulse" /></div>
      <p className="text-ash">Verifying session...</p>
    </main>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
