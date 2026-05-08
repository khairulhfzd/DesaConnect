import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, User, UserPlus, AlertCircle, ArrowLeft, CreditCard, UserCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nik: '', nama: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (form.nik.length !== 16) {
        setError('NIK harus 16 digit');
        setLoading(false);
        return;
    }

    const result = await register(form);
    if (result.ok) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error || 'Registrasi gagal');
    }
    setLoading(false);
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
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a' }}>DesaConnect</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Daftar Akun Baru</div>
              </div>
            </div>
            <Link to="/login" style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Login
            </Link>
          </div>

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              <span>Registrasi berhasil! Mengalihkan ke login...</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label className="form-label"><CreditCard size={13} />NIK (16 Digit)</label>
              <input
                value={form.nik}
                onChange={e => setForm({ ...form, nik: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                className="input-field"
                placeholder="Masukkan NIK Anda"
                required
              />
            </div>

            <div>
              <label className="form-label"><UserCircle size={13} />Nama Lengkap</label>
              <input
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                className="input-field"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div>
              <label className="form-label"><User size={13} />Username</label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })}
                className="input-field"
                placeholder="Buat username"
                required
              />
            </div>

            <div>
              <label className="form-label"><Lock size={13} />Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="Buat password"
                required
              />
            </div>

            <button type="submit" disabled={loading || success} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '1.5rem' }}>
            Sudah punya akun? <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
