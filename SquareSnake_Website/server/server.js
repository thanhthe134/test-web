const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_DIR = path.join(__dirname, '../client');
const UPLOADS_DIR = path.join(CLIENT_DIR, 'uploads');
const DIAGRAMS_DIR = path.join(__dirname, '../../diagrams');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Phục vụ Front-end tĩnh (HTML5, CSS3, Bootstrap 5, JS ES6+), Ảnh & Video hiệu ứng
app.use(express.static(CLIENT_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
if (fs.existsSync(DIAGRAMS_DIR)) {
  app.use('/diagrams', express.static(DIAGRAMS_DIR));
}

// RESTful API Routes (4 bảng MySQL: categories, products, projects, contacts)
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);

// Upload ảnh / video hiệu ứng sân khấu cho Admin
app.post('/api/upload', (req, res) => {
  try {
    const { filename, mimeType, dataBase64 } = req.body || {};
    if (!filename || !mimeType || !dataBase64) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu tệp tin tải lên.',
      });
    }

    const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideo = ['video/mp4', 'video/webm', 'video/quicktime'];
    const isImage = allowedImage.includes(mimeType);
    const isVideo = allowedVideo.includes(mimeType);
    if (!isImage && !isVideo) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ hỗ trợ ảnh (JPG, PNG, WebP, GIF) hoặc video (MP4, WebM, MOV).',
      });
    }

    const cleanBase64 = dataBase64.includes(',') ? dataBase64.split(',')[1] : dataBase64;
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length > 35 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Dung lượng tệp vượt quá giới hạn 35MB.',
      });
    }

    const ext = path.extname(filename).toLowerCase() || (isImage ? '.jpg' : '.mp4');
    const base =
      path
        .basename(filename, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40) || 'media';
    const storedName = `${Date.now()}-${base}${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, storedName), buffer);

    res.status(201).json({
      success: true,
      url: `/uploads/${storedName}`,
      type: isImage ? 'image' : 'video',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lưu tệp tin lên máy chủ.',
      error: error.message,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SquareSnake FX Vietnam RESTful API',
    database: process.env.DB_NAME || 'squaresnake_db',
  });
});

app.listen(PORT, async () => {
  console.log(`[SquareSnake Server] Đang chạy tại http://localhost:${PORT}`);
  await testConnection();
});
