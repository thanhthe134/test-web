const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'squaresnake_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[MySQL] Kết nối thành công tới database:', process.env.DB_NAME || 'squaresnake_db');
    conn.release();
  } catch (error) {
    console.error('[MySQL] Lỗi kết nối database:', error.message);
  }
}

module.exports = { pool, testConnection };
