const pesertaModel = require('../models/pesertaModel');
const fs = require('fs');
const path = require('path');

const getAllPeserta = async (req, res) => {
    try {
        const data = await pesertaModel.getAllPeserta();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPesertaById = async (req, res) => {
    try {
        const data = await pesertaModel.getPesertaById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Peserta tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPeserta = async (req, res) => {
    try {
        // --- RADAR DEBUGGING ---
        console.log("=== DATA DITERIMA DI BACKEND ===");
        console.log("Data Teks (req.body):", req.body);
        console.log("Data File (req.file):", req.file);
        // -----------------------

        if (req.file) {
            req.body.pas_foto = req.file.filename;
        }

        const data = await pesertaModel.createPeserta(req.body);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error di createPeserta:", error); // Munculkan error di terminal
        res.status(500).json({ message: error.message });
    }
};

const updatePeserta = async (req, res) => {
    try {
        let oldPhoto = null;
        // CEK FOTO: Jika ada file foto BARU yang di-upload saat edit, timpa nilai pas_foto
        if (req.file) {
            req.body.pas_foto = req.file.filename;
            
            // Ambil data lama untuk mendapatkan nama file foto yang lama
            const oldData = await pesertaModel.getPesertaById(req.params.id);
            if (oldData && oldData.pas_foto) {
                oldPhoto = oldData.pas_foto;
            }
        }
        // Jika req.file kosong (user tidak ganti foto), req.body.pas_foto akan tetap memakai nama file lama dari frontend

        const data = await pesertaModel.updatePeserta(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: 'Peserta tidak ditemukan' });

        // Hapus file foto lama jika ada upload foto baru dan update berhasil
        if (oldPhoto && oldPhoto !== data.pas_foto) {
            const oldFilePath = path.join(__dirname, '../public/uploads/foto', oldPhoto);
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                    console.log('File foto lama berhasil dihapus:', oldFilePath);
                } catch (err) {
                    console.error('Gagal menghapus file foto lama:', err);
                }
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePeserta = async (req, res) => {
    try {
        const data = await pesertaModel.deletePeserta(req.params.id);
        if (!data) return res.status(404).json({ message: 'Peserta tidak ditemukan' });

        // Menghapus file foto dari folder backend jika ada
        if (data.pas_foto) {
            const filePath = path.join(__dirname, '../public/uploads/foto', data.pas_foto);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log('File foto berhasil dihapus:', filePath);
                } catch (err) {
                    console.error('Gagal menghapus file foto:', err);
                }
            }
        }

        res.json({ message: 'Peserta berhasil dihapus', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllPeserta, getPesertaById, createPeserta, updatePeserta, deletePeserta };