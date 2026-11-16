const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Đọc .env tại thư mục server hoặc thư mục gốc dự án
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'squaresnake_fx';

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('[MySQL] Kết nối thành công tới database:', dbName);
    conn.release();
  } catch (error) {
    console.error('[MySQL] Lỗi kết nối database:', error.message);
  }
}

module.exports = { pool, testConnection };
