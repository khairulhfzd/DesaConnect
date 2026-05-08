const { pool } = require('../config/db');
const { uploadToS3 } = require('../config/s3');
const { getFileUrl } = require('../utils/cdn');
const crypto = require('crypto');

const createPengajuan = async (req, res) => {
  try {
    const { nama_lengkap, nik, no_telp, jenis_surat, keperluan } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Foto KTP wajib diunggah' });
    }

    const ext = req.file.originalname.split('.').pop();
    const fileName = `ktp_${nik}_${crypto.randomBytes(8).toString('hex')}.${ext}`;
    await uploadToS3(req.file.buffer, fileName, req.file.mimetype);

    const query = `INSERT INTO pengajuan (nama_lengkap, nik, no_telp, jenis_surat, keperluan, ktp_filename) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [nama_lengkap, nik, no_telp, jenis_surat, keperluan, fileName]);

    res.status(201).json({
      message: 'Pengajuan berhasil dikirim',
      data: { id: result.insertId, nama_lengkap, nik, status: 'Pending' }
    });
  } catch (error) {
    console.error('Error createPengajuan:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAllPengajuan = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pengajuan ORDER BY created_at DESC');
    const data = rows.map(row => ({ ...row, ktp_url: getFileUrl(req, row.ktp_filename) }));
    res.json(data);
  } catch (error) {
    console.error('Error getAllPengajuan:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const trackPengajuanByNik = async (req, res) => {
  try {
    const { nik } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, nama_lengkap, nik, jenis_surat, keperluan, status, catatan_admin, created_at FROM pengajuan WHERE nik = ? ORDER BY created_at DESC',
      [nik]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada pengajuan untuk NIK tersebut' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Error trackPengajuanByNik:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePengajuanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;
    const validStatuses = ['Pending', 'Diproses', 'Selesai', 'Ditolak'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }
    const [result] = await pool.execute(
      'UPDATE pengajuan SET status = ?, catatan_admin = ? WHERE id = ?',
      [status, catatan_admin || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }
    res.json({ message: 'Status berhasil diperbarui', status });
  } catch (error) {
    console.error('Error updatePengajuanStatus:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createPengajuan, getAllPengajuan, trackPengajuanByNik, updatePengajuanStatus };
