import 'dotenv/config';
import mysql from 'mysql2/promise';

export const dbConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'squaresnake_fx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
};

export const pool = mysql.createPool(dbConfig);

export function parseJsonField(value, fallback = {}) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log(
      `[MySQL] Connected to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    );
    return true;
  } catch (error) {
    console.error('[MySQL] Connection failed:', error.message);
    return false;
  }
}
