const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET /api/products/categories - Lấy danh sách nhóm thiết bị
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT category_id, category_name, slug, description, created_at FROM categories ORDER BY category_id ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn danh mục thiết bị.', error: error.message });
  }
});

// GET /api/products - Lọc sản phẩm theo slug danh mục, từ khóa hoặc nổi bật
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let sql = `
      SELECT p.*, c.category_name, c.slug AS category_slug
      FROM products p
      INNER JOIN categories c ON p.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      sql += ' AND p.is_featured = TRUE';
    }

    if (search && search.trim()) {
      sql += ' AND (p.product_name LIKE ? OR p.model_code LIKE ? OR p.short_description LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword);
    }

    sql += ' ORDER BY p.is_featured DESC, p.product_id ASC';

    const [rows] = await pool.query(sql, params);
    const formatted = rows.map((row) => ({
      ...row,
      technical_specs:
        typeof row.technical_specs === 'string'
          ? JSON.parse(row.technical_specs)
          : row.technical_specs,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn danh sách thiết bị.', error: error.message });
  }
});

// GET /api/products/:id - Chi tiết thiết bị theo ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    const product = rows[0];
    if (typeof product.technical_specs === 'string') {
      product.technical_specs = JSON.parse(product.technical_specs);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi truy vấn chi tiết thiết bị.', error: error.message });
  }
});

// POST /api/products - Thêm mới thiết bị (Trang Admin)
router.post('/', async (req, res) => {
  try {
    const {
      category_id,
      product_name,
      model_code,
      short_description,
      technical_specs,
      image_url,
      video_demo_url,
      is_featured = false,
      status = 'available',
    } = req.body;

    if (!category_id || !product_name || !model_code) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ category_id, product_name và model_code.',
      });
    }

    const specsJson =
      typeof technical_specs === 'string'
        ? technical_specs
        : JSON.stringify(technical_specs || {});

    const [result] = await pool.query(
      `INSERT INTO products (
        category_id, product_name, model_code, short_description,
        technical_specs, image_url, video_demo_url, is_featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        product_name,
        model_code,
        short_description || '',
        specsJson,
        image_url || '',
        video_demo_url || '',
        Boolean(is_featured),
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Đã thêm thiết bị mới thành công.',
      product_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Không thể thêm thiết bị.', error: error.message });
  }
});

// PATCH /api/products/:id/status - Cập nhật trạng thái thiết bị (available / maintenance)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['available', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    const [result] = await pool.query('UPDATE products SET status = ? WHERE product_id = ?', [
      status,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    res.json({ success: true, message: 'Đã cập nhật trạng thái thiết bị.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái.', error: error.message });
  }
});

module.exports = router;
