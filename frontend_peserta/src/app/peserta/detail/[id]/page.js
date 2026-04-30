'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPesertaById } from '../../../../lib/api';

const BACKEND = 'http://localhost:3000';

export default function DetailPeserta() {
    const params = useParams();
    const id = params?.id;

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function fetchData() {
            try {
                const result = await getPesertaById(id);
                setData(result);
            } catch (error) {
                console.error('Gagal memuat data', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 mt-8 pb-12">
                <div style={{ height: 360, borderRadius: 18, background: '#f1f5f9', animation: 'sk 1.5s ease infinite' }} />
                <style>{`@keyframes sk{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-5xl mx-auto px-4 mt-16" style={{ textAlign: 'center', color: '#64748b' }}>
                <p style={{ fontWeight: 600 }}>Data peserta tidak ditemukan.</p>
                <Link href="/peserta" style={{ color: '#2563eb', fontSize: 13 }}>← Kembali</Link>
            </div>
        );
    }

    const fotoUrl = data.pas_foto && !imgError ? `${BACKEND}/public/uploads/foto/${data.pas_foto}` : null;
    const inisial = data.nama?.charAt(0)?.toUpperCase() || '?';
    const isLaki = String(data.jk) === '1';

    const Field = ({ label, value }) => (
        <div>
            <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
            </p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1e293b', lineHeight: 1.5 }}>
                {value || <span style={{ color: '#cbd5e1' }}>—</span>}
            </p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 mt-8 pb-12">
            <div style={{
                background: '#fff',
                borderRadius: 18,
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,.06)',
                overflow: 'hidden',
            }}>
                {/* Stripe aksen atas */}
                <div style={{ height: 4, background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }} />

                {/* Header: foto + identitas */}
                <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #f1f5f9' }}>

                    {/* Foto — flush kiri, full height */}
                    <div style={{
                        width: 170,
                        minHeight: 230,
                        flexShrink: 0,
                        overflow: 'hidden',
                        borderRight: '1px solid #f1f5f9',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {fotoUrl ? (
                            <img
                                src={fotoUrl}
                                alt={data.nama}
                                onError={() => setImgError(true)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: 52, fontWeight: 800, color: '#cbd5e1', lineHeight: 1 }}>
                                {inisial}
                            </span>
                        )}
                    </div>

                    {/* Identitas */}
                    <div style={{ flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Profil Peserta
                        </p>
                        <h1 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
                            {data.nama}
                        </h1>
                        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                            {isLaki ? 'Laki-laki' : 'Perempuan'}
                            {data.agama ? ` · ${data.agama}` : ''}
                        </p>
                        {(data.nama_kabko || data.nama_provinsi) && (
                            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#94a3b8' }}>
                                {[data.nama_kabko, data.nama_provinsi].filter(Boolean).join(', ')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Body: grid data */}
                <div style={{ padding: '28px 36px' }}>
                    <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                        Informasi Lengkap
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px' }}>
                        <Field label="Tempat Lahir" value={data.tempatlahir} />
                        <Field label="Tanggal Lahir" value={formatDate(data.tanggallahir)} />
                        <Field label="Jenis Kelamin" value={isLaki ? 'Laki-laki' : 'Perempuan'} />
                        <Field label="Agama" value={data.agama} />
                        <Field label="Telepon" value={data.telepon} />
                        <Field label="Cita-cita" value={data.cita_cita} />
                        <Field label="Hobi" value={data.hobi} />
                        <Field label="Kabupaten / Kota" value={data.nama_kabko} />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <Field label="Alamat Lengkap" value={data.alamat} />
                        </div>
                    </div>
                </div>

                {/* Footer: tombol */}
                <div style={{ padding: '18px 36px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Link href="/peserta" style={{
                        padding: '8px 20px', borderRadius: 10,
                        background: '#f8fafc', color: '#475569',
                        fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
                        border: '1px solid #e2e8f0',
                    }}>
                        Kembali
                    </Link>
                    <Link href={`/peserta/edit/${data.id}`} style={{
                        padding: '8px 20px', borderRadius: 10,
                        background: '#2563eb', color: '#fff',
                        fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
                    }}>
                        Edit Data
                    </Link>
                </div>
            </div>
        </div>
    );
}