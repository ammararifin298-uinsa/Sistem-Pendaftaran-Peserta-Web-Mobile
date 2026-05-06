import PesertaForm from '../../../components/PesertaForm';

export default function TambahPesertaPage() {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Tambah Peserta</h2>
                <p className="text-sm text-slate-600">
                    Isi formulir untuk menambahkan data peserta baru.
                </p>
            </div>

            <PesertaForm />
        </section>
    );
}