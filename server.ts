import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/db/mysqlStore.ts';
import {
  CmsMediaItem,
  CmsProjectCase,
  FigmaProductModel,
  SiteSettings,
} from './src/types/cms.ts';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'SquareSnake@2026';
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function signAdminToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }
  try {
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    ) as { exp?: number };
    return typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : '';
  if (!verifyAdminToken(token)) {
    res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập quản trị không hợp lệ hoặc đã hết hạn.',
    });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  ensureUploadDir();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Allow Postman / local API clients cleanly
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

  // Serve uploaded images, videos and system diagrams (draw.io / PlantUML)
  app.use('/uploads', express.static(UPLOADS_DIR));
  const diagramsDir = path.resolve(process.cwd(), 'diagrams');
  if (fs.existsSync(diagramsDir)) {
    app.use('/diagrams', express.static(diagramsDir));
  }

  // Health & Database Mode
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SquareSnake Vietnam Full-Stack API',
      databaseMode: dbStore.getMode(),
    });
  });

  // Public Catalog & CMS Endpoints (backed by MySQL when configured)
  app.get('/api/categories', async (_req, res) => {
    try {
      const categories = await dbStore.getCategories();
      res.json({ success: true, count: categories.length, data: categories });
    } catch (err) {
      console.error('[API] GET /api/categories error:', err);
      res.status(500).json({ success: false, message: 'Lỗi truy vấn danh mục.' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const category =
        typeof req.query.category === 'string' ? req.query.category : 'all';
      const search =
        typeof req.query.search === 'string' ? req.query.search : '';
      const data = await dbStore.getProductsFiltered({ category, search });
      res.json({ success: true, count: data.length, data });
    } catch (err) {
      console.error('[API] GET /api/products error:', err);
      res.status(500).json({ success: false, message: 'Lỗi truy vấn sản phẩm.' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const cms = await dbStore.getPublicCms();
      const found = cms.models.find((m) => m.id === req.params.id);
      if (!found) {
        res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
        return;
      }
      res.json({ success: true, data: found });
    } catch (err) {
      console.error('[API] GET /api/products/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi truy vấn thiết bị.' });
    }
  });

  app.get('/api/projects', async (_req, res) => {
    try {
      const cms = await dbStore.getPublicCms();
      res.json({ success: true, count: cms.projects.length, data: cms.projects });
    } catch (err) {
      console.error('[API] GET /api/projects error:', err);
      res.status(500).json({ success: false, message: 'Lỗi truy vấn dự án.' });
    }
  });

  app.get('/api/cms/public', async (_req, res) => {
    try {
      const data = await dbStore.getPublicCms();
      res.json({ success: true, databaseMode: dbStore.getMode(), data });
    } catch (err) {
      console.error('[API] GET /api/cms/public error:', err);
      res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu CMS.' });
    }
  });

  // Customer Quote Submission -> INSERT into MySQL customer_inbox
  app.post('/api/contacts', async (req, res) => {
    try {
      const {
        customer_name,
        phone,
        company_agency,
        event_date,
        interested_categories,
        stage_requirements,
      } = req.body as {
        customer_name?: string;
        phone?: string;
        company_agency?: string;
        event_date?: string;
        interested_categories?: string[] | string;
        stage_requirements?: string;
      };

      if (!customer_name?.trim() || !phone?.trim()) {
        res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ Họ tên và thông tin liên hệ.',
        });
        return;
      }

      const categoriesArr = Array.isArray(interested_categories)
        ? interested_categories
        : typeof interested_categories === 'string' && interested_categories.trim()
        ? interested_categories.split(',').map((s) => s.trim())
        : ['Tư vấn chung'];

      const created = await dbStore.createContact({
        customer_name: customer_name.trim(),
        phone: phone.trim(),
        company_agency,
        event_date,
        interested_categories: categoriesArr,
        stage_requirements,
      });

      res.status(201).json({
        success: true,
        message: 'Yêu cầu báo giá đã được lưu vào cơ sở dữ liệu.',
        reference_code: created.reference_code,
        data: created,
      });
    } catch (err) {
      console.error('[API] POST /api/contacts error:', err);
      res.status(500).json({
        success: false,
        message: 'Không thể lưu yêu cầu báo giá.',
      });
    }
  });

  // Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (
      (username?.trim() || 'admin') === ADMIN_USERNAME &&
      password === ADMIN_PASSCODE
    ) {
      const token = signAdminToken(ADMIN_USERNAME);
      res.json({
        success: true,
        token,
        user: { username: ADMIN_USERNAME, role: 'Administrator' },
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu quản trị chưa chính xác.',
    });
  });

  app.get('/api/admin/verify', requireAdmin, (_req, res) => {
    res.json({ success: true, user: { username: ADMIN_USERNAME } });
  });

  // Admin Inbox Routes
  app.get('/api/contacts', requireAdmin, async (_req, res) => {
    try {
      const list = await dbStore.getInbox();
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      console.error('[API] GET /api/contacts error:', err);
      res.status(500).json({ success: false, message: 'Lỗi tải danh sách liên hệ.' });
    }
  });

  app.get('/api/admin/inbox', requireAdmin, async (_req, res) => {
    try {
      const list = await dbStore.getInbox();
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      console.error('[API] GET /api/admin/inbox error:', err);
      res.status(500).json({ success: false, message: 'Lỗi tải hộp thư khách hàng.' });
    }
  });

  app.patch('/api/admin/inbox/:id', requireAdmin, async (req, res) => {
    try {
      const idNum = Number(req.params.id);
      const { status, admin_note } = req.body as {
        status?: 'pending' | 'contacted' | 'quoted';
        admin_note?: string;
      };
      if (status && !['pending', 'contacted', 'quoted'].includes(status)) {
        res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        return;
      }
      const updated = await dbStore.updateInbox(idNum, { status, admin_note });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[API] PATCH /api/admin/inbox/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi cập nhật hộp thư.' });
    }
  });

  app.patch('/api/contacts/:id/status', requireAdmin, async (req, res) => {
    try {
      const idNum = Number(req.params.id);
      const { status } = req.body as { status?: 'pending' | 'contacted' | 'quoted' };
      if (!status || !['pending', 'contacted', 'quoted'].includes(status)) {
        res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        return;
      }
      const updated = await dbStore.updateInbox(idNum, { status });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[API] PATCH /api/contacts/:id/status error:', err);
      res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái.' });
    }
  });

  app.delete('/api/admin/inbox/:id', requireAdmin, async (req, res) => {
    try {
      const ok = await dbStore.deleteInbox(Number(req.params.id));
      if (!ok) {
        res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/admin/inbox/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi xóa yêu cầu.' });
    }
  });

  // Admin Site Settings
  app.put('/api/admin/site-settings', requireAdmin, async (req, res) => {
    try {
      const updated = await dbStore.updateSiteSettings(
        req.body as Partial<SiteSettings>
      );
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[API] PUT /api/admin/site-settings error:', err);
      res.status(500).json({ success: false, message: 'Lỗi lưu cấu hình trang.' });
    }
  });

  // Admin Product Models CRUD
  app.post('/api/admin/models', requireAdmin, async (req, res) => {
    try {
      const body = req.body as Partial<FigmaProductModel>;
      if (!body.fullName?.trim() || !body.collection) {
        res.status(400).json({
          success: false,
          message: 'Vui lòng nhập Tên sản phẩm và Chọn dòng thiết bị.',
        });
        return;
      }
      const created = await dbStore.createModel({
        ...body,
        collection: body.collection,
        fullName: body.fullName.trim(),
      });
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[API] POST /api/admin/models error:', err);
      res.status(500).json({ success: false, message: 'Lỗi thêm thiết bị mới.' });
    }
  });

  app.put('/api/admin/models/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await dbStore.updateModel(
        req.params.id,
        req.body as Partial<FigmaProductModel>
      );
      if (!updated) {
        res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[API] PUT /api/admin/models/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi cập nhật thiết bị.' });
    }
  });

  app.delete('/api/admin/models/:id', requireAdmin, async (req, res) => {
    try {
      const ok = await dbStore.deleteModel(req.params.id);
      if (!ok) {
        res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/admin/models/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi xóa thiết bị.' });
    }
  });

  // Admin Projects CRUD
  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    try {
      const body = req.body as Partial<CmsProjectCase>;
      if (!body.title?.trim()) {
        res.status(400).json({ success: false, message: 'Vui lòng nhập Tên dự án.' });
        return;
      }
      const created = await dbStore.createProject({
        ...body,
        title: body.title.trim(),
      });
      res.status(201).json({ success: true, data: created });
    } catch (err) {
      console.error('[API] POST /api/admin/projects error:', err);
      res.status(500).json({ success: false, message: 'Lỗi thêm dự án mới.' });
    }
  });

  app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    try {
      const updated = await dbStore.updateProject(
        req.params.id,
        req.body as Partial<CmsProjectCase>
      );
      if (!updated) {
        res.status(404).json({ success: false, message: 'Không tìm thấy dự án.' });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error('[API] PUT /api/admin/projects/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi cập nhật dự án.' });
    }
  });

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    try {
      const ok = await dbStore.deleteProject(req.params.id);
      if (!ok) {
        res.status(404).json({ success: false, message: 'Không tìm thấy dự án.' });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/admin/projects/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi xóa dự án.' });
    }
  });

  // Admin Media Upload (Images & Videos) + External Media Link
  app.post('/api/admin/upload', requireAdmin, async (req, res) => {
    const { filename, mimeType, dataBase64, title, category } = req.body as {
      filename?: string;
      mimeType?: string;
      dataBase64?: string;
      title?: string;
      category?: string;
    };

    if (!filename || !mimeType || !dataBase64) {
      res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu tệp tin tải lên.',
      });
      return;
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const isImage = allowedImageTypes.includes(mimeType);
    const isVideo = allowedVideoTypes.includes(mimeType);

    if (!isImage && !isVideo) {
      res.status(400).json({
        success: false,
        message:
          'Chỉ hỗ trợ ảnh (JPG, PNG, WebP, GIF) hoặc video (MP4, WebM, MOV).',
      });
      return;
    }

    try {
      const cleanBase64 = dataBase64.includes(',')
        ? dataBase64.split(',')[1]
        : dataBase64;
      const buffer = Buffer.from(cleanBase64, 'base64');
      if (buffer.length > 35 * 1024 * 1024) {
        res.status(400).json({
          success: false,
          message: 'Dung lượng tệp vượt quá giới hạn 35MB.',
        });
        return;
      }

      ensureUploadDir();
      const ext =
        path.extname(filename).toLowerCase() || (isImage ? '.jpg' : '.mp4');
      const base =
        path
          .basename(filename, ext)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 40) || 'media';
      const storedName = `${Date.now()}-${base}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, storedName);
      fs.writeFileSync(targetPath, buffer);

      const url = `/uploads/${storedName}`;
      const mediaItem: CmsMediaItem = {
        id: `media-${Date.now()}`,
        title: title?.trim() || filename,
        type: isImage ? 'image' : 'video',
        url,
        category:
          category?.trim() || (isImage ? 'Hình ảnh sân khấu' : 'Video trình diễn'),
        createdAt: new Date().toISOString(),
      };

      const saved = await dbStore.addMedia(mediaItem);
      res.status(201).json({ success: true, url, data: saved });
    } catch (err) {
      console.error('[API] POST /api/admin/upload error:', err);
      res.status(500).json({
        success: false,
        message: 'Không thể lưu tệp tin lên máy chủ.',
      });
    }
  });

  app.post('/api/admin/media', requireAdmin, async (req, res) => {
    try {
      const { title, type, url, category } = req.body as Partial<CmsMediaItem>;
      if (!url?.trim() || !title?.trim()) {
        res.status(400).json({
          success: false,
          message: 'Vui lòng nhập Tiêu đề và Đường dẫn ảnh/video.',
        });
        return;
      }
      const item: CmsMediaItem = {
        id: `media-${Date.now()}`,
        title: title.trim(),
        type: type === 'video' ? 'video' : 'image',
        url: url.trim(),
        category: category?.trim() || 'Thư viện media',
        createdAt: new Date().toISOString(),
      };
      const saved = await dbStore.addMedia(item);
      res.status(201).json({ success: true, data: saved });
    } catch (err) {
      console.error('[API] POST /api/admin/media error:', err);
      res.status(500).json({ success: false, message: 'Lỗi lưu media.' });
    }
  });

  app.delete('/api/admin/media/:id', requireAdmin, async (req, res) => {
    try {
      const removed = await dbStore.deleteMedia(req.params.id);
      if (!removed) {
        res.status(404).json({ success: false, message: 'Không tìm thấy tệp media.' });
        return;
      }
      if (removed.url.startsWith('/uploads/')) {
        const filePath = path.join(UPLOADS_DIR, path.basename(removed.url));
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // ignore cleanup failure
          }
        }
      }
      res.json({ success: true });
    } catch (err) {
      console.error('[API] DELETE /api/admin/media/:id error:', err);
      res.status(500).json({ success: false, message: 'Lỗi xóa tệp media.' });
    }
  });

  const httpServer = http.createServer(app);

  // Vite Middleware in Development / Static Dist in Production
  if (process.env.NODE_ENV !== 'production') {
    const vitePromise = createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
      optimizeDeps: {
        entries: ['index.html', 'src/main.tsx'],
      },
    });
    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[SquareSnake Full-Stack] Server đang chạy tại http://0.0.0.0:${PORT} (DB: ${dbStore.getMode()})`
    );
  });
}

startServer();
