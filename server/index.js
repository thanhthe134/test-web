import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { dbConfig, testConnection } from './config/db.js';
import categoriesRouter from './routes/categories.js';
import contactsRouter from './routes/contacts.js';
import productsRouter from './routes/products.js';
import projectsRouter from './routes/projects.js';

const app = express();
const PORT = Number(process.env.SERVER_PORT || 5000);

// CORS & JSON Body Parsing Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static stage media assets & architecture diagrams
const publicAssetsDir = path.resolve(process.cwd(), 'public', 'assets');
const publicUploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
const diagramsDir = path.resolve(process.cwd(), 'diagrams');

if (fs.existsSync(publicAssetsDir)) {
  app.use('/assets', express.static(publicAssetsDir));
}
if (fs.existsSync(publicUploadsDir)) {
  app.use('/uploads', express.static(publicUploadsDir));
}
if (fs.existsSync(diagramsDir)) {
  app.use('/diagrams', express.static(diagramsDir));
}

// Health Check Endpoint
app.get('/api/health', async (_req, res) => {
  const connected = await testConnection();
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    service: 'SquareSnake FX Vietnam RESTful API',
    database: dbConfig.database,
    mysqlConnected: connected,
  });
});

// RESTful API Routes (MySQL 4 tables: categories, products, projects, contacts)
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/contacts', contactsRouter);

// 404 Handler for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại.',
  });
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ.',
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`[SquareSnake API Server] Listening on http://0.0.0.0:${PORT}`);
  await testConnection();
});

export default app;
