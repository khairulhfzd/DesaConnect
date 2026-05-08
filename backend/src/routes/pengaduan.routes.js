const express = require('express');
const router = express.Router();
const multer = require('multer');
const c = require('../controllers/pengaduan.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', upload.single('foto'), c.createPengaduan);
router.get('/', c.getAllPengaduan);
router.get('/track/:nik', c.trackPengaduanByNik);
router.put('/:id/status', c.updatePengaduanStatus);

module.exports = router;
