const { pool: db } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_desaconnect';

exports.register = async (req, res) => {
    const { nik, nama, username, password } = req.body;

    if (!nik || !nama || !username || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    try {
        // Check if user exists
        const [existing] = await db.execute(
            'SELECT * FROM users WHERE nik = ? OR username = ?',
            [nik, username]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'NIK atau Username sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.execute(
            'INSERT INTO users (nik, nama, username, password, role) VALUES (?, ?, ?, ?, ?)',
            [nik, nama, username, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (error) {
        console.error('Error Register:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Username tidak ditemukan' });
        }

        const user = users[0];

        // Check password (handle both hashed and plaintext for migration/demo)
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
            
            // PERBAIKAN: Kalau bcrypt bilang false (karena formatnya teks biasa), kita cek manual
            if (!isMatch) {
                isMatch = (password === user.password);
            }
        } catch (e) {
            isMatch = (password === user.password); 
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, nik: user.nik, nama: user.nama },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                nik: user.nik,
                nama: user.nama
            }
        });
    } catch (error) {
        console.error('Error Login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};