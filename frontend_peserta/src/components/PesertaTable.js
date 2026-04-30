'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePeserta } from '../lib/api';
import { useToast } from './Toast';
import ConfirmModal from './ConfirmModal';

export default function PesertaTable({ data }) {
    const router = useRouter();
    const addToast = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    /* ── Search filter ── */
    const filtered = data.filter((item) => {
        const q = searchTerm.toLowerCase();
        return (
            item.nama?.toLowerCase().includes(q) ||
            item.nama_kabko?.toLowerCase().includes(q) ||
            item.nama_provinsi?.toLowerCase().includes(q)
        );
    });

    /* ── Delete flow ── */
    function handleDeleteClick(id) { setPendingDeleteId(id); }
    function handleCancelDelete()  { setPendingDeleteId(null); }

    async function handleConfirmDelete() {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        setIsDeleting(true);
        try {
            await deletePeserta(id);
            addToast('Data peserta berhasil dihapus.', 'success');
            router.refresh();
        } catch (error) {
            addToast('Gagal menghapus: ' + error.message, 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="space-y-3">
            {/* ── Search bar ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#fff',
                padding: '10px 16px',
                borderRadius: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,.07)',
                border: '1px solid #e2e8f0',
            }}>
                <svg style={{ width: 18, height: 18, color: '#94a3b8', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Cari nama, kab/kota, atau provinsi…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        color: '#1e293b',
                        background: 'transparent',
                    }}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{
                            background: '#f1f5f9', border: 'none', borderRadius: '50%',
                            width: 22, height: 22, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#64748b', fontSize: '12px', flexShrink: 0,
                        }}
                    >✕</button>
                )}
                <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {filtered.length} data
                </span>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200" style={{ position: 'relative' }}>
                {isDeleting && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(255,255,255,.7)',
                        backdropFilter: 'blur(2px)', zIndex: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '16px',
                    }}>
                        <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Menghapus data…</span>
                    </div>
                )}
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700 border-b">
                        <tr>
                            <th className="px-4 py-4 text-center font-semibold w-12">No</th>
                            <th className="px-4 py-4 text-center font-semibold w-20">Foto</th>
                            <th className="px-4 py-4 text-left font-semibold">Nama Lengkap</th>
                            <th className="px-4 py-4 text-left font-semibold">Jenis Kelamin</th>
                            <th className="px-4 py-4 text-left font-semibold">TTL</th>
                            <th className="px-4 py-4 text-left font-semibold">Domisili</th>
                            <th className="px-4 py-4 text-center font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>

                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center items-center">
                                        {item.pas_foto ? (
                                            <>
                                                <img
                                                    src={`http://localhost:3000/public/uploads/foto/${item.pas_foto}`}
                                                    alt={item.nama}
                                                    style={{
                                                        width: '75px', height: '100px', minWidth: '75px',
                                                        objectFit: 'cover', borderRadius: '8px'
                                                    }}
                                                    className="border border-slate-300 shadow-sm"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'inline-block';
                                                    }}
                                                />
                                                <span
                                                    style={{ display: 'none' }}
                                                    className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-1 rounded border border-slate-200 max-w-[75px] truncate"
                                                    title={`File tidak ditemukan: ${item.pas_foto}`}
                                                >{item.pas_foto}</span>
                                            </>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
                                                <span className="text-sm font-bold text-slate-400">
                                                    {item.nama ? item.nama.charAt(0).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-4 py-3 font-medium text-slate-900">{item.nama}</td>
                                <td className="px-4 py-3 text-slate-600">
                                    {String(item.jk) === '1' ? 'Laki-laki' : 'Perempuan'}
                                </td>
                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                    {item.tempatlahir}, {formatDate(item.tanggallahir)}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                    <span className="font-medium text-slate-700">{item.nama_kabko || '-'}</span><br />
                                    <span className="text-[11px] text-slate-400">{item.nama_provinsi || '-'}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-3 justify-center items-center">
                                        <Link
                                            href={`/peserta/detail/${item.id}`}
                                            style={{ backgroundColor: '#10B981', color: 'white' }}
                                            className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-80 transition-all"
                                        >Detail</Link>
                                        <Link
                                            href={`/peserta/edit/${item.id}`}
                                            style={{ backgroundColor: '#2563EB', color: 'white' }}
                                            className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-80 transition-all"
                                        >Edit</Link>
                                        <button
                                            onClick={() => handleDeleteClick(item.id)}
                                            style={{ backgroundColor: '#EF4444', color: 'white' }}
                                            className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-80 transition-all"
                                        >Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-4 py-12 text-center">
                                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                                        {searchTerm
                                            ? `Tidak ada data yang cocok dengan "${searchTerm}".`
                                            : 'Belum ada data peserta.'
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Confirm Modal ── */}
            <ConfirmModal
                open={pendingDeleteId !== null}
                message="Apakah Anda yakin ingin menghapus data peserta ini? Tindakan ini tidak dapat dibatalkan."
                confirmLabel="Ya, Hapus"
                confirmColor="#dc2626"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}