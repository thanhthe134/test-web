const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/projects - Lấy danh sách hồ sơ dự án thực tế
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects ORDER BY event_date DESC, project_id DESC'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn hồ sơ dự án.', error: error.message });
  }
});

// POST /api/projects - Thêm dự án mới
router.post('/', async (req, res) => {
  try {
    const { event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url } =
      req.body;

    if (!event_name || !client_name || !location || !event_date || !equipment_used) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc của dự án.',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO projects (event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [event_name, client_name, location, event_date, equipment_used, summary || '', thumbnail_url || '']
    );

    res.status(201).json({
      success: true,
      message: 'Đã lưu hồ sơ dự án mới.',
      project_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Không thể tạo dự án.', error: error.message });
  }
});

module.exports = router;
