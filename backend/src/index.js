require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- 1. Tambahkan modul bawaan Node.js untuk mengatur path/folder

const provinsiRoutes = require('./routes/provinsiRoutes');
const kabkoRoutes = require('./routes/kabkoRoutes');
const pesertaRoutes = require('./routes/pesertaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// <-- 2. TAMBAHAN WAJIB: Membuka akses folder 'public' agar foto bisa dibaca oleh frontend
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('API Node.js & PostgreSQL berjalan...');
});

app.use('/dashboard', dashboardRoutes);
app.use('/provinsi', provinsiRoutes);
app.use('/kabko', kabkoRoutes);
app.use('/peserta', pesertaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});