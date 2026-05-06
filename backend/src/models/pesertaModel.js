const pool = require('../config/db');

const getAllPeserta = async () => {
    const query = `
        SELECT 
            ps.id, ps.nama, ps.tempatlahir, ps.tanggallahir, 
            ps.agama, ps.alamat, ps.telepon, ps.jk, 
            ps.cita_cita, ps.hobi, ps.pas_foto, 
            pr.id AS id_provinsi,
            pr.nama AS nama_provinsi,
            ps.idkabko,
            k.nama AS nama_kabko
        FROM peserta ps
        LEFT JOIN kabko k ON ps.idkabko = k.id
        LEFT JOIN provinsi pr ON k.id_provinsi = pr.id
        ORDER BY ps.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getPesertaById = async (id) => {
    const query = `
        SELECT 
            ps.id, ps.nama, ps.tempatlahir, ps.tanggallahir, 
            ps.agama, ps.alamat, ps.telepon, ps.jk, 
            ps.cita_cita, ps.hobi, ps.pas_foto, 
            pr.id AS id_provinsi,
            pr.nama AS nama_provinsi,
            ps.idkabko,
            k.nama AS nama_kabko
        FROM peserta ps
        LEFT JOIN kabko k ON ps.idkabko = k.id
        LEFT JOIN provinsi pr ON k.id_provinsi = pr.id
        WHERE ps.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const createPeserta = async (data) => {
    let {
        nama = null, tempatlahir = null, tanggallahir = null, agama = null, alamat = null,
        telepon = null, jk = null, cita_cita = null, hobi = null, idkabko = null, pas_foto = null
    } = data;

    if (tanggallahir === '') tanggallahir = null;
    if (idkabko === '') idkabko = null;

    const query = `
        INSERT INTO peserta 
        (nama, tempatlahir, tanggallahir, agama, alamat, telepon, jk, cita_cita, hobi, idkabko, pas_foto) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *
    `;
    const values = [nama, tempatlahir, tanggallahir, agama, alamat, telepon, jk, cita_cita, hobi, idkabko, pas_foto];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updatePeserta = async (id, data) => {
    let {
        nama = null, tempatlahir = null, tanggallahir = null, agama = null, alamat = null,
        telepon = null, jk = null, cita_cita = null, hobi = null, idkabko = null, pas_foto = null
    } = data;

    if (tanggallahir === '') tanggallahir = null;
    if (idkabko === '') idkabko = null;

    const query = `
        UPDATE peserta SET 
        nama=$1, tempatlahir=$2, tanggallahir=$3, agama=$4, alamat=$5, 
        telepon=$6, jk=$7, cita_cita=$8, hobi=$9, idkabko=$10, pas_foto=$11
        WHERE id=$12
        RETURNING *
    `;
    const values = [nama, tempatlahir, tanggallahir, agama, alamat, telepon, jk, cita_cita, hobi, idkabko, pas_foto, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deletePeserta = async (id) => {
    const query = 'DELETE FROM peserta WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { getAllPeserta, getPesertaById, createPeserta, updatePeserta, deletePeserta };