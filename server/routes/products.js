import express from 'express';
import { parseJsonField, pool } from '../config/db.js';

const router = express.Router();

function formatProductRow(row) {
  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    technical_specs: parseJsonField(row.technical_specs, {}),
  };
}

// GET /api/products - List & filter products (by category slug, featured, status, search)
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, status, search } = req.query;
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

    if (featured === 'true' || featured === '1') {
      sql += ' AND p.is_featured = TRUE';
    }

    if (status && ['available', 'maintenance'].includes(status)) {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (search && String(search).trim()) {
      const kw = `%${String(search).trim()}%`;
      sql += ' AND (p.product_name LIKE ? OR p.model_code LIKE ? OR p.short_description LIKE ?)';
      params.push(kw, kw, kw);
    }

    sql += ' ORDER BY p.category_id ASC, p.is_featured DESC, p.product_id ASC';

    const [rows] = await pool.query(sql, params);
    const data = rows.map(formatProductRow);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get single product by numeric product_id or model_code
router.get('/:id', async (req, res, next) => {
  try {
    const param = req.params.id;
    const isNumeric = /^\d+$/.test(param);

    const [rows] = await pool.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON p.category_id = c.category_id
       WHERE ${isNumeric ? 'p.product_id = ?' : 'p.model_code = ?'}`,
      [isNumeric ? Number(param) : param]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    res.json({ success: true, data: formatProductRow(rows[0]) });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res, next) => {
  try {
    const {
      category_id,
      product_name,
      model_code,
      short_description = '',
      technical_specs = {},
      image_url = '',
      video_demo_url = '',
      is_featured = false,
      status = 'available',
    } = req.body || {};

    if (!category_id || !product_name?.trim() || !model_code?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp category_id, product_name và model_code.',
      });
    }

    if (!['available', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái status phải là "available" hoặc "maintenance".',
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
        Number(category_id),
        product_name.trim(),
        model_code.trim(),
        short_description,
        specsJson,
        image_url,
        video_demo_url,
        Boolean(is_featured),
        status,
      ]
    );

    const [createdRows] = await pool.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Đã thêm thiết bị mới thành công.',
      data: formatProductRow(createdRows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Mã model_code đã tồn tại trong cơ sở dữ liệu.',
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'category_id không tồn tại.',
      });
    }
    next(error);
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res, next) => {
  try {
    const [existingRows] = await pool.query(
      'SELECT * FROM products WHERE product_id = ?',
      [req.params.id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    const current = existingRows[0];
    const {
      category_id,
      product_name,
      model_code,
      short_description,
      technical_specs,
      image_url,
      video_demo_url,
      is_featured,
      status,
    } = req.body || {};

    if (status && !['available', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái status không hợp lệ.',
      });
    }

    const specsJson =
      technical_specs !== undefined
        ? typeof technical_specs === 'string'
          ? technical_specs
          : JSON.stringify(technical_specs)
        : typeof current.technical_specs === 'string'
        ? current.technical_specs
        : JSON.stringify(current.technical_specs || {});

    await pool.query(
      `UPDATE products
       SET category_id = ?,
           product_name = ?,
           model_code = ?,
           short_description = ?,
           technical_specs = ?,
           image_url = ?,
           video_demo_url = ?,
           is_featured = ?,
           status = ?
       WHERE product_id = ?`,
      [
        category_id !== undefined ? Number(category_id) : current.category_id,
        product_name !== undefined ? product_name.trim() : current.product_name,
        model_code !== undefined ? model_code.trim() : current.model_code,
        short_description !== undefined ? short_description : current.short_description,
        specsJson,
        image_url !== undefined ? image_url : current.image_url,
        video_demo_url !== undefined ? video_demo_url : current.video_demo_url,
        is_featured !== undefined ? Boolean(is_featured) : Boolean(current.is_featured),
        status ?? current.status,
        req.params.id,
      ]
    );

    const [updatedRows] = await pool.query(
      `SELECT p.*, c.category_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Đã cập nhật thông tin thiết bị.',
      data: formatProductRow(updatedRows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Mã model_code đã được sử dụng bởi thiết bị khác.',
      });
    }
    next(error);
  }
});

// PATCH /api/products/:id/status - Update availability status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['available', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái phải là "available" hoặc "maintenance".',
      });
    }

    const [result] = await pool.query(
      'UPDATE products SET status = ? WHERE product_id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    res.json({ success: true, message: 'Đã cập nhật trạng thái thiết bị.', status });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
    }

    res.json({ success: true, message: 'Đã xóa thiết bị khỏi cơ sở dữ liệu.' });
  } catch (error) {
    next(error);
  }
});

export default router;
