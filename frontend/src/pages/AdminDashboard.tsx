import { useState, useEffect } from 'react';
import api from '../api';
import {
  FileText, MessageSquareWarning, ExternalLink, CheckCircle2, Clock,
  AlertCircle, RefreshCw, MapPin, Building2, Users, TrendingUp, X
} from 'lucide-react';

type Tab = 'pengajuan' | 'pengaduan';
const pjStatuses = ['Pending', 'Diproses', 'Selesai', 'Ditolak'];
const pdStatuses = ['Diterima', 'Ditinjau', 'Dalam Penanganan', 'Selesai'];

const badgeClass: Record<string, string> = {
  Pending: 'badge-pending', Diproses: 'badge-process', Selesai: 'badge-done', Ditolak: 'badge-reject',
  Diterima: 'badge-pending', Ditinjau: 'badge-review', 'Dalam Penanganan': 'badge-handling',
};

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, background: bg, borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }}>{label}</div>
      </div>
    </div>
  );
}

function UpdateModal({ data, type, onClose, onSave }: {
  data: { id: number; status: string; catatan: string };
  type: Tab; onClose: () => void;
  onSave: (id: number, status: string, catatan: string) => void;
}) {
  const [status, setStatus] = useState(data.status);
  const [catatan, setCatatan] = useState(data.catatan);
  const statuses = type === 'pengajuan' ? pjStatuses : pdStatuses;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Update Status</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Status Baru</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="select-field">
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Catatan Admin <span className="optional">(Opsional — tampil ke warga)</span></label>
            <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={3}
              className="input-field" style={{ resize: 'none' }}
              placeholder="Misal: alasan penolakan, informasi tambahan..." />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
          <button onClick={() => onSave(data.id, status, catatan)} className="btn btn-primary" style={{ flex: 1 }}>
            <CheckCircle2 size={15} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('pengajuan');
  const [pj, setPj] = useState<any[]>([]);
  const [pd, setPd] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: Tab; id: number; status: string; catatan: string } | null>(null);
  const [toast, setToast] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([api.get('/pengajuan'), api.get('/pengaduan')]);
      setPj(r1.data); setPd(r2.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (id: number, status: string, catatan: string) => {
    try {
      const ep = modal!.type === 'pengajuan' ? `/pengajuan/${id}/status` : `/pengaduan/${id}/status`;
      await api.put(ep, { status, catatan_admin: catatan });
      setModal(null);
      setToast('✅ Status berhasil diperbarui');
      setTimeout(() => setToast(''), 3000);
      fetchAll();
    } catch { alert('Gagal memperbarui status'); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const pending  = pj.filter(x => x.status === 'Pending').length;
  const selesai  = pj.filter(x => x.status === 'Selesai').length;
  const current  = tab === 'pengajuan' ? pj : pd;

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999, background: '#0f172a', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '1.5rem 0' }}>
        <div className="page-container" style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Dashboard Admin</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', margin: 0 }}>Manajemen Layanan Publik Desa</p>
            </div>
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Memuat...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="page-container" style={{ padding: '1.5rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }} className="stagger">
          <StatCard label="Total Pengajuan"   value={pj.length} icon={FileText}            color="#4f46e5" bg="#eef2ff" />
          <StatCard label="Total Pengaduan"   value={pd.length} icon={MessageSquareWarning} color="#e11d48" bg="#fff1f2" />
          <StatCard label="Pengajuan Pending" value={pending}   icon={Clock}               color="#d97706" bg="#fffbeb" />
          <StatCard label="Pengajuan Selesai" value={selesai}   icon={TrendingUp}           color="#16a34a" bg="#f0fdf4" />
        </div>

        {/* Table Card */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', background: '#f9fafb' }}>
            {([['pengajuan', 'Pengajuan Surat', FileText, pj.length, '#4f46e5', '#eef2ff'],
               ['pengaduan', 'Pengaduan', MessageSquareWarning, pd.length, '#e11d48', '#fff1f2']] as any[]).map(
              ([key, label, Icon, count, col, bg]) => (
                <button key={key} onClick={() => setTab(key as Tab)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                    background: tab === key ? 'white' : 'transparent',
                    color: tab === key ? col : '#6b7280',
                    borderBottom: tab === key ? `2px solid ${col}` : '2px solid transparent',
                    border: 'none', borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                    transition: 'all 0.15s',
                  }}>
                  <Icon size={15} />
                  {label}
                  <span style={{ padding: '0.1rem 0.5rem', background: tab === key ? bg : '#f3f4f6', color: tab === key ? col : '#9ca3af', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
                </button>
              )
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#9ca3af', gap: '0.75rem' }}>
              <RefreshCw size={20} className="animate-spin" />
              <span>Memuat data...</span>
            </div>
          ) : current.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <AlertCircle size={40} color="#e5e7eb" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#9ca3af' }}>Belum ada data {tab}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              {tab === 'pengajuan' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="table-header">
                      <th>ID</th>
                      <th>Pemohon</th>
                      <th>Jenis Surat</th>
                      <th>Keperluan</th>
                      <th>KTP</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pj.map(item => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>#{item.id}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{item.nama_lengkap}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>NIK: {item.nik}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{item.no_telp}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', maxWidth: 160 }}>{item.jenis_surat}</td>
                        <td style={{ maxWidth: 160 }}>
                          <p className="truncate-2" style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>{item.keperluan}</p>
                        </td>
                        <td>
                          <a href={item.ktp_url} target="_blank" rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', background: '#eef2ff', color: '#4f46e5', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            Lihat <ExternalLink size={11} />
                          </a>
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{fmtDate(item.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <span className={`badge ${badgeClass[item.status] || 'badge-pending'}`}>{item.status}</span>
                            {item.catatan_admin && (
                              <span style={{ fontSize: '0.7rem', color: '#9ca3af', maxWidth: 120 }} className="truncate-2">📝 {item.catatan_admin}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button onClick={() => setModal({ type: 'pengajuan', id: item.id, status: item.status, catatan: item.catatan_admin || '' })}
                            className="btn btn-secondary btn-sm">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="table-header">
                      <th>ID</th>
                      <th>Pelapor</th>
                      <th>Kategori</th>
                      <th>Judul & Lokasi</th>
                      <th>Foto</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pd.map(item => (
                      <tr key={item.id} className="table-row">
                        <td style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600 }}>#{item.id}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{item.nama_pelapor}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>NIK: {item.nik}</div>
                        </td>
                        <td>
                          <span style={{ padding: '0.2rem 0.625rem', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                            {item.kategori}
                          </span>
                        </td>
                        <td style={{ maxWidth: 180 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0f172a' }} className="truncate-2">{item.judul}</div>
                          {item.lokasi && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                              <MapPin size={11} />{item.lokasi}
                            </div>
                          )}
                        </td>
                        <td>
                          {item.foto_url ? (
                            <a href={item.foto_url} target="_blank" rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', background: '#fff1f2', color: '#e11d48', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                              Lihat <ExternalLink size={11} />
                            </a>
                          ) : <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>—</span>}
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{fmtDate(item.created_at)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <span className={`badge ${badgeClass[item.status] || 'badge-pending'}`}>{item.status}</span>
                            {item.catatan_admin && (
                              <span style={{ fontSize: '0.7rem', color: '#9ca3af', maxWidth: 120 }} className="truncate-2">📝 {item.catatan_admin}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button onClick={() => setModal({ type: 'pengaduan', id: item.id, status: item.status, catatan: item.catatan_admin || '' })}
                            className="btn btn-secondary btn-sm">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <UpdateModal data={{ id: modal.id, status: modal.status, catatan: modal.catatan }} type={modal.type} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
