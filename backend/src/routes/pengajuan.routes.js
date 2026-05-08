const express = require('express');
const router = express.Router();
const multer = require('multer');
const c = require('../controllers/pengajuan.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', upload.single('ktp'), c.createPengajuan);
router.get('/', c.getAllPengajuan);
router.get('/track/:nik', c.trackPengajuanByNik);
router.put('/:id/status', c.updatePengajuanStatus);

module.exports = router;
