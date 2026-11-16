import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// GET /api/projects - List all project entries
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (search && String(search).trim()) {
      const kw = `%${String(search).trim()}%`;
      sql += ' AND (event_name LIKE ? OR client_name LIKE ? OR location LIKE ? OR equipment_used LIKE ?)';
      params.push(kw, kw, kw, kw);
    }

    sql += ' ORDER BY event_date DESC, project_id DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get single project entry
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE project_id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ dự án.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create new project entry
router.post('/', async (req, res, next) => {
  try {
    const {
      event_name,
      client_name,
      location,
      event_date,
      equipment_used,
      summary = '',
      thumbnail_url = '/assets/squaresnake/hero-concert.jpg',
    } = req.body || {};

    if (!event_name?.trim() || !client_name?.trim() || !location?.trim() || !event_date || !equipment_used?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ event_name, client_name, location, event_date và equipment_used.',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO projects (
        event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        event_name.trim(),
        client_name.trim(),
        location.trim(),
        event_date,
        equipment_used.trim(),
        summary,
        thumbnail_url,
      ]
    );

    const [createdRows] = await pool.query(
      'SELECT * FROM projects WHERE project_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Đã thêm hồ sơ dự án mới.',
      data: createdRows[0],
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Update project entry
router.put('/:id', async (req, res, next) => {
  try {
    const [existingRows] = await pool.query(
      'SELECT * FROM projects WHERE project_id = ?',
      [req.params.id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ dự án.' });
    }

    const current = existingRows[0];
    const {
      event_name,
      client_name,
      location,
      event_date,
      equipment_used,
      summary,
      thumbnail_url,
    } = req.body || {};

    await pool.query(
      `UPDATE projects
       SET event_name = ?,
           client_name = ?,
           location = ?,
           event_date = ?,
           equipment_used = ?,
           summary = ?,
           thumbnail_url = ?
       WHERE project_id = ?`,
      [
        event_name !== undefined ? event_name.trim() : current.event_name,
        client_name !== undefined ? client_name.trim() : current.client_name,
        location !== undefined ? location.trim() : current.location,
        event_date !== undefined ? event_date : current.event_date,
        equipment_used !== undefined ? equipment_used.trim() : current.equipment_used,
        summary !== undefined ? summary : current.summary,
        thumbnail_url !== undefined ? thumbnail_url : current.thumbnail_url,
        req.params.id,
      ]
    );

    const [updatedRows] = await pool.query(
      'SELECT * FROM projects WHERE project_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Đã cập nhật hồ sơ dự án.',
      data: updatedRows[0],
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project entry
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE project_id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ dự án.' });
    }

    res.json({ success: true, message: 'Đã xóa hồ sơ dự án.' });
  } catch (error) {
    next(error);
  }
});

export default router;
