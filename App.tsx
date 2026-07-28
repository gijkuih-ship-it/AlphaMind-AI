import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/authContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import PlatformPage from './pages/PlatformPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FavoritesPage from './pages/FavoritesPage';
import ToolPage from './pages/ToolPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import PricingPreviewPage from './pages/PricingPreviewPage';
import AIToolsEnginePage from './pages/AIToolsEnginePage';
import ToolDetailPage from './pages/ToolDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-ink text-cream selection:bg-gold/25">
          <Header />
          <div className="flex-1 flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/solutions" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/research" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/tools" element={<ToolPage />} />
                <Route path="/dashboard/favorites" element={<FavoritesPage />} />
                <Route path="/dashboard/history" element={<HistoryPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/pricing-preview" element={<PricingPreviewPage />} />
              <Route path="/tools" element={<AIToolsEnginePage />} />
              <Route path="/tools/:id" element={<ToolDetailPage />} />
            </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
