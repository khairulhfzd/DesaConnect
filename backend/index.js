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

// Serve local uploads as static files (mock S3 for local dev)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pengajuan', pengajuanRoutes);
app.use('/api/pengaduan', pengaduanRoutes);

// Health check for AWS ECS
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initializeDB();
});
