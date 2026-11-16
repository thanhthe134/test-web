const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/contacts - Lấy danh sách yêu cầu báo giá (Trang quản trị)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM contacts';
    const params = [];

    if (status && ['pending', 'contacted', 'quoted'].includes(status)) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách báo giá.',
      error: error.message,
    });
  }
});

// POST /api/contacts - Tiếp nhận yêu cầu tư vấn & báo giá từ khách hàng
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      phone,
      email,
      company_agency,
      event_date,
      interested_categories,
      stage_requirements,
    } = req.body;

    if (!customer_name || !phone || !interested_categories) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Họ tên, Số điện thoại/Email và Nhóm thiết bị quan tâm.',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacts (
        customer_name, phone, email, company_agency, event_date,
        interested_categories, stage_requirements, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        customer_name.trim(),
        phone.trim(),
        email ? email.trim() : null,
        company_agency ? company_agency.trim() : null,
        event_date || null,
        Array.isArray(interested_categories)
          ? interested_categories.join(', ')
          : interested_categories,
        stage_requirements ? stage_requirements.trim() : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Yêu cầu báo giá đã được ghi nhận thành công.',
      contact_id: result.insertId,
      reference_code: `SS-BG-${String(result.insertId).padStart(4, '0')}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể gửi yêu cầu báo giá.',
      error: error.message,
    });
  }
});

// PATCH /api/contacts/:id/status - Cập nhật trạng thái xử lý báo giá
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'contacted', 'quoted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    const [result] = await pool.query('UPDATE contacts SET status = ? WHERE contact_id = ?', [
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu báo giá.' });
    }

    res.json({ success: true, message: 'Đã cập nhật trạng thái xử lý báo giá.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái.',
      error: error.message,
    });
  }
});

// DELETE /api/contacts/:id - Xóa yêu cầu báo giá
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE contact_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu báo giá.' });
    }
    res.json({ success: true, message: 'Đã xóa yêu cầu báo giá.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa yêu cầu báo giá.',
      error: error.message,
    });
  }
});

module.exports = router;
