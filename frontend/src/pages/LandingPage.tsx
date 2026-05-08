import { Link } from 'react-router-dom';
import { FileText, MessageSquareWarning, Search, ArrowRight, Users, CheckCircle2, Clock, ShieldCheck, Building2, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 300, height: 300, background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="page-container" style={{ padding: '5rem 1.5rem 4rem', position: 'relative' }}>
          <div style={{ maxWidth: '48rem' }} className="animate-fade-in-up">
            {/* Pill badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.375rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <Building2 size={13} />
              Layanan Resmi Pemerintah Desa
            </div>

            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Pelayanan Publik Desa<br />
              <span className="gradient-text">Mudah & Digital</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem', maxWidth: '38rem', lineHeight: 1.7 }}>
              Urus kebutuhan administrasi, sampaikan pengaduan, dan pantau prosesnya — semua dari rumah tanpa perlu antri di kantor desa.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link to="/pengajuan" className="btn btn-lg" style={{ background: 'white', color: '#4338ca', fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                Mulai Pengajuan <ArrowRight size={18} />
              </Link>
              <Link to="/tracking" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                <Search size={16} />
                Cek Status Saya
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginBottom: -1 }}>
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 0C480 0 240 60 0 20L0 60Z" fill="#f8fafc"/>
        </svg>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────── */}
      <section className="page-container" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} className="stagger">
          {[
            { icon: Users,        val: '2.847',  label: 'Warga Terdaftar',    color: '#6366f1', bg: '#eef2ff' },
            { icon: CheckCircle2, val: '1.234',  label: 'Pengajuan Selesai',  color: '#16a34a', bg: '#f0fdf4' },
            { icon: Clock,        val: '2 Hari', label: 'Rata-rata Proses',   color: '#d97706', bg: '#fffbeb' },
            { icon: ShieldCheck,  val: '98%',    label: 'Kepuasan Warga',     color: '#0891b2', bg: '#f0f9ff' },
          ].map(({ icon: Icon, val, label, color, bg }) => (
            <div key={label} className="card card-hover" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, background: bg, borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.125rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '4rem 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div className="page-container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-block', background: '#eef2ff', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.875rem', borderRadius: '999px', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Layanan Tersedia
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Semua Kebutuhan Anda,<br />Satu Platform</h2>
            <p style={{ color: '#6b7280', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>Tidak perlu datang ke kantor. Proses online, transparan, dan bisa dipantau kapan saja.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                to: '/pengajuan',
                icon: FileText,
                iconBg: '#eef2ff', iconColor: '#4f46e5',
                accentBg: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                title: 'Pengajuan Surat',
                desc: 'Ajukan surat keterangan domisili, usaha, pengantar SKCK, dan lainnya secara online.',
                tags: ['Domisili', 'Usaha', 'SKCK', 'Tidak Mampu'],
                img: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=400&h=200&fit=crop&crop=center&auto=format',
              },
              {
                to: '/pengaduan',
                icon: MessageSquareWarning,
                iconBg: '#fff1f2', iconColor: '#e11d48',
                accentBg: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                title: 'Lapor Pengaduan',
                desc: 'Sampaikan keluhan terkait infrastruktur, kebersihan, keamanan, atau fasilitas umum.',
                tags: ['Infrastruktur', 'Kebersihan', 'Keamanan'],
                img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=200&fit=crop&crop=center&auto=format',
              },
              {
                to: '/tracking',
                icon: Search,
                iconBg: '#f0fdf4', iconColor: '#16a34a',
                accentBg: 'linear-gradient(135deg, #16a34a, #22c55e)',
                title: 'Tracking Status',
                desc: 'Pantau perkembangan pengajuan atau pengaduan Anda secara real-time menggunakan NIK.',
                tags: ['Real-time', 'NIK', 'Progress'],
                img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop&crop=center&auto=format',
              },
            ].map(({ to, icon: Icon, iconBg, iconColor, accentBg, title, desc, tags, img }) => (
              <Link to={to} key={to} style={{ textDecoration: 'none' }}>
                <div className="card card-hover" style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: 40, height: 40, background: 'white', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <Icon size={20} color={iconColor} />
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>{desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                      {tags.map(t => (
                        <span key={t} style={{ padding: '0.2rem 0.625rem', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, color: '#374151' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, color: iconColor }}>
                      Akses Layanan <ArrowRight size={15} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ background: '#0f172a', color: 'white', padding: '5rem 0' }}>
        <div className="page-container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Cara Penggunaan</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem' }}>Tiga langkah mudah untuk mendapatkan layanan</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', icon: FileText, title: 'Isi Formulir', desc: 'Lengkapi data diri dan pilih jenis layanan yang Anda butuhkan melalui form online kami.' },
              { step: '02', icon: ArrowRight, title: 'Unggah Dokumen', desc: 'Upload foto KTP atau foto bukti laporan (untuk pengaduan). File tersimpan aman di AWS S3.' },
              { step: '03', icon: Search, title: 'Pantau Status', desc: 'Gunakan NIK Anda di halaman Cek Status untuk memantau progress secara real-time.' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: '#312e81' }}>{step}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Icon size={16} color="#818cf8" />
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)', borderTop: '1px solid #e0e7ff' }}>
        <div className="page-container" style={{ textAlign: 'center', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.875rem' }}>Siap Menggunakan Layanan?</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>Daftarkan pengajuan Anda sekarang. Proses cepat, transparan, dan tanpa biaya.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/pengajuan" className="btn btn-primary btn-lg">
              <FileText size={18} />
              Buat Pengajuan Surat
            </Link>
            <Link to="/pengaduan" className="btn btn-lg" style={{ background: 'white', color: '#374151', border: '1.5px solid #e5e7eb' }}>
              <MessageSquareWarning size={18} />
              Lapor Pengaduan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
