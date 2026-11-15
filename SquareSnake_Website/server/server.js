const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ thư mục Front-end tĩnh (client/)
app.use(express.static(path.join(__dirname, '../client')));

// RESTful API Routes
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SquareSnake Vietnam API' });
});

app.listen(PORT, async () => {
  console.log(`[SquareSnake Server] Đang chạy tại http://localhost:${PORT}`);
  await testConnection();
});
