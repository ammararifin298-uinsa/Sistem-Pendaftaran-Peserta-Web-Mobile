'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProvinsi, createProvinsi, deleteProvinsi } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function ProvinsiPage() {
    const addToast = useToast();
    const [namaProvinsi, setNamaProvinsi] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [provinsi, setProvinsi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setIsLoading(true);
        try {
            const data = await getProvinsi();
            setProvinsi(data);
        } catch (error) {
            console.error('Gagal memuat data provinsi:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createProvinsi({ nama: namaProvinsi });
            addToast('Berhasil menambahkan Provinsi baru!', 'success');
            setNamaProvinsi(''); 
            fetchData(); 
        } catch (error) {
            addToast('Gagal: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleDeleteClick(id) { setPendingDeleteId(id); }

    async function handleConfirmDelete() {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deleteProvinsi(id);
            addToast('Data provinsi berhasil dihapus.', 'success');
            fetchData(); 
        } catch (error) {
            addToast('Gagal menghapus: ' + error.message, 'error');
        }
    }

    return (
        <div className="pb-20">
            
            {/* ========================================= */}
            {/* AREA FORM */}
            {/* ========================================= */}
            <div className="max-w-5xl mx-auto px-4 mt-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Tambah Provinsi</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Provinsi</label>
                            <input
                                type="text"
                                required
                                value={namaProvinsi}
                                onChange={(e) => setNamaProvinsi(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Contoh: Jawa Timur"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setNamaProvinsi('')}
                                className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors w-full text-center"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{ backgroundColor: '#16a34a' }}
                                className="px-4 py-2 text-white font-semibold rounded-xl hover:opacity-90 transition-all w-full disabled:opacity-50"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ========================================= */}
            {/* AREA TABEL */}
            {/* mt-14 mengatur jarak renggang dari form ke tulisan Daftar Provinsi */}
            {/* ========================================= */}
            <div className="max-w-5xl mx-auto px-4" style={{ marginTop: '32px' }}>
                
                {/* mb-4 mengatur jarak wajar dari tulisan ke tabel */}
                <div className="mb-4">
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Daftar Provinsi</h2>
                    <p className="text-sm text-slate-500 mt-1">Data master wilayah provinsi.</p>
                </div>

                <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700 border-b">
                            <tr>
                                <th className="px-4 py-4 text-center font-semibold w-16">No</th>
                                <th className="px-4 py-4 text-left font-semibold">Nama Provinsi</th>
                                <th className="px-4 py-4 text-center font-semibold w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">Memuat data...</td>
                                </tr>
                            ) : provinsi.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">Belum ada data provinsi.</td>
                                </tr>
                            ) : (
                                provinsi.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.nama}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3 justify-center items-center">
                                                <Link
                                                    href={`/provinsi/edit/${item.id}`}
                                                    style={{ backgroundColor: '#2563EB', color: 'white' }}
                                                    className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-80 transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(item.id)}
                                                    style={{ backgroundColor: '#EF4444', color: 'white' }}
                                                    className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-80 transition-all"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                open={pendingDeleteId !== null}
                message="Apakah Anda yakin ingin menghapus data provinsi ini?"
                confirmLabel="Ya, Hapus"
                confirmColor="#dc2626"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}