const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <-- Tambahan untuk sistem file
const pesertaController = require('../controllers/pesertaController');

// 1. TENTUKAN LOKASI ABSOLUT & AUTO-CREATE FOLDER
// Mengarah langsung dari root folder backend ke public/uploads/foto
const uploadDir = path.join(__dirname, '../public/uploads/foto');

// Jika folder tidak ada secara sistem, Node.js akan membuatnya otomatis!
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Berhasil membuat folder baru di:", uploadDir);
}

// 2. KONFIGURASI MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Pakai variabel uploadDir yang sudah dijamin valid
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'foto-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 3. TERAPKAN KE ROUTES
router.get('/', pesertaController.getAllPeserta);
router.get('/:id', pesertaController.getPesertaById);

router.post('/', upload.single('pas_foto'), pesertaController.createPeserta);
router.put('/:id', upload.single('pas_foto'), pesertaController.updatePeserta);
router.delete('/:id', pesertaController.deletePeserta);

module.exports = router;