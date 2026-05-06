const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const countPeserta = await pool.query('SELECT COUNT(*) FROM peserta');
        const countKabko = await pool.query('SELECT COUNT(*) FROM kabko');
        const countProvinsi = await pool.query('SELECT COUNT(*) FROM provinsi');

        res.json({
            total_peserta: parseInt(countPeserta.rows[0].count, 10),
            total_kabko: parseInt(countKabko.rows[0].count, 10),
            total_provinsi: parseInt(countProvinsi.rows[0].count, 10),
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getDashboardStats };
