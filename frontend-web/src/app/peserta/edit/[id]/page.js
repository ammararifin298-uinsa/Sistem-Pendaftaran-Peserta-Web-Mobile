import { getPesertaById } from '../../../../lib/api';
import PesertaForm from '../../../../components/PesertaForm';

export default async function EditPesertaPage({ params }) {
    // PENYESUAIAN NEXT.JS 15: params harus di-await sebelum digunakan
    const { id } = await params;
    const data = await getPesertaById(id);

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Edit Data Peserta</h2>
                <p className="text-sm text-slate-600">
                    Ubah kelengkapan data peserta yang sudah terdaftar di sistem.
                </p>
            </div>

            <PesertaForm initialData={data} isEdit={true} />
        </section>
    );
}