import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state, or default to '/'
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // small delay for feel
    await new Promise(r => setTimeout(r, 400));
    
    const result = await login(form.username, form.password);
    if (result.ok) {
      // Re-fetch user from localStorage to decide redirect
      const savedUser = JSON.parse(localStorage.getItem('desaconnect_user') || '{}');
      if (savedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error || 'Login gagal');
    }
    setLoading(false);
  };

  const quickLogin = (username: string, password: string) => {
    setForm({ username, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 400, height: 400, background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Left panel - info */}
      <div style={{
        flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center', padding: '4rem',
        color: 'white', position: 'relative',
      }} className="left-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '3rem' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>DesaConnect</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Sistem Pelayanan Publik Desa</div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
          Selamat Datang di<br />
          <span style={{ color: '#a5b4fc' }}>Portal Layanan Desa</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          Platform digital untuk pengajuan surat, pelaporan pengaduan, dan pemantauan status layanan desa secara online.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: '📄', text: 'Pengajuan surat keterangan online' },
            { icon: '📣', text: 'Laporan pengaduan masyarakat' },
            { icon: '🔍', text: 'Tracking status real-time' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - login form */}
      <div style={{
        width: '100%', maxWidth: '480px', margin: 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
        }} className="animate-fade-in-up">
          {/* Logo & Back button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>DesaConnect</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Masuk ke akun Anda</div>
              </div>
            </div>
            <Link to="/" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Beranda
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="form-label"><User size={13} />Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Masukkan username"
                  required autoFocus
                />
              </div>
            </div>

            <div>
              <label className="form-label"><Lock size={13} />Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  placeholder="Masukkan password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0.125rem' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Belum punya akun? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>Daftar di sini <UserPlus size={14} /></Link>
          </div>

          {/* Quick login hints */}
          <div style={{ marginTop: '1.75rem', padding: '1.125rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔑 Akun Demo
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>Admin Desa</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>admin / admin123</span>
                </div>
                <button type="button" onClick={() => quickLogin('admin', 'admin123')}
                  className="btn btn-sm btn-secondary">Gunakan</button>
              </div>
              <div style={{ border: 'none', borderTop: '1px dashed #e5e7eb', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>Warga Desa</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>budi / budi123</span>
                </div>
                <button type="button" onClick={() => quickLogin('budi', 'budi123')}
                  className="btn btn-sm btn-secondary">Gunakan</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .left-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}
