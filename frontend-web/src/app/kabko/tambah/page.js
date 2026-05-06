'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProvinsi, getKabkoByProvinsi, createKabko, deleteKabko } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function TambahKabkoPage() {
    const addToast = useToast();
    // --- STATE FORM ---
    const [provinsiList, setProvinsiList] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [namaKabko, setNamaKabko] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- STATE TABEL ---
    const [kabkoList, setKabkoList] = useState([]);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    async function fetchProvinsi() {
        try {
            const data = await getProvinsi();
            setProvinsiList(data);
        } catch (error) {
            console.error('Gagal memuat provinsi:', error);
        }
    }

    async function fetchTableData(idProvinsi) {
        setIsLoadingTable(true);
        try {
            const data = await getKabkoByProvinsi(idProvinsi);
            setKabkoList(data);
        } catch (error) {
            console.error('Gagal memuat data kab/kota:', error);
            setKabkoList([]);
        } finally {
            setIsLoadingTable(false);
        }
    }

    // 1. Tarik data Provinsi untuk Dropdown saat halaman pertama dimuat
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProvinsi();
    }, []);

    // 2. Tarik data Kab/Kota HANYA JIKA ada Provinsi yang dipilih
    useEffect(() => {
        if (selectedProvinsi) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchTableData(selectedProvinsi);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeout(() => setKabkoList([]), 0); // Kosongkan tabel jika tidak ada provinsi yg dipilih
        }
    }, [selectedProvinsi]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedProvinsi) {
            addToast('Silakan pilih provinsi terlebih dahulu!', 'info');
            return;
        }
        if (!namaKabko.trim()) return;

        setIsSubmitting(true);
        try {
            await createKabko({ id_provinsi: selectedProvinsi, nama: namaKabko });
            addToast('Berhasil menambahkan Kabupaten/Kota baru!', 'success');
            setNamaKabko(''); 
            fetchTableData(selectedProvinsi); 
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
            await deleteKabko(id);
            addToast('Data berhasil dihapus.', 'success');
            fetchTableData(selectedProvinsi);
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
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Tambah Kabupaten / Kota</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Provinsi</label>
                            <select
                                required
                                value={selectedProvinsi}
                                onChange={(e) => setSelectedProvinsi(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                            >
                                <option value="">-- Pilih Provinsi --</option>
                                {provinsiList.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kabupaten / Kota</label>
                            <input
                                type="text"
                                required
                                value={namaKabko}
                                onChange={(e) => setNamaKabko(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Contoh: Kota Surabaya"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setNamaKabko('');
                                    setSelectedProvinsi('');
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors w-full text-center"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{ backgroundColor: '#7c3aed' }}
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
            {/* Jarak mutlak mt-14 (Sama persis dengan Provinsi) */}
            {/* ========================================= */}
            <div className="max-w-5xl mx-auto px-4" style={{ marginTop: '32px' }}>

                <div className="mb-4">
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>Daftar Kabupaten / Kota</h2>
                    <p className="text-sm text-slate-500 mt-1">Data master wilayah kabupaten dan kota.</p>
                </div>

                <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700 border-b">
                            <tr>
                                <th className="px-4 py-4 text-center font-semibold w-16">No</th>
                                <th className="px-4 py-4 text-left font-semibold">Nama Kabupaten / Kota</th>
                                <th className="px-4 py-4 text-center font-semibold w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {!selectedProvinsi ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">Silakan pilih provinsi terlebih dahulu untuk melihat data.</td>
                                </tr>
                            ) : isLoadingTable ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">Memuat data...</td>
                                </tr>
                            ) : kabkoList.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">Belum ada data kabupaten/kota di provinsi ini.</td>
                                </tr>
                            ) : (
                                kabkoList.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{item.nama}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-3 justify-center items-center">
                                                <Link
                                                    href={`/kabko/edit/${item.id}`}
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
                message="Apakah Anda yakin ingin menghapus data kabupaten/kota ini?"
                confirmLabel="Ya, Hapus"
                confirmColor="#dc2626"
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}