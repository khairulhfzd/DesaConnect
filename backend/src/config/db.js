require('dotenv').config();
const mysql = require('mysql2/promise');

const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pelayanan_publik',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const initializeDB = async () => {
  try {
    const connection = await pool.getConnection();
    
    if (isProduction) {
      console.log('✅ Connected to AWS RDS');
    } else {
      console.log('✅ Connected to Local DB (Laragon/MySQL)');
    }

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nik VARCHAR(16) UNIQUE NOT NULL,
        nama VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Pengajuan Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pengajuan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_lengkap VARCHAR(255) NOT NULL,
        nik VARCHAR(16) NOT NULL,
        no_telp VARCHAR(15) NOT NULL,
        jenis_surat ENUM(
          'Surat Keterangan Domisili',
          'Surat Keterangan Usaha',
          'Surat Pengantar SKCK',
          'Surat Keterangan Tidak Mampu',
          'Surat Keterangan Kelahiran',
          'Surat Keterangan Kematian'
        ) NOT NULL,
        keperluan TEXT NOT NULL,
        ktp_filename VARCHAR(255) NOT NULL,
        status ENUM('Pending', 'Diproses', 'Selesai', 'Ditolak') DEFAULT 'Pending',
        catatan_admin TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (nik)
      )
    `);

    // Pengaduan Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pengaduan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_pelapor VARCHAR(255) NOT NULL,
        nik VARCHAR(16) NOT NULL,
        no_telp VARCHAR(15) NOT NULL,
        kategori ENUM('Infrastruktur','Kebersihan','Keamanan','Pelayanan Publik','Fasilitas Umum','Lainnya') NOT NULL,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT NOT NULL,
        foto_filename VARCHAR(255) NULL,
        lokasi VARCHAR(255) NULL,
        status ENUM('Diterima', 'Ditinjau', 'Dalam Penanganan', 'Selesai') DEFAULT 'Diterima',
        catatan_admin TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (nik)
      )
    `);

    console.log('✅ Database schema is ready.');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    if (isProduction) {
      console.error('Check your RDS endpoint, Security Group, and Private Subnet routing.');
    }
  }
};

module.exports = { pool, initializeDB };

