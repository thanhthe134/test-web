import fs from 'fs';
import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import path from 'path';
import {
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

    // 1. Ensure database exists
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

    // 2. Create connection pool
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

    // 3. Ensure all 6 normalized tables exist
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(64) NOT NULL UNIQUE,
        name VARCHAR(120) NOT NULL,
        kicker VARCHAR(120) NOT NULL,
        hero_line1 VARCHAR(160) NOT NULL,
        hero_line2 VARCHAR(160) NOT NULL,
        hero_description TEXT,
        hero_image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        slug_id VARCHAR(120) NOT NULL UNIQUE,
        category_id INT NOT NULL,
        kicker VARCHAR(120) NOT NULL,
        short_label VARCHAR(100) NOT NULL,
        title_line1 VARCHAR(160) NOT NULL,
        title_line2 VARCHAR(160) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        card_tag VARCHAR(255) NOT NULL,
        hero_summary TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        video_url VARCHAR(255) DEFAULT '',
        gallery_images JSON NOT NULL,
        specs JSON NOT NULL,
        specs_footnote TEXT,
        applications_lead VARCHAR(255),
        applications_body TEXT,
        applications_footnote TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_category
          FOREIGN KEY (category_id) REFERENCES categories(category_id)
          ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id INT AUTO_INCREMENT PRIMARY KEY,
        slug_id VARCHAR(120) NOT NULL UNIQUE,
        num_label VARCHAR(80) NOT NULL,
        title VARCHAR(220) NOT NULL,
        detail VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        video_url VARCHAR(255) DEFAULT '',
        category_slug VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_projects_category_slug
          FOREIGN KEY (category_slug) REFERENCES categories(slug)
          ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        media_id INT AUTO_INCREMENT PRIMARY KEY,
        slug_id VARCHAR(120) NOT NULL UNIQUE,
        title VARCHAR(200) NOT NULL,
        media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
        url VARCHAR(500) NOT NULL,
        category VARCHAR(120) NOT NULL DEFAULT 'Thư viện media',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_id INT PRIMARY KEY,
        company_name VARCHAR(200) NOT NULL,
        hero_kicker VARCHAR(160) NOT NULL,
        hero_title_line1 VARCHAR(160) NOT NULL,
        hero_title_line2 VARCHAR(160) NOT NULL,
        hero_description TEXT NOT NULL,
        hero_image_url VARCHAR(500) NOT NULL,
        hero_video_url VARCHAR(500) DEFAULT '',
        about_kicker VARCHAR(160) NOT NULL,
        about_title_line1 VARCHAR(160) NOT NULL,
        about_title_line2 VARCHAR(160) NOT NULL,
        about_description TEXT NOT NULL,
        about_image_url VARCHAR(500) NOT NULL,
        footer_description TEXT NOT NULL,
        phone VARCHAR(60) NOT NULL,
        zalo VARCHAR(60) NOT NULL,
        email VARCHAR(160) NOT NULL,
        address TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS customer_inbox (
        contact_id INT AUTO_INCREMENT PRIMARY KEY,
        reference_code VARCHAR(40) NOT NULL UNIQUE,
        customer_name VARCHAR(150) NOT NULL,
        phone VARCHAR(160) NOT NULL,
        company_agency VARCHAR(180) NOT NULL,
        event_date VARCHAR(40) NOT NULL,
        interested_categories JSON NOT NULL,
        stage_requirements TEXT NOT NULL,
        status ENUM('pending', 'contacted', 'quoted') NOT NULL DEFAULT 'pending',
        admin_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 4. Seed initial data only if empty
    const [catRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM categories'
    );
    if (Number(catRows[0]?.cnt || 0) === 0) {
      await this.pool.query(
        `INSERT INTO categories (category_id, slug, name, kicker, hero_line1, hero_line2, hero_description, hero_image_url) VALUES
         (1, 'led-matrix', 'LED Matrix', '01 / LED MATRIX', 'Every pixel.', 'Every possibility.', 'Shape your show with expressive pixel effects.\nExplore 20-pixel and 60-pixel LED Matrix variants.', '/assets/squaresnake/led-matrix.jpg'),
         (2, 'laser', 'Laser', '02 / LASER', 'Precision light.', 'Powerful impact.', 'Explore laser systems in four power options.\nFind a starting point for your next production.', '/assets/squaresnake/laser.jpg'),
         (3, 'kinetic', 'Kinetic', '03 / KINETIC', 'Sculpt the air.', 'Move the room.', 'Suspended forms. Choreographed movement.\nExplore five shapes for your kinetic installation.', '/assets/squaresnake/kinetic-balls.jpg')`
      );
    }

    const [settingsRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM site_settings'
    );
    if (Number(settingsRows[0]?.cnt || 0) === 0) {
      const s = DEFAULT_SITE_SETTINGS;
      await this.pool.query(
        `INSERT INTO site_settings (
          setting_id, company_name, hero_kicker, hero_title_line1, hero_title_line2,
          hero_description, hero_image_url, hero_video_url,
          about_kicker, about_title_line1, about_title_line2, about_description, about_image_url,
          footer_description, phone, zalo, email, address
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.companyName,
          s.heroKicker,
          s.heroTitleLine1,
          s.heroTitleLine2,
          s.heroDescription,
          s.heroImageUrl,
          s.heroVideoUrl,
          s.aboutKicker,
          s.aboutTitleLine1,
          s.aboutTitleLine2,
          s.aboutDescription,
          s.aboutImageUrl,
          s.footerDescription,
          s.phone,
          s.zalo,
          s.email,
          s.address,
        ]
      );
    }

    const [prodRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM products'
    );
    if (Number(prodRows[0]?.cnt || 0) === 0) {
      const slugToId: Record<CollectionSlug, number> = {
        'led-matrix': 1,
        laser: 2,
        kinetic: 3,
      };
      for (const m of PRODUCT_MODELS) {
        await this.pool.query(
          `INSERT INTO products (
            slug_id, category_id, kicker, short_label, title_line1, title_line2,
            full_name, card_tag, hero_summary, image_url, video_url, gallery_images,
            specs, specs_footnote, applications_lead, applications_body, applications_footnote
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            m.id,
            slugToId[m.collection],
            m.kicker,
            m.shortLabel,
            m.titleLine1,
            m.titleLine2,
            m.fullName,
            m.cardTag,
            m.heroSummary,
            m.imageUrl,
            m.videoUrl || '',
            JSON.stringify(m.galleryImages || []),
            JSON.stringify(m.specs || []),
            m.specsFootnote,
            m.applicationsLead,
            m.applicationsBody,
            m.applicationsFootnote,
          ]
        );
      }
    }

    const [projRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM projects'
    );
    if (Number(projRows[0]?.cnt || 0) === 0) {
      for (const p of DEFAULT_PROJECTS) {
        await this.pool.query(
          `INSERT INTO projects (slug_id, num_label, title, detail, summary, image_url, video_url, category_slug)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.num, p.title, p.detail, p.summary, p.imageUrl, p.videoUrl || '', p.slug]
        );
      }
    }

    const [mediaRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM media_assets'
    );
    if (Number(mediaRows[0]?.cnt || 0) === 0) {
      for (const item of DEFAULT_MEDIA_LIBRARY) {
        await this.pool.query(
          `INSERT INTO media_assets (slug_id, title, media_type, url, category)
           VALUES (?, ?, ?, ?, ?)`,
          [item.id, item.title, item.type, item.url, item.category]
        );
      }
    }

    const [inboxRows] = await this.pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM customer_inbox'
    );
    if (Number(inboxRows[0]?.cnt || 0) === 0) {
      for (const c of SEED_CONTACTS) {
        await this.pool.query(
          `INSERT INTO customer_inbox (
            reference_code, customer_name, phone, company_agency, event_date,
            interested_categories, stage_requirements, status, admin_note
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.reference_code,
            c.customer_name,
            c.phone,
            c.company_agency,
            c.event_date,
            JSON.stringify(c.interested_categories),
            c.stage_requirements,
            c.status,
            c.admin_note || '',
          ]
        );
      }
    }

    this.initializedMysql = true;
    console.log(
      `[MySQL] Đã kết nối & đồng bộ database '${cfg.database}' tại ${cfg.host}:${cfg.port}`
    );
  }

  // Fallback JSON store helpers when running inside cloud sandbox without MySQL host
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
    if (!this.isMysqlEnabled()) {
      return [
        {
          category_id: 1,
          slug: 'led-matrix',
          name: 'LED Matrix',
          kicker: '01 / LED MATRIX',
          hero_line1: 'Every pixel.',
          hero_line2: 'Every possibility.',
          hero_description: 'LED Matrix 20-pixel & 60-pixel',
          hero_image_url: '/assets/squaresnake/led-matrix.jpg',
        },
        {
          category_id: 2,
          slug: 'laser',
          name: 'Laser',
          kicker: '02 / LASER',
          hero_line1: 'Precision light.',
          hero_line2: 'Powerful impact.',
          hero_description: 'Laser 20W / 30W / 40W / 60W',
          hero_image_url: '/assets/squaresnake/laser.jpg',
        },
        {
          category_id: 3,
          slug: 'kinetic',
          name: 'Kinetic',
          kicker: '03 / KINETIC',
          hero_line1: 'Sculpt the air.',
          hero_line2: 'Move the room.',
          hero_description: 'Kinetic Balls, Rings, Lanterns, Milk-drop, Metal spheres',
          hero_image_url: '/assets/squaresnake/kinetic-balls.jpg',
        },
      ];
    }
    const pool = await this.ensureMysql();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT category_id, slug, name, kicker, hero_line1, hero_line2, hero_description, hero_image_url FROM categories ORDER BY category_id ASC'
    );
    return rows as CategoryRow[];
  }

  public async getPublicCms(): Promise<PublicCmsPayload> {
    if (!this.isMysqlEnabled()) {
      const s = this.readJsonStore();
      return {
        siteSettings: s.siteSettings,
        models: s.catalogModels,
        projects: s.cmsProjects,
        media: s.media,
      };
    }

    const pool = await this.ensureMysql();
    const [settingsRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM site_settings WHERE setting_id = 1 LIMIT 1'
    );
    const sr = settingsRows[0];
    const siteSettings: SiteSettings = sr
      ? {
          companyName: sr.company_name,
          heroKicker: sr.hero_kicker,
          heroTitleLine1: sr.hero_title_line1,
          heroTitleLine2: sr.hero_title_line2,
          heroDescription: sr.hero_description,
          heroImageUrl: sr.hero_image_url,
          heroVideoUrl: sr.hero_video_url || '',
          aboutKicker: sr.about_kicker,
          aboutTitleLine1: sr.about_title_line1,
          aboutTitleLine2: sr.about_title_line2,
          aboutDescription: sr.about_description,
          aboutImageUrl: sr.about_image_url,
          footerDescription: sr.footer_description,
          phone: sr.phone,
          zalo: sr.zalo,
          email: sr.email,
          address: sr.address,
        }
      : DEFAULT_SITE_SETTINGS;

    const [prodRows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.slug AS collection_slug, c.name AS collection_name
       FROM products p
       JOIN categories c ON p.category_id = c.category_id
       ORDER BY p.product_id ASC`
    );
    const models: FigmaProductModel[] = prodRows.map((r) => ({
      id: r.slug_id,
      collection: r.collection_slug as CollectionSlug,
      collectionName: r.collection_name,
      kicker: r.kicker,
      shortLabel: r.short_label,
      titleLine1: r.title_line1,
      titleLine2: r.title_line2,
      fullName: r.full_name,
      cardTag: r.card_tag,
      heroSummary: r.hero_summary,
      imageUrl: r.image_url,
      videoUrl: r.video_url || '',
      galleryImages: parseJsonColumn<string[]>(r.gallery_images, []),
      specs: parseJsonColumn<{ label: string; value: string }[]>(r.specs, []),
      specsFootnote: r.specs_footnote || '',
      applicationsLead: r.applications_lead || '',
      applicationsBody: r.applications_body || '',
      applicationsFootnote: r.applications_footnote || '',
    }));

    const [projRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM projects ORDER BY project_id DESC'
    );
    const projects: CmsProjectCase[] = projRows.map((r) => ({
      id: r.slug_id,
      num: r.num_label,
      title: r.title,
      detail: r.detail,
      summary: r.summary,
      imageUrl: r.image_url,
      videoUrl: r.video_url || '',
      slug: r.category_slug as CollectionSlug,
    }));

    const [mediaRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media_assets ORDER BY media_id DESC'
    );
    const media: CmsMediaItem[] = mediaRows.map((r) => ({
      id: r.slug_id,
      title: r.title,
      type: r.media_type === 'video' ? 'video' : 'image',
      url: r.url,
      category: r.category,
      createdAt: new Date(r.created_at).toISOString(),
    }));

    return { siteSettings, models, projects, media };
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
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      store.siteSettings = { ...store.siteSettings, ...patch };
      this.writeJsonStore(store);
      return store.siteSettings;
    }
    const pool = await this.ensureMysql();
    const current = (await this.getPublicCms()).siteSettings;
    const next = { ...current, ...patch };
    await pool.query(
      `UPDATE site_settings SET
        company_name = ?, hero_kicker = ?, hero_title_line1 = ?, hero_title_line2 = ?,
        hero_description = ?, hero_image_url = ?, hero_video_url = ?,
        about_kicker = ?, about_title_line1 = ?, about_title_line2 = ?,
        about_description = ?, about_image_url = ?, footer_description = ?,
        phone = ?, zalo = ?, email = ?, address = ?
      WHERE setting_id = 1`,
      [
        next.companyName,
        next.heroKicker,
        next.heroTitleLine1,
        next.heroTitleLine2,
        next.heroDescription,
        next.heroImageUrl,
        next.heroVideoUrl,
        next.aboutKicker,
        next.aboutTitleLine1,
        next.aboutTitleLine2,
        next.aboutDescription,
        next.aboutImageUrl,
        next.footerDescription,
        next.phone,
        next.zalo,
        next.email,
        next.address,
      ]
    );
    return next;
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
    await pool.query(
      `INSERT INTO products (
        slug_id, category_id, kicker, short_label, title_line1, title_line2,
        full_name, card_tag, hero_summary, image_url, video_url, gallery_images,
        specs, specs_footnote, applications_lead, applications_body, applications_footnote
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        created.id,
        categoryId,
        created.kicker,
        created.shortLabel,
        created.titleLine1,
        created.titleLine2,
        created.fullName,
        created.cardTag,
        created.heroSummary,
        created.imageUrl,
        created.videoUrl || '',
        JSON.stringify(created.galleryImages || []),
        JSON.stringify(created.specs || []),
        created.specsFootnote,
        created.applicationsLead,
        created.applicationsBody,
        created.applicationsFootnote,
      ]
    );
    return created;
  }

  public async updateModel(
    slugId: string,
    patch: Partial<FigmaProductModel>
  ): Promise<FigmaProductModel | null> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const idx = store.catalogModels.findIndex((m) => m.id === slugId);
      if (idx === -1) return null;
      const collectionLabels: Record<CollectionSlug, string> = {
        'led-matrix': 'LED Matrix',
        laser: 'Laser',
        kinetic: 'Kinetic',
      };
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

    const collectionLabels: Record<CollectionSlug, string> = {
      'led-matrix': 'LED Matrix',
      laser: 'Laser',
      kinetic: 'Kinetic',
    };
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

    await pool.query(
      `UPDATE products SET
        category_id = ?, kicker = ?, short_label = ?, title_line1 = ?, title_line2 = ?,
        full_name = ?, card_tag = ?, hero_summary = ?, image_url = ?, video_url = ?,
        gallery_images = ?, specs = ?, specs_footnote = ?,
        applications_lead = ?, applications_body = ?, applications_footnote = ?
      WHERE slug_id = ?`,
      [
        categoryId,
        next.kicker,
        next.shortLabel,
        next.titleLine1,
        next.titleLine2,
        next.fullName,
        next.cardTag,
        next.heroSummary,
        next.imageUrl,
        next.videoUrl || '',
        JSON.stringify(next.galleryImages || []),
        JSON.stringify(next.specs || []),
        next.specsFootnote,
        next.applicationsLead,
        next.applicationsBody,
        next.applicationsFootnote,
        slugId,
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
    const [res] = await pool.query<ResultSetHeader>(
      'DELETE FROM products WHERE slug_id = ?',
      [slugId]
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
    await pool.query(
      `INSERT INTO projects (slug_id, num_label, title, detail, summary, image_url, video_url, category_slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        created.id,
        created.num,
        created.title,
        created.detail,
        created.summary,
        created.imageUrl,
        created.videoUrl || '',
        created.slug,
      ]
    );
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

    const pool = await this.ensureMysql();
    const existing = (await this.getPublicCms()).projects.find((p) => p.id === slugId);
    if (!existing) return null;
    const next = { ...existing, ...patch, id: slugId };
    await pool.query(
      `UPDATE projects SET
        num_label = ?, title = ?, detail = ?, summary = ?,
        image_url = ?, video_url = ?, category_slug = ?
      WHERE slug_id = ?`,
      [
        next.num,
        next.title,
        next.detail,
        next.summary,
        next.imageUrl,
        next.videoUrl || '',
        next.slug,
        slugId,
      ]
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
    const pool = await this.ensureMysql();
    const [res] = await pool.query<ResultSetHeader>(
      'DELETE FROM projects WHERE slug_id = ?',
      [slugId]
    );
    return res.affectedRows > 0;
  }

  public async addMedia(item: CmsMediaItem): Promise<CmsMediaItem> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      store.media.unshift(item);
      this.writeJsonStore(store);
      return item;
    }
    const pool = await this.ensureMysql();
    await pool.query(
      `INSERT INTO media_assets (slug_id, title, media_type, url, category)
       VALUES (?, ?, ?, ?, ?)`,
      [item.id, item.title, item.type, item.url, item.category]
    );
    return item;
  }

  public async deleteMedia(slugId: string): Promise<CmsMediaItem | null> {
    if (!this.isMysqlEnabled()) {
      const store = this.readJsonStore();
      const target = store.media.find((m) => m.id === slugId) || null;
      if (!target) return null;
      store.media = store.media.filter((m) => m.id !== slugId);
      this.writeJsonStore(store);
      return target;
    }
    const pool = await this.ensureMysql();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media_assets WHERE slug_id = ? LIMIT 1',
      [slugId]
    );
    const r = rows[0];
    if (!r) return null;
    await pool.query('DELETE FROM media_assets WHERE slug_id = ?', [slugId]);
    return {
      id: r.slug_id,
      title: r.title,
      type: r.media_type === 'video' ? 'video' : 'image',
      url: r.url,
      category: r.category,
      createdAt: new Date(r.created_at).toISOString(),
    };
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
      'SELECT * FROM customer_inbox ORDER BY contact_id DESC'
    );
    return rows.map((r) => ({
      contact_id: Number(r.contact_id),
      reference_code: r.reference_code,
      customer_name: r.customer_name,
      phone: r.phone,
      company_agency: r.company_agency,
      event_date: r.event_date,
      interested_categories: parseJsonColumn<string[]>(r.interested_categories, []),
      stage_requirements: r.stage_requirements,
      status: r.status as 'pending' | 'contacted' | 'quoted',
      admin_note: r.admin_note || '',
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
      const referenceCode = `SS-BG-${String(1000 + nextId)}`;
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
    const tempCode = `SS-BG-${Date.now().toString().slice(-6)}`;
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO customer_inbox (
        reference_code, customer_name, phone, company_agency, event_date,
        interested_categories, stage_requirements, status, admin_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', '')`,
      [
        tempCode,
        input.customer_name,
        input.phone,
        input.company_agency?.trim() || 'Khách hàng trực tiếp',
        input.event_date?.trim() || 'Chưa ấn định',
        JSON.stringify(input.interested_categories),
        input.stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
      ]
    );
    const contactId = res.insertId;
    const referenceCode = `SS-BG-${String(1000 + contactId)}`;
    await pool.query(
      'UPDATE customer_inbox SET reference_code = ? WHERE contact_id = ?',
      [referenceCode, contactId]
    );
    return {
      contact_id: contactId,
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
      'SELECT * FROM customer_inbox WHERE contact_id = ? LIMIT 1',
      [contactId]
    );
    if (!rows[0]) return null;
    const nextStatus = patch.status || rows[0].status;
    const nextNote =
      typeof patch.admin_note === 'string'
        ? patch.admin_note
        : rows[0].admin_note || '';
    await pool.query(
      'UPDATE customer_inbox SET status = ?, admin_note = ? WHERE contact_id = ?',
      [nextStatus, nextNote, contactId]
    );
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
      'DELETE FROM customer_inbox WHERE contact_id = ?',
      [contactId]
    );
    return res.affectedRows > 0;
  }
}

export const dbStore = new SquareSnakeStore();
