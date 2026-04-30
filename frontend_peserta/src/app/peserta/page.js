import { getPeserta } from '../../lib/api';
import PesertaTable from '../../components/PesertaTable';

export default async function PesertaPage() {
    const data = await getPeserta();

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Daftar Peserta</h2>
                <p className="text-sm text-slate-600">
                    Data peserta beserta kabko dan provinsi.
                </p>
            </div>

            <PesertaTable data={data} />
        </section>
    );
}