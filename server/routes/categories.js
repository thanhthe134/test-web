import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// GET /api/categories - List all equipment categories
router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.category_id, c.category_name, c.slug, c.description, c.created_at,
              COUNT(p.product_id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.category_id
       GROUP BY c.category_id
       ORDER BY c.category_id ASC`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:slug - Single category details
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT category_id, category_name, slug, description, created_at FROM categories WHERE slug = ?',
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
