import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, User, Phone, CreditCard } from 'lucide-react';

const jenisSuratOptions = [
  'Surat Keterangan Domisili',
  'Surat Keterangan Usaha',
  'Surat Pengantar SKCK',
  'Surat Keterangan Tidak Mampu',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Kematian',
];

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <div style={{ height: 18, width: 3, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: 2 }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4f46e5' }}>{children}</span>
    </div>
  );
}

export default function PengajuanForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    nama_lengkap: user?.name || '', 
    nik: user?.nik || '', 
    no_telp: '', 
    jenis_surat: jenisSuratOptions[0], 
    keperluan: '' 
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Sync with auth user if login happens after page load
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nama_lengkap: user.name,
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
    if (!file) return setAlert({ type: 'error', msg: 'Foto KTP wajib diunggah sebelum mengirim pengajuan.' });

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('ktp', file);

    try {
      setLoading(true);
      setAlert(null);
      await api.post('/pengajuan', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAlert({ type: 'success', msg: '✅ Pengajuan berhasil dikirim! Silakan pantau status Anda di halaman "Cek Status".' });
      
      // Reset non-user fields
      setForm({ 
        ...form,
        no_telp: '', 
        jenis_surat: jenisSuratOptions[0], 
        keperluan: '' 
      });
      setFile(null);
      const el = document.getElementById('ktp-upload') as HTMLInputElement;
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
        {/* Card header */}
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', padding: '1.5rem 1.75rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <FileText size={22} />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>Form Pengajuan Surat</h2>
            <p style={{ fontSize: '0.8125rem', opacity: 0.8, margin: 0 }}>Isi semua data dengan lengkap dan benar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Data Pemohon */}
          <div>
            <SectionTitle>Data Pemohon</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label"><User size={13} />Nama Lengkap</label>
                <input name="nama_lengkap" required value={form.nama_lengkap} onChange={handleChange}
                  className="input-field" placeholder="Nama sesuai KTP" readOnly={!!user} style={user ? { background: '#f8fafc', color: '#64748b' } : {}} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label"><CreditCard size={13} />NIK</label>
                  <input name="nik" required maxLength={16} minLength={16} value={form.nik} onChange={handleChange}
                    className="input-field" placeholder="16 digit NIK" readOnly={!!user} style={user ? { background: '#f8fafc', color: '#64748b' } : {}} />
                </div>
                <div>
                  <label className="form-label"><Phone size={13} />No. Telepon</label>
                  <input name="no_telp" required value={form.no_telp} onChange={handleChange}
                    className="input-field" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Detail Permohonan */}
          <div>
            <SectionTitle>Detail Permohonan</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Jenis Surat yang Dimohon</label>
                <select name="jenis_surat" value={form.jenis_surat} onChange={handleChange} className="select-field">
                  {jenisSuratOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Keperluan / Tujuan</label>
                <textarea name="keperluan" required rows={3} value={form.keperluan} onChange={handleChange}
                  className="input-field" style={{ resize: 'none' }} placeholder="Jelaskan keperluan pengajuan surat Anda secara singkat" />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Upload KTP */}
          <div>
            <SectionTitle>Upload Foto KTP</SectionTitle>
            <label htmlFor="ktp-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <div className={`upload-area ${file ? 'has-file' : ''}`}>
                {file ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, background: '#eef2ff', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={20} color="#4f46e5" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e1b4b' }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{(file.size / 1024).toFixed(1)} KB · Klik untuk ganti</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={36} color="#a5b4fc" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Klik untuk upload Foto KTP</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Format PNG, JPG — Maks. 5MB</div>
                  </>
                )}
              </div>
              <input id="ktp-upload" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            {loading ? (
              <>
                <span className="animate-spin" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />
                Mengirim Pengajuan...
              </>
            ) : (
              <>
                <FileText size={18} />
                Kirim Pengajuan Surat
              </>
            )}
          </button>
        </form>
      </div>

      {/* Helper card */}
      <div className="card" style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <p style={{ fontSize: '0.8125rem', color: '#0369a1', margin: 0 }}>
          <strong>💡 Info:</strong> Pengajuan Anda akan otomatis terhubung dengan akun Anda. Pantau progress di halaman <strong>Cek Status</strong>.
        </p>
      </div>
    </div>
  );
}
