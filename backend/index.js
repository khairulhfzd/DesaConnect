require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDB } = require('./src/config/db');
const pengajuanRoutes = require('./src/routes/pengajuan.routes');
const pengaduanRoutes = require('./src/routes/pengaduan.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/pengaduan', pengaduanRoutes);

// 2. Local Storage Fallback (for local dev uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Serve Frontend Static Files (Single Container Strategy)
// In production, the React 'dist' files will be copied to 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 4. Health check for AWS ECS
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// 5. Catch-all Route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initializeDB();
});

