const { pool } = require('../config/db');
const { uploadToS3 } = require('../config/s3');
const { getFileUrl } = require('../utils/cdn');
const crypto = require('crypto');

const createPengaduan = async (req, res) => {
  try {
    const { nama_pelapor, nik, no_telp, kategori, judul, deskripsi, lokasi } = req.body;

    let foto_filename = null;
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      foto_filename = `pengaduan_${nik}_${crypto.randomBytes(8).toString('hex')}.${ext}`;
      await uploadToS3(req.file.buffer, foto_filename, req.file.mimetype);
    }

    const query = `INSERT INTO pengaduan (nama_pelapor, nik, no_telp, kategori, judul, deskripsi, foto_filename, lokasi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nama_pelapor, nik, no_telp, kategori, judul, deskripsi, foto_filename, lokasi || null]);

    res.status(201).json({
      message: 'Pengaduan berhasil dikirim',
      data: { id: result.insertId, judul, status: 'Diterima' }
    });
  } catch (error) {
    console.error('Error createPengaduan:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAllPengaduan = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pengaduan ORDER BY created_at DESC');
    const data = rows.map(row => ({
      ...row,
      foto_url: row.foto_filename ? getFileUrl(req, row.foto_filename) : null
    }));
    res.json(data);
  } catch (error) {
    console.error('Error getAllPengaduan:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const trackPengaduanByNik = async (req, res) => {
  try {
    const { nik } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, nama_pelapor, nik, kategori, judul, deskripsi, lokasi, status, catatan_admin, created_at FROM pengaduan WHERE nik = ? ORDER BY created_at DESC',
      [nik]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada pengaduan untuk NIK tersebut' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error trackPengaduanByNik:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePengaduanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;
    const validStatuses = ['Diterima', 'Ditinjau', 'Dalam Penanganan', 'Selesai'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }
    const [result] = await pool.execute(
      'UPDATE pengaduan SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengaduan tidak ditemukan' });
    }
    res.json({ message: 'Status berhasil diperbarui', status });
  } catch (error) {
    console.error('Error updatePengaduanStatus:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createPengaduan, getAllPengaduan, trackPengaduanByNik, updatePengaduanStatus };
