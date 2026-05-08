import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Clock, CheckCircle2, FileText, MessageSquareWarning, AlertCircle, MapPin, CreditCard, RefreshCw } from 'lucide-react';

type SPengajuan = 'Pending' | 'Diproses' | 'Selesai' | 'Ditolak';
type SPengaduan = 'Diterima' | 'Ditinjau' | 'Dalam Penanganan' | 'Selesai';

const pjSteps = ['Pending', 'Diproses', 'Selesai'];
const pdSteps = ['Diterima', 'Ditinjau', 'Dalam Penanganan', 'Selesai'];

const pjStatusCfg: Record<SPengajuan, { cls: string; step: number; label: string }> = {
  Pending:  { cls: 'badge-pending', step: 1, label: 'Pending'  },
  Diproses: { cls: 'badge-process', step: 2, label: 'Diproses' },
  Selesai:  { cls: 'badge-done',    step: 3, label: 'Selesai'  },
  Ditolak:  { cls: 'badge-reject',  step: 0, label: 'Ditolak'  },
};
const pdStatusCfg: Record<SPengaduan, { cls: string; step: number; label: string }> = {
  Diterima:           { cls: 'badge-pending',  step: 1, label: 'Diterima'          },
  Ditinjau:           { cls: 'badge-review',   step: 2, label: 'Ditinjau'          },
  'Dalam Penanganan': { cls: 'badge-handling', step: 3, label: 'Dalam Penanganan'  },
  Selesai:            { cls: 'badge-done',     step: 4, label: 'Selesai'           },
};

function ProgressBar({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((step, i) => {
          const done = i + 1 <= currentStep;
          const active = i + 1 === currentStep;
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`step-dot ${done && !active ? 'done' : active ? 'active' : 'pending'}`}>
                  {done && !active ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.65rem', marginTop: '0.25rem', fontWeight: 600, color: done ? '#4f46e5' : '#9ca3af', whiteSpace: 'nowrap' }}>
                  {step.length > 10 ? step.substring(0, 9) + '…' : step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${i + 1 < currentStep ? 'done' : 'pending'}`} style={{ marginBottom: '1rem' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const { user } = useAuth();
  const [nik, setNik] = useState(user?.nik || '');
  const [loading, setLoading] = useState(false);
  const [pengajuan, setPengajuan] = useState<any[]>([]);
  const [pengaduan, setPengaduan] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async (searchNik: string) => {
    if (!searchNik || searchNik.length !== 16) {
        setError('NIK harus tepat 16 digit.');
        return;
    }
    try {
      setLoading(true); setError('');
      const [r1, r2] = await Promise.allSettled([
        api.get(`/pengajuan/track/${searchNik}`),
        api.get(`/pengaduan/track/${searchNik}`),
      ]);
      setPengajuan(r1.status === 'fulfilled' ? r1.value.data : []);
      setPengaduan(r2.status === 'fulfilled' ? r2.value.data : []);
      setSearched(true);
    } catch { 
        setError('Terjadi kesalahan saat memuat data.'); 
    }
    finally { setLoading(false); }
  }, []);

  // Auto fetch if user is logged in
  useEffect(() => {
    if (user?.nik) {
        fetchStatus(user.nik);
    }
  }, [user, fetchStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(nik);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const total = pengajuan.length + pengaduan.length;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      {/* Search Box */}
      <div className="card animate-fade-in-up" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #059669, #10b981)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0, color: '#0f172a' }}>Tracking Status Layanan</h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
              {user ? `Menampilkan data untuk NIK Anda: ${user.nik}` : 'Masukkan NIK untuk melihat semua pengajuan dan pengaduan Anda'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <CreditCard size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={nik} onChange={e => { setNik(e.target.value); setError(''); }}
              placeholder="Masukkan 16 digit NIK"
              className="input-field" style={{ paddingLeft: '2.5rem' }} maxLength={16} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 2px 8px rgb(5 150 105 / 0.3)' }}>
              {loading
                ? <RefreshCw className="animate-spin" size={16} />
                : <Search size={16} />}
              {loading ? 'Mencari...' : 'Cari'}
            </button>
            {user && nik !== user.nik && (
                <button type="button" onClick={() => { setNik(user.nik); fetchStatus(user.nik); }} className="btn btn-secondary">
                    Reset ke NIK Saya
                </button>
            )}
          </div>
        </form>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#dc2626', fontSize: '0.875rem' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="animate-fade-in-up">
          {total === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Search size={28} color="#cbd5e1" />
              </div>
              <h3 style={{ fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>Tidak Ada Data</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Tidak ada pengajuan atau pengaduan dengan NIK <strong>{nik}</strong></p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Ditemukan <strong style={{ color: '#0f172a' }}>{total} data</strong> untuk NIK {nik}
                </p>
              </div>

              {/* Pengajuan */}
              {pengajuan.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, background: '#eef2ff', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} color="#4f46e5" />
                    </div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Pengajuan Surat ({pengajuan.length})</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pengajuan.map((item: any) => {
                      const cfg = pjStatusCfg[item.status as SPengajuan];
                      return (
                        <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem', fontSize: '0.9375rem' }}>{item.jenis_surat}</h4>
                              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{fmtDate(item.created_at)}</p>
                            </div>
                            <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.75rem' }}>
                            <span style={{ fontWeight: 600, color: '#374151' }}>Keperluan:</span> {item.keperluan}
                          </p>
                          {item.status !== 'Ditolak' && <ProgressBar steps={pjSteps} currentStep={cfg.step} />}
                          {item.catatan_admin && (
                            <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.625rem' }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.25rem' }}>📝 Catatan Admin:</p>
                              <p style={{ fontSize: '0.8125rem', color: '#78350f', margin: 0 }}>{item.catatan_admin}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pengaduan */}
              {pengaduan.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 28, height: 28, background: '#fff1f2', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquareWarning size={14} color="#e11d48" />
                    </div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Pengaduan Masyarakat ({pengaduan.length})</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pengaduan.map((item: any) => {
                      const cfg = pdStatusCfg[item.status as SPengaduan];
                      return (
                        <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem', fontSize: '0.9375rem' }}>{item.judul}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{fmtDate(item.created_at)}</span>
                                <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '999px', fontWeight: 600, color: '#374151' }}>{item.kategori}</span>
                              </div>
                            </div>
                            <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.75rem' }}>{item.deskripsi}</p>
                          {item.lokasi && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                              <MapPin size={13} /> {item.lokasi}
                            </div>
                          )}
                          <ProgressBar steps={pdSteps} currentStep={cfg.step} />
                          {item.catatan_admin && (
                            <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.625rem' }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.25rem' }}>📝 Catatan Admin:</p>
                              <p style={{ fontSize: '0.8125rem', color: '#78350f', margin: 0 }}>{item.catatan_admin}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
