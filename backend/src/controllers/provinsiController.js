const provinsiModel = require('../models/provinsiModel');

const getAllProvinsi = async (req, res) => {
    try {
        const data = await provinsiModel.getAllProvinsi();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProvinsiById = async (req, res) => {
    try {
        const data = await provinsiModel.getProvinsiById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Provinsi tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProvinsi = async (req, res) => {
    try {
        const data = await provinsiModel.createProvinsi(req.body.nama);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProvinsi = async (req, res) => {
    try {
        const data = await provinsiModel.updateProvinsi(req.params.id, req.body.nama);
        if (!data) return res.status(404).json({ message: 'Provinsi tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProvinsi = async (req, res) => {
    try {
        const data = await provinsiModel.deleteProvinsi(req.params.id);
        if (!data) return res.status(404).json({ message: 'Provinsi tidak ditemukan' });
        res.json({ message: 'Provinsi berhasil dihapus', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllProvinsi, getProvinsiById, createProvinsi, updateProvinsi, deleteProvinsi };