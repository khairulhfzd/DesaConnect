import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, AlertCircle, MessageSquareWarning, User, Phone, CreditCard, MapPin } from 'lucide-react';

const kategoriOptions = ['Infrastruktur','Kebersihan','Keamanan','Pelayanan Publik','Fasilitas Umum','Lainnya'];

const kategoriIcon: Record<string, string> = {
  Infrastruktur: '🏗️', Kebersihan: '🧹', Keamanan: '🛡️',
  'Pelayanan Publik': '🏛️', 'Fasilitas Umum': '🏫', Lainnya: '📋',
};

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <div style={{ height: 18, width: 3, background: 'linear-gradient(135deg, #e11d48, #f43f5e)', borderRadius: 2 }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e11d48' }}>{children}</span>
    </div>
  );
}

export default function PengaduanForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    nama_pelapor: user?.name || '', 
    nik: user?.nik || '', 
    no_telp: '', 
    kategori: kategoriOptions[0], 
    judul: '', 
    deskripsi: '', 
    lokasi: '' 
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nama_pelapor: user.name,
        nik: user.nik
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append('foto', file);

    try {
      setLoading(true);
      setAlert(null);
      await api.post('/pengaduan', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAlert({ type: 'success', msg: '✅ Pengaduan berhasil dikirim! Pantau status Anda di halaman "Cek Status".' });
      
      setForm({ 
        ...form,
        no_telp: '', 
        kategori: kategoriOptions[0], 
        judul: '', 
        deskripsi: '', 
        lokasi: '' 
      });
      setFile(null);
      const el = document.getElementById('foto-upload') as HTMLInputElement;
      if (el) el.value = '';
    } catch (err: any) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Terjadi kesalahan. Pastikan server backend berjalan.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="animate-fade-in-up">
      {alert && (
        <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
          {alert.type === 'success' ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> : <AlertCircle size={18} style={{ flexShrink: 0 }} />}
          <span>{alert.msg}</span>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)', padding: '1.5rem 1.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquareWarning size={22} />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>Form Lapor Pengaduan</h2>
            <p style={{ fontSize: '0.8125rem', opacity: 0.8, margin: 0 }}>Sampaikan keluhan Anda kepada perangkat desa</p>
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pilih Kategori Cepat</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {kategoriOptions.map(k => (
              <button key={k} type="button"
                onClick={() => setForm({ ...form, kategori: k })}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                  background: form.kategori === k ? '#be123c' : 'white',
                  color: form.kategori === k ? 'white' : '#374151',
                  border: form.kategori === k ? '1.5px solid #be123c' : '1.5px solid #e5e7eb',
                  transition: 'all 0.15s',
                }}>
                {kategoriIcon[k]} {k}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <SectionTitle>Data Pelapor</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label"><User size={13} />Nama Lengkap</label>
                <input name="nama_pelapor" required value={form.nama_pelapor} onChange={handleChange} className="input-field" placeholder="Nama Anda" readOnly={!!user} style={user ? { background: '#f8fafc', color: '#64748b' } : {}} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label"><CreditCard size={13} />NIK</label>
                  <input name="nik" required maxLength={16} minLength={16} value={form.nik} onChange={handleChange} className="input-field" placeholder="16 digit NIK" readOnly={!!user} style={user ? { background: '#f8fafc', color: '#64748b' } : {}} />
                </div>
                <div>
                  <label className="form-label"><Phone size={13} />No. Telepon</label>
                  <input name="no_telp" required value={form.no_telp} onChange={handleChange} className="input-field" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div>
            <SectionTitle>Detail Pengaduan</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Judul Pengaduan</label>
                <input name="judul" required value={form.judul} onChange={handleChange} className="input-field" placeholder="Ringkasan singkat masalah Anda" />
              </div>
              <div>
                <label className="form-label">Deskripsi Lengkap</label>
                <textarea name="deskripsi" required rows={4} value={form.deskripsi} onChange={handleChange}
                  className="input-field" style={{ resize: 'none' }}
                  placeholder="Jelaskan masalah secara detail..." />
              </div>
              <div>
                <label className="form-label"><MapPin size={13} />Lokasi <span className="optional">(Opsional)</span></label>
                <input name="lokasi" value={form.lokasi} onChange={handleChange} className="input-field" placeholder="Contoh: Jl. Merdeka No. 1..." />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div>
            <SectionTitle>Foto Bukti (Opsional)</SectionTitle>
            <label htmlFor="foto-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <div className={`upload-area ${file ? 'has-file' : ''}`} style={{ borderColor: file ? '#e11d48' : undefined, background: file ? '#fff1f2' : undefined }}>
                {file ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, background: '#fff1f2', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={20} color="#e11d48" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#881337' }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={36} color="#fca5a5" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Klik untuk upload Foto Bukti</div>
                  </>
                )}
              </div>
              <input id="foto-upload" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="btn btn-lg"
            style={{ width: '100%', background: loading ? '#fca5a5' : 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)', color: 'white', boxShadow: '0 2px 8px rgb(225 29 72 / 0.3)' }}>
            {loading ? 'Mengirim...' : <><MessageSquareWarning size={18} />Kirim Pengaduan</>}
          </button>
        </form>
      </div>
    </div>
  );
}
