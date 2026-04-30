'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    createPeserta,
    updatePeserta,
    getProvinsi,
    getKabkoByProvinsi,
} from '../lib/api';
import { useToast } from './Toast';

export default function PesertaForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const addToast = useToast();

    const [form, setForm] = useState({
        nama: '', tempatlahir: '', tanggallahir: '', agama: '',
        alamat: '', telepon: '', jk: '', cita_cita: '',
        hobi: '', pas_foto: '', idkabko: '',
    });

    /* ── Inline validation errors ── */
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [provinsi, setProvinsi] = useState([]);
    const [kabko, setKabko] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState('');

    useEffect(() => {
        async function initializeData() {
            try {
                const provData = await getProvinsi();
                setProvinsi(provData);

                if (isEdit && initialData) {
                    setForm({
                        nama: initialData.nama || '',
                        tempatlahir: initialData.tempatlahir || '',
                        tanggallahir: initialData.tanggallahir ? initialData.tanggallahir.substring(0, 10) : '',
                        agama: initialData.agama || '',
                        alamat: initialData.alamat || '',
                        telepon: initialData.telepon || '',
                        jk: String(initialData.jk) || '',
                        cita_cita: initialData.cita_cita || '',
                        hobi: initialData.hobi || '',
                        pas_foto: initialData.pas_foto || '',
                        idkabko: '',
                    });

                    const provId = initialData.id_provinsi || initialData.idprovinsi;
                    if (provId) {
                        setSelectedProvinsi(provId);
                        const kabkoData = await getKabkoByProvinsi(provId);
                        setKabko(kabkoData);
                        setForm((prev) => ({
                            ...prev,
                            idkabko: initialData.idkabko || initialData.id_kabko || '',
                        }));
                    }
                }
            } catch (error) {
                console.error('Gagal sinkronisasi data awal:', error);
            }
        }
        initializeData();
    }, [initialData, isEdit]);

    /* ── Validation rules ── */
    function validate(f, prov) {
        const e = {};
        if (!f.nama.trim())          e.nama = 'Nama lengkap wajib diisi.';
        if (!f.jk)                   e.jk = 'Pilih jenis kelamin.';
        if (!f.tempatlahir.trim())   e.tempatlahir = 'Tempat lahir wajib diisi.';
        if (!f.tanggallahir)         e.tanggallahir = 'Tanggal lahir wajib diisi.';
        if (!prov)                   e.selectedProvinsi = 'Pilih provinsi terlebih dahulu.';
        if (!f.idkabko)              e.idkabko = 'Pilih kabupaten/kota.';
        return e;
    }

    /* ── Mark field as touched on blur ── */
    function handleBlur(name) {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const e = validate(form, selectedProvinsi);
        setErrors(e);
    }

    async function handleProvinsiChange(e) {
        const idProvinsi = e.target.value;
        setSelectedProvinsi(idProvinsi);
        setForm((prev) => ({ ...prev, idkabko: '' }));
        setTouched((prev) => ({ ...prev, selectedProvinsi: true }));

        if (!idProvinsi) { setKabko([]); return; }
        try {
            const data = await getKabkoByProvinsi(idProvinsi);
            setKabko(data);
        } catch (error) {
            addToast('Gagal mengambil data Kabupaten/Kota: ' + error.message, 'error');
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field as user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, pas_foto: file }));
        } else {
            setForm((prev) => ({ ...prev, pas_foto: isEdit ? initialData?.pas_foto : '' }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        // Mark all required fields as touched to reveal errors
        setTouched({ nama: true, jk: true, tempatlahir: true, tanggallahir: true, selectedProvinsi: true, idkabko: true });
        const e2 = validate(form, selectedProvinsi);
        setErrors(e2);
        if (Object.keys(e2).length > 0) {
            addToast('Periksa kembali isian form.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit && initialData?.id) {
                await updatePeserta(initialData.id, form);
                addToast('Data peserta berhasil diperbarui!', 'success');
            } else {
                await createPeserta(form);
                addToast('Data peserta baru berhasil ditambahkan!', 'success');
            }
            router.push('/peserta');
            router.refresh();
        } catch (error) {
            addToast('Gagal memproses data: ' + error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    /* ── Styles ── */
    const inputBase = 'w-full rounded-xl border px-3 py-2 outline-none transition-all bg-white';
    function inputClass(name) {
        const hasError = touched[name] && errors[name];
        return `${inputBase} ${hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400'
            : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
        }`;
    }
    const fileInputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all';
    const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

    function FieldError({ name }) {
        if (!touched[name] || !errors[name]) return null;
        return (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg style={{ width: 12, height: 12, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[name]}
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" noValidate>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
                    <input className={inputClass('nama')} type="text" name="nama" value={form.nama}
                        onChange={handleChange} onBlur={() => handleBlur('nama')} />
                    <FieldError name="nama" />
                </div>
                <div>
                    <label className={labelClass}>Jenis Kelamin <span style={{ color: '#ef4444' }}>*</span></label>
                    <select className={inputClass('jk')} name="jk" value={form.jk}
                        onChange={handleChange} onBlur={() => handleBlur('jk')}>
                        <option value="">-- Pilih Jenis Kelamin --</option>
                        <option value="1">Laki-laki</option>
                        <option value="2">Perempuan</option>
                    </select>
                    <FieldError name="jk" />
                </div>
                <div>
                    <label className={labelClass}>Tempat Lahir <span style={{ color: '#ef4444' }}>*</span></label>
                    <input className={inputClass('tempatlahir')} type="text" name="tempatlahir" value={form.tempatlahir}
                        onChange={handleChange} onBlur={() => handleBlur('tempatlahir')} />
                    <FieldError name="tempatlahir" />
                </div>
                <div>
                    <label className={labelClass}>Tanggal Lahir <span style={{ color: '#ef4444' }}>*</span></label>
                    <input className={inputClass('tanggallahir')} type="date" name="tanggallahir" value={form.tanggallahir}
                        onChange={handleChange} onBlur={() => handleBlur('tanggallahir')} />
                    <FieldError name="tanggallahir" />
                </div>
                <div>
                    <label className={labelClass}>Agama</label>
                    <input className={inputClass('agama')} type="text" name="agama" value={form.agama} onChange={handleChange} />
                </div>
                <div>
                    <label className={labelClass}>Telepon</label>
                    <input className={inputClass('telepon')} type="text" name="telepon" value={form.telepon} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelClass}>Alamat Lengkap</label>
                    <textarea className={inputClass('alamat')} name="alamat" rows="2" value={form.alamat} onChange={handleChange} />
                </div>
                <div>
                    <label className={labelClass}>Cita-Cita</label>
                    <input className={inputClass('cita_cita')} type="text" name="cita_cita" value={form.cita_cita} onChange={handleChange} />
                </div>
                <div>
                    <label className={labelClass}>Hobi</label>
                    <input className={inputClass('hobi')} type="text" name="hobi" value={form.hobi} onChange={handleChange} />
                </div>
                <div>
                    <label className={labelClass}>Provinsi Domisili <span style={{ color: '#ef4444' }}>*</span></label>
                    <select className={inputClass('selectedProvinsi')} value={selectedProvinsi}
                        onChange={handleProvinsiChange} onBlur={() => handleBlur('selectedProvinsi')}>
                        <option value="">-- Pilih Provinsi --</option>
                        {provinsi.map((item) => (
                            <option key={item.id} value={item.id}>{item.nama}</option>
                        ))}
                    </select>
                    <FieldError name="selectedProvinsi" />
                </div>
                <div>
                    <label className={labelClass}>Kabupaten/Kota <span style={{ color: '#ef4444' }}>*</span></label>
                    <select className={inputClass('idkabko')} name="idkabko" value={form.idkabko}
                        onChange={handleChange} onBlur={() => handleBlur('idkabko')} disabled={!selectedProvinsi}>
                        <option value="">-- Pilih Kab/Kota --</option>
                        {kabko.map((item) => (
                            <option key={item.id} value={item.id}>{item.nama}</option>
                        ))}
                    </select>
                    <FieldError name="idkabko" />
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>Upload Pas Foto</label>
                    {isEdit && initialData?.pas_foto && typeof form.pas_foto === 'string' && (
                        <div className="mb-2" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px' }}>
                            <img
                                src={`http://localhost:3000/public/uploads/foto/${initialData.pas_foto}`}
                                alt="Foto saat ini"
                                style={{ width: 40, height: 54, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0', flexShrink: 0 }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>FOTO SAAT INI</p>
                                <p style={{ margin: 0, fontSize: 12, color: '#475569', fontWeight: 500 }}>{initialData.pas_foto}</p>
                            </div>
                        </div>
                    )}
                    <input className={fileInputClass} type="file" name="pas_foto" accept="image/*" onChange={handleFileChange} />
                    <p className="text-xs text-slate-400 mt-1.5">
                        *Format didukung: JPG, PNG, JPEG. (Maks 5MB).
                        {isEdit ? ' Biarkan kosong jika tidak ingin mengubah foto.' : ''}
                    </p>
                </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.push('/peserta')}
                    className="rounded-xl bg-slate-100 px-8 py-3 font-semibold text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                    style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                    {isSubmitting ? 'Menyimpan…' : (isEdit ? 'Update Data' : 'Simpan Data')}
                </button>
            </div>
        </form>
    );
}