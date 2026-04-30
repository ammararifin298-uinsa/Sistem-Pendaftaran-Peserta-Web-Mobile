import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <h1 className="text-lg font-bold text-slate-800">Frontend Peserta</h1>
                <div className="flex gap-3">
                    <Link
                        href="/"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Home
                    </Link>
                    
                    <Link
                        href="/peserta"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Peserta
                    </Link>

                    {/* --- MENU BARU DITAMBAHKAN DI SINI --- */}
                    <Link
                        href="/provinsi/tambah"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Tambah Provinsi
                    </Link>

                    <Link
                        href="/kabko/tambah"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                        Tambah Kab/Kota
                    </Link>
                    {/* ----------------------------------- */}

                    <Link
                        href="/peserta/tambah"
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Tambah Peserta
                    </Link>
                </div>
            </div>
        </nav>
    );
}