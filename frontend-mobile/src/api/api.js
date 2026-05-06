import axios from 'axios';
import Constants from 'expo-constants';

// ─── Auto-detect IP komputer saat development ─────────────────────
const getBaseUrl = () => {
    if (__DEV__) {
        const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
        if (debuggerHost) {
            return `http://${debuggerHost}:3000`;
        }
    }
    return 'http://YOUR_PRODUCTION_URL:3000';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// ─── DASHBOARD ───────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard');

// ─── PROVINSI ────────────────────────────────────────────────────
export const getProvinsi = () => api.get('/provinsi');
export const getProvinsiById = (id) => api.get(`/provinsi/${id}`);
export const createProvinsi = (data) => api.post('/provinsi', data);
export const updateProvinsi = (id, data) => api.put(`/provinsi/${id}`, data);
export const deleteProvinsi = (id) => api.delete(`/provinsi/${id}`);

// ─── KABKO ───────────────────────────────────────────────────────
export const getKabko = () => api.get('/kabko');
export const getKabkoById = (id) => api.get(`/kabko/${id}`);
export const getKabkoByProvinsi = (idProvinsi) => api.get(`/kabko/provinsi/${idProvinsi}`);
export const createKabko = (data) => api.post('/kabko', data);
export const updateKabko = (id, data) => api.put(`/kabko/${id}`, data);
export const deleteKabko = (id) => api.delete(`/kabko/${id}`);

// ─── PESERTA ─────────────────────────────────────────────────────
export const getPeserta = () => api.get('/peserta');
export const getPesertaById = (id) => api.get(`/peserta/${id}`);
export const createPeserta = (formData) =>
    api.post('/peserta', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const updatePeserta = (id, formData) =>
    api.put(`/peserta/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const deletePeserta = (id) => api.delete(`/peserta/${id}`);

// ─── HELPER FOTO ─────────────────────────────────────────────────
export const getFotoUrl = (namaFile) =>
    `${BASE_URL}/public/uploads/foto/${namaFile}`;

export default api;