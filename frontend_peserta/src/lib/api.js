const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==========================================
// API PROVINSI
// ==========================================

export async function getProvinsi() {
    const res = await fetch(`${API_URL}/provinsi`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil provinsi');
    return res.json();
}

export async function getProvinsiById(id) {
    const res = await fetch(`${API_URL}/provinsi/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil detail provinsi');
    return res.json();
}

export async function createProvinsi(data) {
    const res = await fetch(`${API_URL}/provinsi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambah provinsi');
    }
    return res.json();
}

export async function updateProvinsi(id, data) {
    const res = await fetch(`${API_URL}/provinsi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengubah provinsi');
    }
    return res.json();
}

export async function deleteProvinsi(id) {
    const res = await fetch(`${API_URL}/provinsi/${id}`, {
        method: 'DELETE',
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghapus provinsi');
    }
    return res.json();
}


// ==========================================
// API KABUPATEN / KOTA
// ==========================================

export async function getKabkoByProvinsi(idProvinsi) {
    const res = await fetch(`${API_URL}/kabko/provinsi/${idProvinsi}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Gagal mengambil kabko');
    return res.json();
}

export async function getKabkoById(id) {
    const res = await fetch(`${API_URL}/kabko/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil detail kabupaten/kota');
    return res.json();
}

export async function getKabko() {
    const res = await fetch(`${API_URL}/kabko`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil semua kabupaten/kota');
    return res.json();
}

export async function createKabko(data) {
    const res = await fetch(`${API_URL}/kabko`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambah kabupaten/kota');
    }
    return res.json();
}

export async function updateKabko(id, data) {
    const res = await fetch(`${API_URL}/kabko/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengubah kabupaten/kota');
    }
    return res.json();
}

// Fungsi untuk menghapus Kabupaten/Kota
export async function deleteKabko(id) {
    const res = await fetch(`${API_URL}/kabko/${id}`, {
        method: 'DELETE',
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghapus kabupaten/kota');
    }
    return res.json();
}
// ==========================================
// API PESERTA
// ==========================================

export async function getPeserta() {
    const res = await fetch(`${API_URL}/peserta`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil peserta');
    return res.json();
}

export async function getPesertaById(id) {
    const res = await fetch(`${API_URL}/peserta/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal mengambil detail peserta');
    return res.json();
}

export async function createPeserta(data) {
    // Menggunakan FormData agar bisa mengirim file fisik
    const formData = new FormData();
    for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    }

    const res = await fetch(`${API_URL}/peserta`, {
        method: 'POST',
        body: formData, // Browser otomatis mengatur header multipart/form-data
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambah peserta');
    }
    return res.json();
}

export async function updatePeserta(id, data) {
    // Menggunakan FormData agar bisa mengirim file fisik
    const formData = new FormData();
    for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    }

    const res = await fetch(`${API_URL}/peserta/${id}`, {
        method: 'PUT',
        body: formData,
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal mengubah peserta');
    }
    return res.json();
}

export async function deletePeserta(id) {
    const res = await fetch(`${API_URL}/peserta/${id}`, {
        method: 'DELETE',
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghapus peserta');
    }
    return res.json();
}
