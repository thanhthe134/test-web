import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  DEFAULT_MEDIA_LIBRARY,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_SETTINGS,
  PRODUCT_MODELS,
} from './src/data/figmaCatalog';
import {
  CmsMediaItem,
  CmsProjectCase,
  CustomerInboxItem,
  FigmaProductModel,
  SiteSettings,
} from './src/types/cms';

interface StoreCategory {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
}

interface StoreProduct {
  id: string;
  code: string;
  name: string;
  categoryKey: 'kinetic' | 'laser' | 'led-matrix';
  categoryLabel: string;
  systemType: 'led-matrix' | 'laser-pro' | 'kinetic-ball' | 'kinetic-ring';
  tagline: string;
  description: string;
  stageApplication: string;
  imageUrl: string;
  highlightSpec1Label: string;
  highlightSpec1Value: string;
  highlightSpec2Label: string;
  highlightSpec2Value: string;
  stockCount: number;
  status: 'available' | 'maintenance';
  isFeatured: boolean;
  specs: { label: string; value: string }[];
  riggingNotes: {
    trussLoad: string;
    suspensionPoints: string;
    cableDrop: string;
    controlChain: string;
  };
}

interface StoreProject {
  id: string;
  title: string;
  eventType: string;
  clientName: string;
  location: string;
  date: string;
  scaleMetric: string;
  stageDimension: string;
  summary: string;
  imageUrl: string;
  equipmentUsed: string[];
  linkedCategory: 'kinetic' | 'laser' | 'led-matrix';
}

interface DatabaseStore {
  categories: StoreCategory[];
  products: StoreProduct[];
  projects: StoreProject[];
  contacts: CustomerInboxItem[];
  siteSettings: SiteSettings;
  catalogModels: FigmaProductModel[];
  cmsProjects: CmsProjectCase[];
  media: CmsMediaItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'squaresnake_store.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'SquareSnake@2026';
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');

const SEED_DATA: DatabaseStore = {
  categories: [
    {
      category_id: 1,
      category_name: 'Hệ thống Kinetic',
      slug: 'kinetic',
      description:
        'Hệ thống bóng LED và vòng ánh sáng nâng hạ cơ khí chính xác theo chuẩn DMX512, Art-Net và Madrix.',
    },
    {
      category_id: 2,
      category_name: 'Ánh sáng Laser',
      slug: 'laser',
      description:
        'Hệ thống trình diễn Laser Full-Color RGB công suất lớn 15W–30W IP65 điều khiển qua mạng Pangolin FB4.',
    },
    {
      category_id: 3,
      category_name: 'LED Matrix',
      slug: 'led-matrix',
      description:
        'Hệ thống ma trận điểm ảnh LED COB công suất cao, ghép nối modular không viền cho concert và lễ hội.',
    },
  ],
  products: [
    {
      id: 'led-matrix-5x5-pixel',
      code: 'SS-LM55',
      name: 'LED Matrix Panel 5x5 Pixel',
      categoryKey: 'led-matrix',
      categoryLabel: 'LED Matrix',
      systemType: 'led-matrix',
      tagline: '25 bóng COB 30W · Ghép nối modular không viền',
      description:
        'Hệ thống ma trận điểm ảnh LED 5x5 chuyên dụng cho các concert quy mô lớn, tạo mảng ánh sáng nền blinder rực rỡ hoặc chạy ký tự, sóng pixel 3D sắc nét.',
      stageApplication:
        'Lắp đặt làm phông nền sau sân khấu (backdrop matrix), viền khung truss hoặc treo trần nghiêng.',
      imageUrl: '/assets/squaresnake/led-matrix.jpg',
      highlightSpec1Label: 'Công suất quang',
      highlightSpec1Value: '25 × 30W COB (750W)',
      highlightSpec2Label: 'Điều khiển',
      highlightSpec2Value: 'Art-Net / DMX512 / Kling-Net',
      stockCount: 140,
      status: 'available',
      isFeatured: true,
      specs: [
        { label: 'Kích thước khung', value: '580 × 580 × 145 mm' },
        { label: 'Nguồn sáng', value: '25 × 30W Warm White 2700K + RGB Halo' },
        { label: 'Chuẩn điều khiển', value: 'DMX512, Art-Net, sACN' },
      ],
      riggingNotes: {
        trussLoad: '14.5 kg / module',
        suspensionPoints: '2 × Quick-Lock Clamp',
        cableDrop: 'Khóa cam-lock 4 cạnh',
        controlChain: 'RJ45 Art-Net Loop',
      },
    },
  ],
  projects: [
    {
      id: 'proj-song-dem-festival',
      title: 'Đại Nhạc Hội Sóng Đêm 2026',
      eventType: 'Music Festival Ngoài Trời',
      clientName: 'Zeit Media & Live Nation VN',
      location: 'Sân vận động Mỹ Đình, Hà Nội',
      date: 'Tháng 10, 2026',
      scaleMetric: '35.000 Khán giả · 142 Thiết bị',
      stageDimension: '48m × 22m × 18m',
      summary:
        'Triển khai ma trận 96 quả Kinetic Ball 350mm kết hợp 12 máy Laser 30W IP65 quét tia đồng bộ Timecode với bàn điều khiển GrandMA3.',
      imageUrl: '/assets/squaresnake/hero-concert.jpg',
      equipmentUsed: [
        '96 × Kinetic Sphere Pro 350mm',
        '12 × Laser Full-Color 30W IP65',
      ],
      linkedCategory: 'laser',
    },
  ],
  contacts: [
    {
      contact_id: 1,
      reference_code: 'SS-BG-1001',
      customer_name: 'Trần Hoàng Nam',
      phone: 'nam.tran@apexevent.vn · 0912345678',
      company_agency: 'Apex Event Production',
      event_date: '2026-12-24',
      interested_categories: ['Kinetic Balls', '30W Laser'],
      stage_requirements:
        'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Balls và 4 máy Laser 30W.',
      status: 'quoted',
      admin_note: 'Đã gửi báo giá sơ bộ qua email ngày 12/11.',
      created_at: '2026-11-10T09:30:00.000Z',
    },
    {
      contact_id: 2,
      reference_code: 'SS-BG-1002',
      customer_name: 'Lê Thảo Vy',
      phone: 'vy.le@skylight.vn · 0987654321',
      company_agency: 'Skylight Creative Agency',
      event_date: '2026-12-31',
      interested_categories: ['Kinetic Rings', '60-pixel LED Matrix'],
      stage_requirements:
        'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Rings và 24 panel 60-pixel LED Matrix.',
      status: 'pending',
      admin_note: '',
      created_at: '2026-11-14T15:10:00.000Z',
    },
  ],
  siteSettings: JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS)) as SiteSettings,
  catalogModels: JSON.parse(JSON.stringify(PRODUCT_MODELS)) as FigmaProductModel[],
  cmsProjects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)) as CmsProjectCase[],
  media: JSON.parse(JSON.stringify(DEFAULT_MEDIA_LIBRARY)) as CmsMediaItem[],
};

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function hydrateStore(parsed: Partial<DatabaseStore>): {
  store: DatabaseStore;
  didMigrate: boolean;
} {
  let didMigrate = false;

  const store: DatabaseStore = {
    categories: Array.isArray(parsed.categories) ? parsed.categories : SEED_DATA.categories,
    products: Array.isArray(parsed.products) ? parsed.products : SEED_DATA.products,
    projects: Array.isArray(parsed.projects) ? parsed.projects : SEED_DATA.projects,
    contacts: Array.isArray(parsed.contacts) ? parsed.contacts : SEED_DATA.contacts,
    siteSettings: parsed.siteSettings
      ? { ...DEFAULT_SITE_SETTINGS, ...parsed.siteSettings }
      : (() => {
          didMigrate = true;
          return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS)) as SiteSettings;
        })(),
    catalogModels:
      Array.isArray(parsed.catalogModels) && parsed.catalogModels.length > 0
        ? parsed.catalogModels
        : (() => {
            didMigrate = true;
            return JSON.parse(JSON.stringify(PRODUCT_MODELS)) as FigmaProductModel[];
          })(),
    cmsProjects:
      Array.isArray(parsed.cmsProjects) && parsed.cmsProjects.length > 0
        ? parsed.cmsProjects
        : (() => {
            didMigrate = true;
            return JSON.parse(JSON.stringify(DEFAULT_PROJECTS)) as CmsProjectCase[];
          })(),
    media:
      Array.isArray(parsed.media) && parsed.media.length > 0
        ? parsed.media
        : (() => {
            didMigrate = true;
            return JSON.parse(JSON.stringify(DEFAULT_MEDIA_LIBRARY)) as CmsMediaItem[];
          })(),
  };

  return { store, didMigrate };
}

function readStore(): DatabaseStore {
  ensureDirectories();
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(SEED_DATA)) as DatabaseStore;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseStore>;
    const { store, didMigrate } = hydrateStore(parsed);
    if (didMigrate) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    }
    return store;
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(SEED_DATA)) as DatabaseStore;
  }
}

function writeStore(store: DatabaseStore): void {
  ensureDirectories();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
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

  ensureDirectories();
  readStore();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded images and videos reliably
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health & Legacy Catalog Routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'SquareSnake Vietnam Full-Stack API' });
  });

  app.get('/api/categories', (_req, res) => {
    const store = readStore();
    res.json({ success: true, data: store.categories });
  });

  app.get('/api/products', (req, res) => {
    const store = readStore();
    const category = typeof req.query.category === 'string' ? req.query.category : 'all';
    const search =
      typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
    const featured = req.query.featured === 'true';

    const filtered = store.products.filter((item) => {
      if (category !== 'all' && item.categoryKey !== category) return false;
      if (featured && !item.isFeatured) return false;
      if (search) {
        const hay = [
          item.name,
          item.code,
          item.tagline,
          item.categoryLabel,
          ...item.specs.map((s) => `${s.label} ${s.value}`),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    res.json({ success: true, count: filtered.length, data: filtered });
  });

  app.get('/api/projects', (_req, res) => {
    const store = readStore();
    res.json({ success: true, count: store.projects.length, data: store.projects });
  });

  // Public CMS Endpoint consumed by customer-facing storefront
  app.get('/api/cms/public', (_req, res) => {
    const store = readStore();
    res.json({
      success: true,
      data: {
        siteSettings: store.siteSettings,
        models: store.catalogModels,
        projects: store.cmsProjects,
        media: store.media,
      },
    });
  });

  // Customer Quote Submission (Writes to Customer Inbox)
  app.post('/api/contacts', (req, res) => {
    const store = readStore();
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

    const nextId =
      store.contacts.length > 0
        ? Math.max(...store.contacts.map((c) => c.contact_id)) + 1
        : 1;
    const referenceCode = `SS-BG-${String(1000 + nextId)}`;

    const newContact: CustomerInboxItem = {
      contact_id: nextId,
      reference_code: referenceCode,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      company_agency: company_agency?.trim() || 'Khách hàng trực tiếp',
      event_date: event_date?.trim() || 'Chưa ấn định',
      interested_categories: categoriesArr,
      stage_requirements:
        stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
      status: 'pending',
      admin_note: '',
      created_at: new Date().toISOString(),
    };

    store.contacts.unshift(newContact);
    writeStore(store);

    res.status(201).json({
      success: true,
      message: 'Yêu cầu báo giá đã được ghi nhận.',
      reference_code: referenceCode,
      data: newContact,
    });
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

  // Admin Inbox Endpoints
  app.get('/api/contacts', requireAdmin, (_req, res) => {
    const store = readStore();
    const sorted = [...store.contacts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json({ success: true, count: sorted.length, data: sorted });
  });

  app.get('/api/admin/inbox', requireAdmin, (_req, res) => {
    const store = readStore();
    const sorted = [...store.contacts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json({ success: true, count: sorted.length, data: sorted });
  });

  app.patch('/api/admin/inbox/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idNum = Number(req.params.id);
    const { status, admin_note } = req.body as {
      status?: 'pending' | 'contacted' | 'quoted';
      admin_note?: string;
    };

    const target = store.contacts.find((c) => c.contact_id === idNum);
    if (!target) {
      res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
      return;
    }

    if (status) {
      if (!['pending', 'contacted', 'quoted'].includes(status)) {
        res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
        return;
      }
      target.status = status;
    }
    if (typeof admin_note === 'string') {
      target.admin_note = admin_note;
    }

    writeStore(store);
    res.json({ success: true, data: target });
  });

  app.patch('/api/contacts/:id/status', requireAdmin, (req, res) => {
    const store = readStore();
    const idNum = Number(req.params.id);
    const { status } = req.body as { status?: 'pending' | 'contacted' | 'quoted' };

    if (!status || !['pending', 'contacted', 'quoted'].includes(status)) {
      res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
      return;
    }

    const target = store.contacts.find((c) => c.contact_id === idNum);
    if (!target) {
      res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
      return;
    }

    target.status = status;
    writeStore(store);
    res.json({ success: true, data: target });
  });

  app.delete('/api/admin/inbox/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idNum = Number(req.params.id);
    const before = store.contacts.length;
    store.contacts = store.contacts.filter((c) => c.contact_id !== idNum);
    if (store.contacts.length === before) {
      res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu.' });
      return;
    }
    writeStore(store);
    res.json({ success: true });
  });

  // Admin Site Settings (Hero, About, Footer, Contact Info)
  app.put('/api/admin/site-settings', requireAdmin, (req, res) => {
    const store = readStore();
    const patch = req.body as Partial<SiteSettings>;
    store.siteSettings = {
      ...store.siteSettings,
      ...patch,
    };
    writeStore(store);
    res.json({ success: true, data: store.siteSettings });
  });

  // Admin Product Models CRUD
  app.post('/api/admin/models', requireAdmin, (req, res) => {
    const store = readStore();
    const body = req.body as Partial<FigmaProductModel>;
    if (!body.fullName?.trim() || !body.collection) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Tên sản phẩm và Chọn dòng thiết bị.',
      });
      return;
    }

    const collectionLabels: Record<'led-matrix' | 'laser' | 'kinetic', string> = {
      'led-matrix': 'LED Matrix',
      laser: 'Laser',
      kinetic: 'Kinetic',
    };

    const slugId =
      body.id?.trim() ||
      `${body.collection}-${body.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const created: FigmaProductModel = {
      id: slugId,
      collection: body.collection,
      collectionName: collectionLabels[body.collection],
      kicker:
        body.kicker?.trim() ||
        `${collectionLabels[body.collection].toUpperCase()} / ${(
          body.shortLabel || body.fullName
        ).toUpperCase()}`,
      shortLabel: body.shortLabel?.trim() || body.fullName.trim(),
      titleLine1: body.titleLine1?.trim() || body.shortLabel?.trim() || body.fullName.trim(),
      titleLine2: body.titleLine2?.trim() || collectionLabels[body.collection],
      fullName: body.fullName.trim(),
      cardTag: body.cardTag?.trim() || `${collectionLabels[body.collection]} / ${body.fullName.trim()}`,
      heroSummary:
        body.heroSummary?.trim() ||
        `Cấu hình ${body.fullName.trim()} chuyên dụng cho sân khấu và sự kiện.`,
      imageUrl: body.imageUrl?.trim() || '/assets/squaresnake/hero-concert.jpg',
      videoUrl: body.videoUrl?.trim() || '',
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      specs:
        Array.isArray(body.specs) && body.specs.length > 0
          ? body.specs
          : [
              { label: 'Model', value: body.fullName.trim() },
              { label: 'Control protocol', value: 'DMX512 / Art-Net' },
            ],
      specsFootnote:
        body.specsFootnote?.trim() ||
        'Thông số có thể tùy chỉnh theo yêu cầu dự án thực tế.',
      applicationsLead:
        body.applicationsLead?.trim() || 'Hiệu ứng sân khấu chuyên nghiệp.',
      applicationsBody:
        body.applicationsBody?.trim() ||
        'Phù hợp cho concert, triển lãm và các sự kiện ngoài trời hoặc trong nhà.',
      applicationsFootnote:
        body.applicationsFootnote?.trim() ||
        'Tư vấn cấu hình chi tiết bởi đội ngũ kỹ sư SquareSnake FX.',
    };

    store.catalogModels.push(created);
    writeStore(store);
    res.status(201).json({ success: true, data: created });
  });

  app.put('/api/admin/models/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.catalogModels.findIndex((m) => m.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
      return;
    }
    const patch = req.body as Partial<FigmaProductModel>;
    const current = store.catalogModels[idx];
    const collectionLabels: Record<'led-matrix' | 'laser' | 'kinetic', string> = {
      'led-matrix': 'LED Matrix',
      laser: 'Laser',
      kinetic: 'Kinetic',
    };
    const nextCollection = patch.collection || current.collection;
    store.catalogModels[idx] = {
      ...current,
      ...patch,
      id: current.id,
      collection: nextCollection,
      collectionName: collectionLabels[nextCollection],
    };
    writeStore(store);
    res.json({ success: true, data: store.catalogModels[idx] });
  });

  app.delete('/api/admin/models/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const before = store.catalogModels.length;
    store.catalogModels = store.catalogModels.filter((m) => m.id !== req.params.id);
    if (store.catalogModels.length === before) {
      res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
      return;
    }
    writeStore(store);
    res.json({ success: true });
  });

  // Admin Case Studies / Projects CRUD
  app.post('/api/admin/projects', requireAdmin, (req, res) => {
    const store = readStore();
    const body = req.body as Partial<CmsProjectCase>;
    if (!body.title?.trim()) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập Tên dự án.' });
      return;
    }
    const created: CmsProjectCase = {
      id: `case-${Date.now()}`,
      num:
        body.num?.trim() ||
        `0${store.cmsProjects.length + 1} / STAGE PROJECT`,
      title: body.title.trim(),
      detail: body.detail?.trim() || 'LED Matrix · Laser · Kinetic',
      summary:
        body.summary?.trim() ||
        'Dự án trình diễn ánh sáng và hiệu ứng sân khấu do SquareSnake FX triển khai.',
      imageUrl: body.imageUrl?.trim() || '/assets/squaresnake/hero-concert.jpg',
      videoUrl: body.videoUrl?.trim() || '',
      slug: body.slug || 'kinetic',
    };
    store.cmsProjects.unshift(created);
    writeStore(store);
    res.status(201).json({ success: true, data: created });
  });

  app.put('/api/admin/projects/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const idx = store.cmsProjects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Không tìm thấy dự án.' });
      return;
    }
    store.cmsProjects[idx] = {
      ...store.cmsProjects[idx],
      ...(req.body as Partial<CmsProjectCase>),
      id: store.cmsProjects[idx].id,
    };
    writeStore(store);
    res.json({ success: true, data: store.cmsProjects[idx] });
  });

  app.delete('/api/admin/projects/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const before = store.cmsProjects.length;
    store.cmsProjects = store.cmsProjects.filter((p) => p.id !== req.params.id);
    if (store.cmsProjects.length === before) {
      res.status(404).json({ success: false, message: 'Không tìm thấy dự án.' });
      return;
    }
    writeStore(store);
    res.json({ success: true });
  });

  // Admin Direct File Upload (Images & Videos) + External Media Link
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
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
        message: 'Chỉ hỗ trợ ảnh (JPG, PNG, WebP, GIF) hoặc video (MP4, WebM, MOV).',
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

      const ext = path.extname(filename).toLowerCase() || (isImage ? '.jpg' : '.mp4');
      const base = path
        .basename(filename, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40) || 'media';
      const storedName = `${Date.now()}-${base}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, storedName);
      fs.writeFileSync(targetPath, buffer);

      const url = `/uploads/${storedName}`;
      const store = readStore();
      const mediaItem: CmsMediaItem = {
        id: `media-${Date.now()}`,
        title: title?.trim() || filename,
        type: isImage ? 'image' : 'video',
        url,
        category: category?.trim() || (isImage ? 'Hình ảnh sân khấu' : 'Video trình diễn'),
        createdAt: new Date().toISOString(),
      };

      store.media.unshift(mediaItem);
      writeStore(store);

      res.status(201).json({ success: true, url, data: mediaItem });
    } catch {
      res.status(500).json({
        success: false,
        message: 'Không thể lưu tệp tin lên máy chủ.',
      });
    }
  });

  app.post('/api/admin/media', requireAdmin, (req, res) => {
    const { title, type, url, category } = req.body as Partial<CmsMediaItem>;
    if (!url?.trim() || !title?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Tiêu đề và Đường dẫn ảnh/video.',
      });
      return;
    }
    const store = readStore();
    const item: CmsMediaItem = {
      id: `media-${Date.now()}`,
      title: title.trim(),
      type: type === 'video' ? 'video' : 'image',
      url: url.trim(),
      category: category?.trim() || 'Thư viện media',
      createdAt: new Date().toISOString(),
    };
    store.media.unshift(item);
    writeStore(store);
    res.status(201).json({ success: true, data: item });
  });

  app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const target = store.media.find((m) => m.id === req.params.id);
    if (!target) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tệp media.' });
      return;
    }
    store.media = store.media.filter((m) => m.id !== req.params.id);
    writeStore(store);

    if (target.url.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(target.url));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // ignore cleanup failure
        }
      }
    }

    res.json({ success: true });
  });

  // Vite Middleware in Development / Static Dist in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[SquareSnake Full-Stack] Server đang chạy tại http://0.0.0.0:${PORT}`
    );
  });
}

startServer();
