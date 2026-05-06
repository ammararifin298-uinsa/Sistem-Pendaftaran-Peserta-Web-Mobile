import Link from 'next/link';
import { getPeserta, getProvinsi, getKabko } from '../lib/api';

/* ─── Ikon SVG ─────────────────────────────────────── */
function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m4-4a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 100-6 3 3 0 000 6zM3 20a3 3 0 016 0" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-2M5 21H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4" />
    </svg>
  );
}

/* ─── Styles (inline, agar tidak bergantung Tailwind scanning) ── */
const s = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '16px 0',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,.07)',
    border: '1px solid #e2e8f0',
    padding: '24px 28px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,.07)',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  actionCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,.07)',
    border: '1px solid #e2e8f0',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  iconBox: (bg, color) => ({
    flexShrink: 0,
    borderRadius: '12px',
    padding: '10px',
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  statLabel: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#94a3b8',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1,
  },
  sectionTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  tagText: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#94a3b8',
  },
  desc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: 1.6,
    flex: 1,
  },
  btnPrimary: (color, hoverColor) => ({
    display: 'block',
    textAlign: 'center',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
    background: color,
    textDecoration: 'none',
    transition: 'opacity .15s',
  }),
  btnSecondary: {
    display: 'block',
    textAlign: 'center',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    background: '#f1f5f9',
    textDecoration: 'none',
    transition: 'opacity .15s',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '4px',
  },
};

/* ─── Page Component ─────────────────────────────────── */
export default async function HomePage() {
  let pesertaCount = '—';
  let provinsiCount = '—';
  let kabkoCount = '—';

  try {
    const [pesertaData, provinsiData, kabkoData] = await Promise.all([
      getPeserta(),
      getProvinsi(),
      getKabko(),
    ]);

    pesertaCount = Array.isArray(pesertaData) ? pesertaData.length : '—';
    provinsiCount = Array.isArray(provinsiData) ? provinsiData.length : '—';
    kabkoCount = Array.isArray(kabkoData) ? kabkoData.length : '—';
  } catch {
    // API belum tersedia — tampilkan '—'
  }

  return (
    <div style={s.page}>

      {/* ── Header Card ── */}
      <div style={s.card}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Dashboard Registrasi
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, maxWidth: '620px' }}>
          Frontend ini dibuat dengan{' '}
          <strong style={{ color: '#334155' }}>Next.js App Router</strong> dan{' '}
          <strong style={{ color: '#334155' }}>Tailwind CSS</strong>, terhubung ke backend{' '}
          <strong style={{ color: '#334155' }}>Node.js + PostgreSQL</strong>.
          Gunakan menu di bawah untuk mengelola data peserta, kabupaten/kota, dan provinsi.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={s.grid3}>
        {/* Peserta */}
        <div style={s.statCard}>
          <div style={s.iconBox('#eff6ff', '#2563eb')}><IconUsers /></div>
          <div>
            <p style={s.statLabel}>Total Peserta</p>
            <p style={s.statValue}>{pesertaCount}</p>
          </div>
        </div>

        {/* Kab/Kota */}
        <div style={s.statCard}>
          <div style={s.iconBox('#f5f3ff', '#7c3aed')}><IconBuilding /></div>
          <div>
            <p style={s.statLabel}>Kab / Kota</p>
            <p style={s.statValue}>{kabkoCount}</p>
          </div>
        </div>

        {/* Provinsi */}
        <div style={s.statCard}>
          <div style={s.iconBox('#f0fdf4', '#16a34a')}><IconMap /></div>
          <div>
            <p style={s.statLabel}>Provinsi</p>
            <p style={s.statValue}>{provinsiCount}</p>
          </div>
        </div>
      </div>

      {/* ── Action Cards ── */}
      <div style={s.grid3}>
        {/* Peserta */}
        <div style={s.actionCard}>
          <div style={s.sectionTag}>
            <span style={s.dot('#2563eb')}></span>
            <span style={s.tagText}>Peserta</span>
          </div>
          <p style={s.desc}>
            Lihat seluruh data peserta yang terdaftar atau tambahkan entri baru.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/peserta" style={s.btnPrimary('#2563eb')}>
              Buka Tabel Peserta
            </Link>
            <Link href="/peserta/tambah" style={s.btnSecondary}>
              Tambah Peserta
            </Link>
          </div>
        </div>

        {/* Kab/Kota */}
        <div style={s.actionCard}>
          <div style={s.sectionTag}>
            <span style={s.dot('#7c3aed')}></span>
            <span style={s.tagText}>Kab / Kota</span>
          </div>
          <p style={s.desc}>
            Kelola data kabupaten dan kota yang tersedia sebagai referensi peserta.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/kabko/tambah" style={s.btnPrimary('#7c3aed')}>
              Tambah Kab / Kota
            </Link>
          </div>
        </div>

        {/* Provinsi */}
        <div style={s.actionCard}>
          <div style={s.sectionTag}>
            <span style={s.dot('#16a34a')}></span>
            <span style={s.tagText}>Provinsi</span>
          </div>
          <p style={s.desc}>
            Kelola data provinsi yang menjadi induk dari kabupaten / kota.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/provinsi/tambah" style={s.btnPrimary('#16a34a')}>
              Tambah Provinsi
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <p style={s.footerNote}>
        Data diambil secara real-time dari API — refresh halaman untuk memperbarui statistik.
      </p>

    </div>
  );
}