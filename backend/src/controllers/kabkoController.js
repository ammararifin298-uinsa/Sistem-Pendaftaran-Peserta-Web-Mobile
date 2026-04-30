const kabkoModel = require('../models/kabkoModel');

const getAllKabko = async (req, res) => {
    try {
        const data = await kabkoModel.getAllKabko();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getKabkoById = async (req, res) => {
    try {
        const data = await kabkoModel.getKabkoById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Kabko tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getKabkoByProvinsi = async (req, res) => {
    try {
        const data = await kabkoModel.getKabkoByProvinsi(req.params.id_provinsi);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createKabko = async (req, res) => {
    try {
        const data = await kabkoModel.createKabko(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateKabko = async (req, res) => {
    try {
        const data = await kabkoModel.updateKabko(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: 'Kabko tidak ditemukan' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteKabko = async (req, res) => {
    try {
        const data = await kabkoModel.deleteKabko(req.params.id);
        if (!data) return res.status(404).json({ message: 'Kabko tidak ditemukan' });
        res.json({ message: 'Kabko berhasil dihapus', data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllKabko, getKabkoById, getKabkoByProvinsi, createKabko, updateKabko, deleteKabko };