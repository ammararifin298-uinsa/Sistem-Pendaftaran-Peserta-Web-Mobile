'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProvinsi, getKabkoById, updateKabko } from '@/lib/api';

export default function EditKabko() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    // --- STATE ---
    const [provinsiList, setProvinsiList] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [namaKabko, setNamaKabko] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function initData() {
        try {
            // Jalankan ambil list provinsi dan detail kabko secara paralel (lebih cepat)
            const [dataProvinsi, dataKabko] = await Promise.all([
                getProvinsi(),
                getKabkoById(id)
            ]);

            setProvinsiList(dataProvinsi);
            
            // Set data lama ke dalam form
            // Pastikan field 'id_provinsi' sesuai dengan response API Anda
            setSelectedProvinsi(dataKabko.id_provinsi);
            setNamaKabko(dataKabko.nama);
        } catch (error) {
            alert('Gagal mengambil data: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
            initData();
        }
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateKabko(id, { 
                id_provinsi: selectedProvinsi, 
                nama: namaKabko 
            });
            alert('Data Kabupaten/Kota berhasil diperbarui!');
            
            // Redirect kembali ke halaman utama Kabko (tambah)
            router.push('/kabko/tambah');
            router.refresh(); 
        } catch (error) {
            alert('Gagal update: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <div className="text-center mt-20 text-slate-500 font-medium">Memuat data...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Kabupaten / Kota</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* PILIH PROVINSI */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Provinsi</label>
                    <select
                        required
                        value={selectedProvinsi}
                        onChange={(e) => setSelectedProvinsi(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                        {provinsiList.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                                {prov.nama}
                            </option>
                        ))}
                    </select>
                </div>

                {/* NAMA KABKO */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Kabupaten / Kota
                    </label>
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
                    <Link
                        href="/kabko/tambah"
                        className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors w-full text-center"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors w-full disabled:opacity-50"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Update Data'}
                    </button>
                </div>
            </form>
        </div>
    );
}