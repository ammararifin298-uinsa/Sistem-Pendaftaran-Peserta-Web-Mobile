'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProvinsiById, updateProvinsi } from '@/lib/api';

export default function EditProvinsi() {
    const router = useRouter();
    const params = useParams(); 
    const id = params?.id;

    const [namaProvinsi, setNamaProvinsi] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function fetchDetail() {
        try {
            const data = await getProvinsiById(id);
            setNamaProvinsi(data.nama);
        } catch (error) {
            alert('Gagal mengambil data provinsi: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
            fetchDetail();
        }
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateProvinsi(id, { nama: namaProvinsi });
            alert('Data provinsi berhasil diperbarui!');
            // Arahkan kembali ke /provinsi/tambah setelah sukses
            router.push('/provinsi/tambah');
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Provinsi</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Provinsi
                    </label>
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
                    {/* Arahkan tombol Batal ke /provinsi/tambah */}
                    <Link
                        href="/provinsi/tambah"
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