import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileText, MessageSquareWarning, Search, LayoutDashboard, Menu, X, Building2, ChevronRight, LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import PengajuanForm from './pages/PengajuanForm';
import PengaduanForm from './pages/PengaduanForm';
import TrackingPage from './pages/TrackingPage';
import AdminDashboard from './pages/AdminDashboard';

const pageLabels: Record<string, string> = {
  '/pengajuan': 'Pengajuan Surat',
  '/pengaduan': 'Pengaduan Masyarakat',
  '/tracking': 'Cek Status Layanan',
};

const navLinks = [
  { to: '/pengajuan', label: 'Pengajuan Surat', icon: FileText },
  { to: '/pengaduan', label: 'Pengaduan', icon: MessageSquareWarning },
  { to: '/tracking', label: 'Cek Status', icon: Search },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to={isAdmin ? "/admin" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgb(79 70 229 / 0.3)' }}>
              <Building2 size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', lineHeight: 1.2 }}>DesaConnect</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.2 }}>Pelayanan Publik Digital</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {!isAdmin && navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                <LayoutDashboard size={15} />
                Admin Dashboard
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hidden-mobile">
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                  <div style={{ width: 32, height: 32, background: '#eef2ff', color: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ lineHeight: 1 }}>{user.name}</span>
                    <span style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</span>
                  </div>
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <button onClick={handleLogout} className="btn btn-sm" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3' }}>
                  <LogOut size={14} />
                  Keluar
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  <LogIn size={14} />
                  Masuk
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={14} />
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }} className="show-mobile">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }} className="show-mobile">
            {!isAdmin && navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                <LayoutDashboard size={15} />
                Admin Dashboard
              </Link>
            )}
            <hr className="divider" style={{ margin: '0.5rem 0' }} />
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.875rem', background: '#f8fafc', borderRadius: '0.5rem', margin: '0.5rem 0' }}>
                  <UserIcon size={16} color="#6b7280" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{user.name} ({user.role})</span>
                </div>
                <button onClick={handleLogout} className="btn btn-sm" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', justifyContent: 'flex-start' }}>
                  <LogOut size={14} />
                  Keluar
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/login" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>
                  <LogIn size={14} />
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start' }}>
                  <UserPlus size={14} />
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}

function Breadcrumb() {
  const location = useLocation();
  const label = pageLabels[location.pathname];
  if (!label) return null;
  return (
    <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: 'white', padding: '1.25rem 0' }}>
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Beranda</Link>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ fontWeight: 600 }}>{label}</span>
        </div>
        <h1 style={{ marginTop: '0.25rem', fontSize: '1.5rem', fontWeight: 800 }}>{label}</h1>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/"} replace />;
  }

  return <>{children}</>;
}

function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Admin always redirected to /admin if they try to access landing page or other user pages
  if (user?.role === 'admin' && (isLanding || location.pathname === '/pengajuan' || location.pathname === '/pengaduan' || location.pathname === '/tracking')) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAuthPage && <Navbar />}
      {!isLanding && !isAdminPage && !isAuthPage && <Breadcrumb />}
      <main style={{ flex: 1, ...((!isLanding && !isAdminPage && !isAuthPage) ? { padding: '2rem 0' } : {}) }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />

          {/* User Protected Routes */}
          <Route path="/pengajuan" element={
            <ProtectedRoute allowedRoles={['user']}>
              <PengajuanForm />
            </ProtectedRoute>
          } />
          <Route path="/pengaduan" element={
            <ProtectedRoute allowedRoles={['user']}>
              <PengaduanForm />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={
            <ProtectedRoute allowedRoles={['user']}>
              <TrackingPage />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isAuthPage && (
        <footer style={{ background: '#0f172a', color: 'white', padding: '2rem 0', marginTop: 'auto' }}>
          <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={14} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>DesaConnect</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>Powered by AWS ECS · S3 · CloudFront · RDS</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
