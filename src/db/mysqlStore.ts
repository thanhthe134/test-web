import fs from 'fs';
import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import path from 'path';
import {
  COLLECTIONS,
  DEFAULT_MEDIA_LIBRARY,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_SETTINGS,
  PRODUCT_MODELS,
} from '../data/figmaCatalog.ts';
import {
  CmsMediaItem,
  CmsProjectCase,
  CollectionSlug,
  CustomerInboxItem,
  FigmaProductModel,
  PublicCmsPayload,
  SiteSettings,
} from '../types/cms.ts';

interface CategoryRow {
  category_id: number;
  slug: CollectionSlug;
  name: string;
  kicker: string;
  hero_line1: string;
  hero_line2: string;
  hero_description: string;
  hero_image_url: string;
}

interface JsonStoreShape {
  categories: {
    category_id: number;
    category_name: string;
    slug: string;
    description: string;
  }[];
  contacts: CustomerInboxItem[];
  siteSettings: SiteSettings;
  catalogModels: FigmaProductModel[];
  cmsProjects: CmsProjectCase[];
  media: CmsMediaItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'squaresnake_store.json');

const SEED_CONTACTS: CustomerInboxItem[] = [
  {
    contact_id: 1,
    reference_code: 'SS-BG-0001',
    customer_name: 'Trần Hoàng Nam',
    phone: '0912345678 · nam.tran@apexevent.vn',
    company_agency: 'Apex Event Production',
    event_date: '2026-12-24',
    interested_categories: ['Kinetic Balls', '30W Laser'],
    stage_requirements:
      'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Balls và 4 máy Laser 30W.',
    status: 'quoted',
    admin_note: '',
    created_at: '2026-11-10T09:30:00.000Z',
  },
  {
    contact_id: 2,
    reference_code: 'SS-BG-0002',
    customer_name: 'Lê Thảo Vy',
    phone: '0987654321 · vy.le@skylightagency.vn',
    company_agency: 'Skylight Creative Agency',
    event_date: '2026-12-31',
    interested_categories: ['Kinetic Rings', '60-pixel LED Matrix'],
    stage_requirements:
      'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Rings và 24 panel 60-pixel LED Matrix.',
    status: 'pending',
    admin_note: '',
    created_at: '2026-11-14T15:10:00.000Z',
  },
];

function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function getMysqlConfig() {
  const host = (process.env.MYSQL_HOST || process.env.DB_HOST || '').trim();
  const port = Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306);
  const user = (process.env.MYSQL_USER || process.env.DB_USER || 'root').trim();
  const password = process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? '';
  const database = (
    process.env.MYSQL_DATABASE ||
    process.env.DB_NAME ||
    'squaresnake_fx'
  ).trim();
  return { host, port, user, password, database };
}

function toModelCode(id: string): string {
  const map: Record<string, string> = {
    'led-matrix-20-pixel': 'SS-LM20',
    'led-matrix-60-pixel': 'SS-LM60',
    'laser-20w': 'SS-LS20',
    'laser-30w': 'SS-LS30',
    'laser-40w': 'SS-LS40',
    'laser-60w': 'SS-LS60',
    'kinetic-balls': 'SS-KN-BALL',
    'kinetic-rings': 'SS-KN-RING',
    'kinetic-lanterns': 'SS-KN-LANT',
    'kinetic-milk-drop': 'SS-KN-DROP',
    'kinetic-metal-spheres': 'SS-KN-METL',
  };
  return map[id] || id.toUpperCase().slice(0, 48);
}

function fromModelCodeToSlugId(modelCode: string): string {
  const reverse: Record<string, string> = {
    'SS-LM20': 'led-matrix-20-pixel',
    'SS-LM60': 'led-matrix-60-pixel',
    'SS-LS20': 'laser-20w',
    'SS-LS30': 'laser-30w',
    'SS-LS40': 'laser-40w',
    'SS-LS60': 'laser-60w',
    'SS-KN-BALL': 'kinetic-balls',
    'SS-KN-RING': 'kinetic-rings',
    'SS-KN-LANT': 'kinetic-lanterns',
    'SS-KN-DROP': 'kinetic-milk-drop',
    'SS-KN-METL': 'kinetic-metal-spheres',
  };
  return reverse[modelCode] || modelCode.toLowerCase();
}

function mapProductRowToFigmaModel(row: RowDataPacket): FigmaProductModel {
  const slugId = fromModelCodeToSlugId(String(row.model_code || ''));
  const base = PRODUCT_MODELS.find(
    (m) => m.id === slugId || m.fullName.toLowerCase() === String(row.product_name || '').toLowerCase()
  );
  const collection = (row.category_slug || base?.collection || 'kinetic') as CollectionSlug;
  const collectionName = String(
    row.category_name || COLLECTIONS[collection]?.name || 'Kinetic'
  );
  const rawSpecs = parseJsonColumn<Record<string, unknown>>(row.technical_specs, {});
  const specEntries: { label: string; value: string }[] = Array.isArray(rawSpecs)
    ? (rawSpecs as { label: string; value: string }[])
    : [
        { label: 'Model / Variant', value: String(rawSpecs.variant || row.model_code || '') },
        { label: 'Dimensions / Weight', value: String(rawSpecs.dimensions || 'Theo datasheet') },
        { label: 'Power / Cable travel', value: String(rawSpecs.cable_travel_or_power || 'Theo cấu hình') },
        { label: 'Speed / Scan', value: String(rawSpecs.speed || 'Chuyên dụng sân khấu') },
        { label: 'Control protocol', value: String(rawSpecs.control_protocol || 'DMX512 / Art-Net') },
        { label: 'Voltage & Weight', value: `${String(rawSpecs.voltage || 'AC 100–240V')} · ${String(rawSpecs.weight || '')}` },
      ];

  const fullName = String(row.product_name || base?.fullName || 'SquareSnake FX Model');
  const words = fullName.split(' ');
  const titleLine1 = base?.titleLine1 || words[0] || fullName;
  const titleLine2 = base?.titleLine2 || words.slice(1).join(' ') || collectionName;

  return {
    id: slugId,
    collection,
    collectionName,
    kicker: base?.kicker || `${collectionName.toUpperCase()} / ${String(row.model_code || '')}`,
    shortLabel: base?.shortLabel || String(rawSpecs.variant || row.model_code || fullName),
    titleLine1,
    titleLine2,
    fullName,
    cardTag: base?.cardTag || `${collectionName} / ${row.model_code}`,
    heroSummary: String(row.short_description || base?.heroSummary || ''),
    imageUrl: String(row.image_url || base?.imageUrl || '/assets/squaresnake/hero-concert.jpg'),
    videoUrl: String(row.video_demo_url || ''),
    galleryImages: base?.galleryImages || [],
    specs: specEntries,
    specsFootnote:
      base?.specsFootnote || 'Thông số kỹ thuật được lưu đồng bộ từ cơ sở dữ liệu MySQL.',
    applicationsLead: base?.applicationsLead || 'Hiệu ứng sân khấu chuyên nghiệp.',
    applicationsBody:
      base?.applicationsBody ||
      'Đồng bộ Timecode DMX512 / Art-Net cho concert, triển lãm và sự kiện quy mô lớn.',
    applicationsFootnote:
      base?.applicationsFootnote || 'SquareSnake FX Việt Nam · Showroom Kỹ thuật số 24/7.',
  };
}

class SquareSnakeStore {
  private pool: Pool | null = null;
  private initializedMysql = false;
  private mysqlInitPromise: Promise<void> | null = null;

  public isMysqlEnabled(): boolean {
    return Boolean(getMysqlConfig().host);
  }

  public getMode(): 'mysql' | 'json-fallback' {
    return this.isMysqlEnabled() ? 'mysql' : 'json-fallback';
  }

  private async ensureMysql(): Promise<Pool> {
    if (this.pool && this.initializedMysql) {
      return this.pool;
    }
    if (!this.mysqlInitPromise) {
      this.mysqlInitPromise = this.bootstrapMysql();
    }
    await this.mysqlInitPromise;
    if (!this.pool) {
      throw new Error('Không thể khởi tạo kết nối MySQL.');
    }
    return this.pool;
  }

  private async bootstrapMysql(): Promise<void> {
    const cfg = getMysqlConfig();
    if (!cfg.host) {
      throw new Error('MYSQL_HOST chưa được cấu hình.');
    }

    const bootstrapConn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      charset: 'utf8mb4',
    });
    await bootstrapConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${cfg.database.replace(/`/g, '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await bootstrapConn.end();

    this.pool = mysql.createPool({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: 10,
      charset: 'utf8mb4',
    });

    // Ensure official 4-table MySQL schema (categories, products, projects, contacts)
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(120) NOT NULL,
        slug VARCHAR(120) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        product_name VARCHAR(180) NOT NULL,
        model_code VARCHAR(50) NOT NULL UNIQUE,
        short_description TEXT,
        technical_specs JSON NOT NULL,
        image_url VARCHAR(255),
        video_demo_url VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        status ENUM('available', 'maintenance') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_category
          FOREIGN KEY (category_id) REFERENCES categories(category_id)
          ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id INT AUTO_INCREMENT PRIMARY KEY,
        event_name VARCHAR(200) NOT NULL,
        client_name VARCHAR(160) NOT NULL,
        location VARCHAR(180) NOT NULL,
        event_date DATE NOT NULL,
        equipment_used VARCHAR(255) NOT NULL,
        summary TEXT,
        thumbnail_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        contact_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(150) NOT NULL,
        phone VARCHAR(60) NOT NULL,
        email VARCHAR(150),
        company_agency VARCHAR(180),
        event_date DATE,
        interested_categories VARCHAR(255) NOT NULL,
        stage_requirements TEXT,
        status ENUM('pending', 'contacted', 'quoted') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    this.initializedMysql = true;
    console.log(
      `[MySQL] Đã kết nối tới database 4 bảng '${cfg.database}' tại ${cfg.host}:${cfg.port}`
    );
  }

  private readJsonStore(): JsonStoreShape {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const seed: JsonStoreShape = {
      categories: [
        {
          category_id: 1,
          category_name: 'LED Matrix',
          slug: 'led-matrix',
          description: 'Hệ thống ma trận điểm ảnh LED lập trình 3D.',
        },
        {
          category_id: 2,
          category_name: 'Laser',
          slug: 'laser',
          description: 'Hệ thống Laser trình diễn công suất cao RGB.',
        },
        {
          category_id: 3,
          category_name: 'Kinetic',
          slug: 'kinetic',
          description: 'Hệ thống tời nâng hạ ánh sáng Kinetic đa trục.',
        },
      ],
      contacts: JSON.parse(JSON.stringify(SEED_CONTACTS)) as CustomerInboxItem[],
      siteSettings: JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS)) as SiteSettings,
      catalogModels: JSON.parse(JSON.stringify(PRODUCT_MODELS)) as FigmaProductModel[],
      cmsProjects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)) as CmsProjectCase[],
      media: JSON.parse(JSON.stringify(DEFAULT_MEDIA_LIBRARY)) as CmsMediaItem[],
    };
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    try {
      const parsed = JSON.parse(
        fs.readFileSync(STORE_PATH, 'utf-8')
      ) as Partial<JsonStoreShape>;
      return {
        categories: parsed.categories || seed.categories,
        contacts: parsed.contacts || seed.contacts,
        siteSettings: parsed.siteSettings
          ? { ...DEFAULT_SITE_SETTINGS, ...parsed.siteSettings }
          : seed.siteSettings,
        catalogModels:
          parsed.catalogModels && parsed.catalogModels.length > 0
            ? parsed.catalogModels
            : seed.catalogModels,
        cmsProjects:
          parsed.cmsProjects && parsed.cmsProjects.length > 0
            ? parsed.cmsProjects
            : seed.cmsProjects,
        media:
          parsed.media && parsed.media.length > 0 ? parsed.media : seed.media,
      };
    } catch {
      fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
  }

  private writeJsonStore(data: JsonStoreShape): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  public async getCategories(): Promise<CategoryRow[]> {
    const defaults: Record<string, CategoryRow> = {
      'led-matrix': {
        category_id: 1,
        slug: 'led-matrix',
        name: 'LED Matrix',
        kicker: '01 / LED MATRIX',
        hero_line1: 'Every pixel.',
        hero_line2: 'Every possibility.',
        hero_description: 'LED Matrix 20-pixel & 60-pixel',
        hero_image_url: '/assets/squaresnake/led-matrix.jpg',
      },
      laser: {
        category_id: 2,
        slug: 'laser',
        name: 'Laser',
        kicker: '02 / LASER',
        hero_line1: 'Precision light.',
        hero_line2: 'Powerful impact.',
        hero_description: 'Laser 20W / 30W / 40W / 60W',
        hero_image_url: '/assets/squaresnake/laser.jpg',
      },
      kinetic: {
        category_id: 3,
        slug: 'kinetic',
        name: 'Kinetic',
        kicker: '03 / KINETIC',
        hero_line1: 'Sculpt the air.',
        hero_line2: 'Move the room.',
        hero_description: 'Kinetic Balls, Rings, Lanterns, Milk-drop, Metal spheres',
        hero_image_url: '/assets/squaresnake/kinetic-balls.jpg',
      },
    };

    if (!this.isMysqlEnabled()) {
      return Object.values(defaults);
    }

    const pool = await this.ensureMysql();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT category_id, category_name, slug, description FROM categories ORDER BY category_id ASC'
    );
    if (!rows.length) return Object.values(defaults);
    return rows.map((r) => {
      const slug = String(r.slug || 'kinetic') as CollectionSlug;
      const base = defaults[slug] || defaults.kinetic;
      return {
        category_id: Number(r.category_id),
        slug,
        name: String(r.category_name || base.name),
        kicker: base.kicker,
        hero_line1: base.hero_line1,
        hero_line2: base.hero_line2,
        hero_description: String(r.description || base.hero_description),
        hero_image_url: base.hero_image_url,
      };
    });
  }

  public async getPublicCms(): Promise<PublicCmsPayload> {
    const jsonState = this.readJsonStore();
    if (!this.isMysqlEnabled()) {
      return {
        siteSettings: jsonState.siteSettings,
        models: jsonState.catalogModels,
        projects: jsonState.cmsProjects,
        media: jsonState.media,
      };
    }

    const pool = await this.ensureMysql();
    const [prodRows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.category_name, c.slug AS category_slug
       FROM products p
       INNER JOIN categories c ON p.category_id = c.category_id
       ORDER BY p.category_id ASC, p.product_id ASC`
    );
    const models =
      prodRows.length > 0
        ? prodRows.map(mapProductRowToFigmaModel)
        : jsonState.catalogModels;

    const [projRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects ORDER BY event_date DESC, project_id DESC'
    );
    const projects: CmsProjectCase[] =
      projRows.length > 0
        ? projRows.map((r, idx) => {
            const equip = String(r.equipment_used || '');
            const inferredSlug: CollectionSlug = /laser/i.test(equip)
              ? 'laser'
              : /matrix/i.test(equip)
              ? 'led-matrix'
              : 'kinetic';
            return {
              id: `proj-${r.project_id}`,
              num: `0${idx + 1} / ${String(r.location || 'PROJECT')}`,
              title: String(r.event_name || ''),
              detail: equip,
              summary: String(r.summary || ''),
              imageUrl: String(r.thumbnail_url || '/assets/squaresnake/hero-concert.jpg'),
              videoUrl: '',
              slug: inferredSlug,
            };
          })
        : jsonState.cmsProjects;

    return {
      siteSettings: jsonState.siteSettings,
      models,
      projects,
      media: jsonState.media,
    };
  }

  public async getProductsFiltered(filters: {
    category?: string;
    search?: string;
  }): Promise<FigmaProductModel[]> {
    const cms = await this.getPublicCms();
    const cat = filters.category || 'all';
    const q = (filters.search || '').trim().toLowerCase();
    return cms.models.filter((m) => {
      if (cat !== 'all' && m.collection !== cat) return false;
      if (!q) return true;
      return [
        m.fullName,
        m.shortLabel,
        m.collectionName,
        m.heroSummary,
        ...m.specs.map((s) => `${s.label} ${s.value}`),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }

  public async updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const store = this.readJsonStore();
    store.siteSettings = { ...store.siteSettings, ...patch };
    this.writeJsonStore(store);
    return store.siteSettings;
  }

  public async createModel(
    body: Partial<FigmaProductModel> & { collection: CollectionSlug; fullName: string }
  ): Promise<FigmaProductModel> {
    const collectionLabels: Record<CollectionSlug, string> = {
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
      titleLine1:
        body.titleLine1?.trim() || body.shortLabel?.trim() || body.fullName.trim(),
      titleLine2: body.titleLine2?.trim() || collectionLabels[body.collection],
      fullName: body.fullName.trim(),
      cardTag:
        body.cardTag?.trim() ||
        `${collectionLabels[body.collection]} / ${body.fullName.trim()}`,
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

    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      store.catalogModels.push(created);
      this.writeJsonStore(store);
      return created;
    }

    const pool = await this.ensureMysql();
    const [catRows] = await pool.query<RowDataPacket[]>(
      'SELECT category_id FROM categories WHERE slug = ? LIMIT 1',
      [created.collection]
    );
    const categoryId = Number(catRows[0]?.category_id || 1);
    const modelCode = toModelCode(created.id);

    await pool.query(
      `INSERT INTO products (
        category_id, product_name, model_code, short_description,
        technical_specs, image_url, video_demo_url, is_featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, 'available')`,
      [
        categoryId,
        created.fullName,
        modelCode,
        created.heroSummary,
        JSON.stringify(created.specs || []),
        created.imageUrl,
        created.videoUrl || '',
      ]
    );
    return created;
  }

  public async updateModel(
    slugId: string,
    patch: Partial<FigmaProductModel>
  ): Promise<FigmaProductModel | null> {
    const collectionLabels: Record<CollectionSlug, string> = {
      'led-matrix': 'LED Matrix',
      laser: 'Laser',
      kinetic: 'Kinetic',
    };

    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const idx = store.catalogModels.findIndex((m) => m.id === slugId);
      if (idx === -1) return null;
      const nextCollection = patch.collection || store.catalogModels[idx].collection;
      store.catalogModels[idx] = {
        ...store.catalogModels[idx],
        ...patch,
        id: slugId,
        collection: nextCollection,
        collectionName: collectionLabels[nextCollection],
      };
      this.writeJsonStore(store);
      return store.catalogModels[idx];
    }

    const pool = await this.ensureMysql();
    const existing = (await this.getPublicCms()).models.find((m) => m.id === slugId);
    if (!existing) return null;

    const nextCollection = patch.collection || existing.collection;
    const next: FigmaProductModel = {
      ...existing,
      ...patch,
      id: slugId,
      collection: nextCollection,
      collectionName: collectionLabels[nextCollection],
    };

    const [catRows] = await pool.query<RowDataPacket[]>(
      'SELECT category_id FROM categories WHERE slug = ? LIMIT 1',
      [next.collection]
    );
    const categoryId = Number(catRows[0]?.category_id || 1);
    const modelCode = toModelCode(slugId);

    await pool.query(
      `UPDATE products SET
        category_id = ?, product_name = ?, short_description = ?,
        technical_specs = ?, image_url = ?, video_demo_url = ?
      WHERE model_code = ?`,
      [
        categoryId,
        next.fullName,
        next.heroSummary,
        JSON.stringify(next.specs || []),
        next.imageUrl,
        next.videoUrl || '',
        modelCode,
      ]
    );
    return next;
  }

  public async deleteModel(slugId: string): Promise<boolean> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const before = store.catalogModels.length;
      store.catalogModels = store.catalogModels.filter((m) => m.id !== slugId);
      if (store.catalogModels.length === before) return false;
      this.writeJsonStore(store);
      return true;
    }
    const pool = await this.ensureMysql();
    const modelCode = toModelCode(slugId);
    const [res] = await pool.query<ResultSetHeader>(
      'DELETE FROM products WHERE model_code = ? OR product_id = ?',
      [modelCode, Number(slugId) || -1]
    );
    return res.affectedRows > 0;
  }

  public async createProject(
    body: Partial<CmsProjectCase> & { title: string }
  ): Promise<CmsProjectCase> {
    const created: CmsProjectCase = {
      id: `case-${Date.now()}`,
      num: body.num?.trim() || 'PROJECT CASE',
      title: body.title.trim(),
      detail: body.detail?.trim() || 'LED Matrix · Laser · Kinetic',
      summary:
        body.summary?.trim() ||
        'Dự án trình diễn ánh sáng và hiệu ứng sân khấu do SquareSnake FX triển khai.',
      imageUrl: body.imageUrl?.trim() || '/assets/squaresnake/hero-concert.jpg',
      videoUrl: body.videoUrl?.trim() || '',
      slug: body.slug || 'kinetic',
    };

    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      store.cmsProjects.unshift(created);
      this.writeJsonStore(store);
      return created;
    }

    const pool = await this.ensureMysql();
    const today = new Date().toISOString().slice(0, 10);
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO projects (event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        created.title,
        'SquareSnake FX Client',
        created.num,
        today,
        created.detail,
        created.summary,
        created.imageUrl,
      ]
    );
    created.id = `proj-${res.insertId}`;
    return created;
  }

  public async updateProject(
    slugId: string,
    patch: Partial<CmsProjectCase>
  ): Promise<CmsProjectCase | null> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const idx = store.cmsProjects.findIndex((p) => p.id === slugId);
      if (idx === -1) return null;
      store.cmsProjects[idx] = { ...store.cmsProjects[idx], ...patch, id: slugId };
      this.writeJsonStore(store);
      return store.cmsProjects[idx];
    }

    const numericId = Number(slugId.replace('proj-', ''));
    if (!numericId) return null;
    const pool = await this.ensureMysql();
    const existing = (await this.getPublicCms()).projects.find((p) => p.id === slugId);
    if (!existing) return null;
    const next = { ...existing, ...patch, id: slugId };
    await pool.query(
      `UPDATE projects SET
        event_name = ?, location = ?, equipment_used = ?, summary = ?, thumbnail_url = ?
      WHERE project_id = ?`,
      [next.title, next.num, next.detail, next.summary, next.imageUrl, numericId]
    );
    return next;
  }

  public async deleteProject(slugId: string): Promise<boolean> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const before = store.cmsProjects.length;
      store.cmsProjects = store.cmsProjects.filter((p) => p.id !== slugId);
      if (store.cmsProjects.length === before) return false;
      this.writeJsonStore(store);
      return true;
    }
    const numericId = Number(slugId.replace('proj-', ''));
    if (!numericId) return false;
    const pool = await this.ensureMysql();
    const [res] = await pool.query<ResultSetHeader>(
      'DELETE FROM projects WHERE project_id = ?',
      [numericId]
    );
    return res.affectedRows > 0;
  }

  public async addMedia(item: CmsMediaItem): Promise<CmsMediaItem> {
    const store = this.readJsonStore();
    store.media.unshift(item);
    this.writeJsonStore(store);
    return item;
  }

  public async deleteMedia(slugId: string): Promise<CmsMediaItem | null> {
    const store = this.readJsonStore();
    const target = store.media.find((m) => m.id === slugId) || null;
    if (!target) return null;
    store.media = store.media.filter((m) => m.id !== slugId);
    this.writeJsonStore(store);
    return target;
  }

  public async getInbox(): Promise<CustomerInboxItem[]> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      return [...store.contacts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    const pool = await this.ensureMysql();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM contacts ORDER BY contact_id DESC'
    );
    return rows.map((r) => ({
      contact_id: Number(r.contact_id),
      reference_code: `SS-BG-${String(r.contact_id).padStart(4, '0')}`,
      customer_name: String(r.customer_name || ''),
      phone: `${String(r.phone || '')}${r.email ? ` · ${r.email}` : ''}`,
      company_agency: String(r.company_agency || 'Khách trực tiếp'),
      event_date: r.event_date ? String(r.event_date).slice(0, 10) : 'Chưa ấn định',
      interested_categories: String(r.interested_categories || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      stage_requirements: String(r.stage_requirements || ''),
      status: r.status as 'pending' | 'contacted' | 'quoted',
      admin_note: '',
      created_at: new Date(r.created_at).toISOString(),
    }));
  }

  public async createContact(input: {
    customer_name: string;
    phone: string;
    company_agency?: string;
    event_date?: string;
    interested_categories: string[];
    stage_requirements?: string;
  }): Promise<CustomerInboxItem> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const nextId =
        store.contacts.length > 0
          ? Math.max(...store.contacts.map((c) => c.contact_id)) + 1
          : 1;
      const referenceCode = `SS-BG-${String(nextId).padStart(4, '0')}`;
      const item: CustomerInboxItem = {
        contact_id: nextId,
        reference_code: referenceCode,
        customer_name: input.customer_name,
        phone: input.phone,
        company_agency: input.company_agency?.trim() || 'Khách hàng trực tiếp',
        event_date: input.event_date?.trim() || 'Chưa ấn định',
        interested_categories: input.interested_categories,
        stage_requirements:
          input.stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
        status: 'pending',
        admin_note: '',
        created_at: new Date().toISOString(),
      };
      store.contacts.unshift(item);
      this.writeJsonStore(store);
      return item;
    }

    const pool = await this.ensureMysql();
    const validDate =
      input.event_date && /^\d{4}-\d{2}-\d{2}$/.test(input.event_date.trim())
        ? input.event_date.trim()
        : null;

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO contacts (
        customer_name, phone, company_agency, event_date,
        interested_categories, stage_requirements, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        input.customer_name,
        input.phone,
        input.company_agency?.trim() || 'Khách hàng trực tiếp',
        validDate,
        input.interested_categories.join(', '),
        input.stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
      ]
    );
    const contactId = res.insertId;
    return {
      contact_id: contactId,
      reference_code: `SS-BG-${String(contactId).padStart(4, '0')}`,
      customer_name: input.customer_name,
      phone: input.phone,
      company_agency: input.company_agency?.trim() || 'Khách hàng trực tiếp',
      event_date: validDate || 'Chưa ấn định',
      interested_categories: input.interested_categories,
      stage_requirements:
        input.stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
      status: 'pending',
      admin_note: '',
      created_at: new Date().toISOString(),
    };
  }

  public async updateInbox(
    contactId: number,
    patch: { status?: 'pending' | 'contacted' | 'quoted'; admin_note?: string }
  ): Promise<CustomerInboxItem | null> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const target = store.contacts.find((c) => c.contact_id === contactId);
      if (!target) return null;
      if (patch.status) target.status = patch.status;
      if (typeof patch.admin_note === 'string') target.admin_note = patch.admin_note;
      this.writeJsonStore(store);
      return target;
    }

    const pool = await this.ensureMysql();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM contacts WHERE contact_id = ? LIMIT 1',
      [contactId]
    );
    if (!rows[0]) return null;
    const nextStatus = patch.status || rows[0].status;
    await pool.query('UPDATE contacts SET status = ? WHERE contact_id = ?', [
      nextStatus,
      contactId,
    ]);
    const updatedList = await this.getInbox();
    return updatedList.find((c) => c.contact_id === contactId) || null;
  }

  public async deleteInbox(contactId: number): Promise<boolean> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const before = store.contacts.length;
      store.contacts = store.contacts.filter((c) => c.contact_id !== contactId);
      if (store.contacts.length === before) return false;
      this.writeJsonStore(store);
      return true;
    }
    const pool = await this.ensureMysql();
    const [res] = await pool.query<ResultSetHeader>(
      'DELETE FROM contacts WHERE contact_id = ?',
      [contactId]
    );
    return res.affectedRows > 0;
  }
}

export const dbStore = new SquareSnakeStore();
