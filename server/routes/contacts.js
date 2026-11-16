import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// GET /api/contacts - View contact & quote submissions (filterable by status & search)
router.get('/', async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (status && ['pending', 'contacted', 'quoted'].includes(status)) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && String(search).trim()) {
      const kw = `%${String(search).trim()}%`;
      sql += ' AND (customer_name LIKE ? OR phone LIKE ? OR company_agency LIKE ? OR interested_categories LIKE ?)';
      params.push(kw, kw, kw, kw);
    }

    sql += ' ORDER BY created_at DESC, contact_id DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/contacts/:id - View single contact submission
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE contact_id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu liên hệ.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/contacts - Submit new quote/contact request
router.post('/', async (req, res, next) => {
  try {
    const {
      customer_name,
      phone,
      email = null,
      company_agency = null,
      event_date = null,
      interested_categories,
      stage_requirements = null,
    } = req.body || {};

    if (!customer_name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Họ tên (customer_name) và Số điện thoại (phone).',
      });
    }

    const categoriesText = Array.isArray(interested_categories)
      ? interested_categories.filter(Boolean).join(', ')
      : String(interested_categories || 'Tư vấn chung').trim();

    const [result] = await pool.query(
      `INSERT INTO contacts (
        customer_name, phone, email, company_agency, event_date,
        interested_categories, stage_requirements, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        customer_name.trim(),
        phone.trim(),
        email ? String(email).trim() : null,
        company_agency ? String(company_agency).trim() : null,
        event_date || null,
        categoriesText || 'Tư vấn chung',
        stage_requirements ? String(stage_requirements).trim() : null,
      ]
    );

    const [createdRows] = await pool.query(
      'SELECT * FROM contacts WHERE contact_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Yêu cầu báo giá đã được ghi nhận.',
      reference_code: `SS-BG-${String(result.insertId).padStart(4, '0')}`,
      data: createdRows[0],
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/contacts/:id/status - Update contact status (pending / contacted / quoted)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['pending', 'contacted', 'quoted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái phải là "pending", "contacted" hoặc "quoted".',
      });
    }

    const [result] = await pool.query(
      'UPDATE contacts SET status = ? WHERE contact_id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu liên hệ.' });
    }

    res.json({ success: true, message: 'Đã cập nhật trạng thái xử lý.', status });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contacts/:id - Delete contact submission
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE contact_id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu liên hệ.' });
    }

    res.json({ success: true, message: 'Đã xóa yêu cầu liên hệ.' });
  } catch (error) {
    next(error);
  }
});

export default router;
