const pool = require('../config/db');

const getAllKabko = async () => {
    const query = `
        SELECT k.id, k.nama, k.id_provinsi, p.nama AS nama_provinsi
        FROM kabko k
        LEFT JOIN provinsi p ON k.id_provinsi = p.id
        ORDER BY k.id ASC
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getKabkoById = async (id) => {
    const query = `
        SELECT k.id, k.nama, k.id_provinsi, p.nama AS nama_provinsi
        FROM kabko k
        LEFT JOIN provinsi p ON k.id_provinsi = p.id
        WHERE k.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getKabkoByProvinsi = async (id_provinsi) => {
    const result = await pool.query('SELECT * FROM kabko WHERE id_provinsi = $1 ORDER BY nama ASC', [id_provinsi]);
    return result.rows;
};

const createKabko = async (data) => {
    const { nama, id_provinsi } = data;
    const result = await pool.query('INSERT INTO kabko (nama, id_provinsi) VALUES ($1, $2) RETURNING *', [nama, id_provinsi]);
    return result.rows[0];
};

const updateKabko = async (id, data) => {
    const { nama, id_provinsi } = data;
    const result = await pool.query('UPDATE kabko SET nama = $1, id_provinsi = $2 WHERE id = $3 RETURNING *', [nama, id_provinsi, id]);
    return result.rows[0];
};

const deleteKabko = async (id) => {
    const result = await pool.query('DELETE FROM kabko WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllKabko, getKabkoById, getKabkoByProvinsi, createKabko, updateKabko, deleteKabko };