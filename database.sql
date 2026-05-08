-- =============================================
-- Sistem Pelayanan Publik Desa
-- Database Schema untuk HeidiSQL / Laragon
-- =============================================

CREATE DATABASE IF NOT EXISTS pelayanan_publik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pelayanan_publik;

-- Tabel Users untuk Registrasi & Login
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel untuk pengajuan surat (Warga)
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
    catatan_admin TEXT NULL COMMENT 'Catatan dari admin (misal alasan penolakan)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (nik)
);

-- Tabel untuk pengaduan masyarakat (Warga)
CREATE TABLE IF NOT EXISTS pengaduan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pelapor VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    no_telp VARCHAR(15) NOT NULL,
    kategori ENUM(
        'Infrastruktur',
        'Kebersihan',
        'Keamanan',
        'Pelayanan Publik',
        'Fasilitas Umum',
        'Lainnya'
    ) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    foto_filename VARCHAR(255) NULL COMMENT 'Foto bukti laporan (opsional, disimpan di S3)',
    lokasi VARCHAR(255) NULL,
    status ENUM('Diterima', 'Ditinjau', 'Dalam Penanganan', 'Selesai') DEFAULT 'Diterima',
    catatan_admin TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (nik)
);

-- =============================================
-- Data dummy untuk testing
-- =============================================

-- Dummy Users
-- Password plaintext untuk demo (di backend pakai bcrypt)
INSERT IGNORE INTO users (nik, nama, username, password, role) VALUES 
('1234567890123456', 'Admin Desa', 'admin', 'admin123', 'admin'),
('3201011234560001', 'Budi Santoso', 'budi', 'budi123', 'user'),
('3201011234560002', 'Siti Rahayu', 'siti', 'siti123', 'user');

INSERT IGNORE INTO pengajuan (nama_lengkap, nik, no_telp, jenis_surat, keperluan, ktp_filename, status) VALUES
('Budi Santoso', '3201011234560001', '081234567890', 'Surat Keterangan Domisili', 'Keperluan membuka rekening bank', 'ktp_dummy_1.jpg', 'Pending'),
('Siti Rahayu', '3201011234560002', '082345678901', 'Surat Keterangan Usaha', 'Keperluan pengajuan pinjaman modal usaha', 'ktp_dummy_2.jpg', 'Diproses'),
('Ahmad Fauzi', '3201011234560003', '083456789012', 'Surat Pengantar SKCK', 'Keperluan melamar pekerjaan di PT. Maju Jaya', 'ktp_dummy_3.jpg', 'Selesai');

INSERT IGNORE INTO pengaduan (nama_pelapor, nik, no_telp, kategori, judul, deskripsi, lokasi, status) VALUES
('Warga RT 01', '3201011234560004', '084567890123', 'Infrastruktur', 'Jalan Berlubang di Depan SDN 01', 'Terdapat lubang besar di jalan utama depan SDN 01 yang membahayakan pengendara, terutama saat hujan.', 'Jl. Merdeka No. 1, RT 01/RW 02', 'Diterima'),
('Komunitas RW 03', '3201011234560005', '085678901234', 'Kebersihan', 'Tumpukan Sampah di Kali Cipinang', 'Sampah menumpuk di bantaran Kali Cipinang RW 03 menyebabkan bau tidak sedap dan berpotensi banjir.', 'Bantaran Kali Cipinang, RW 03', 'Dalam Penanganan');
