/**
 * Script khởi tạo và nạp dữ liệu mẫu (Seed Data) cho SquareSnake FX Việt Nam
 * Tương thích MySQL 8.0+ / MariaDB (XAMPP) với 4 bảng: categories, products, projects, contacts
 * Chạy lệnh: node seed.js  (hoặc npm run seed)
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'squaresnake_fx',
  charset: 'utf8mb4',
};

const CATEGORIES = [
  [
    1,
    'LED Matrix',
    'led-matrix',
    'Hệ thống ma trận điểm ảnh LED lập trình 3D (20-pixel, 60-pixel), ghép nối modular không viền cho concert và lễ hội.',
  ],
  [
    2,
    'Laser',
    'laser',
    'Hệ thống trình diễn Laser công suất thực 20W–60W Pure Diode RGB chuẩn IP65 điều khiển qua mạng Pangolin FB4.',
  ],
  [
    3,
    'Kinetic',
    'kinetic',
    'Hệ thống cơ khí nâng hạ nghệ thuật đồng bộ DMX512 / Art-Net / Madrix gồm 5 dòng: Balls, Rings, Lanterns, Milk-drop và Metal spheres.',
  ],
];

const PRODUCTS = [
  {
    category_id: 1,
    product_name: '20-pixel LED Matrix',
    model_code: 'SS-LM20',
    short_description:
      'Ma trận điểm ảnh LED 20-pixel trang bị chip COB công suất cao ánh sáng ấm tungsten và viền RGB halo, tạo hiệu ứng chasing sắc nét.',
    technical_specs: {
      variant: '20-pixel',
      dimensions: '580 × 460 × 140 mm',
      cable_travel_or_power: '20 × 30W COB Warm White + RGB Halo (640W)',
      speed: 'Tần số làm tươi 18.000 Hz · Pixel chase 60fps',
      control_protocol: 'DMX512 / Art-Net / sACN / Madrix',
      voltage: 'AC 100–240V, 50/60Hz (PowerCON True1)',
      weight: '11.5 kg / module',
    },
    image_url: '/assets/squaresnake/led-matrix.jpg',
    video_demo_url: '',
    is_featured: true,
    status: 'available',
  },
  {
    category_id: 1,
    product_name: '60-pixel LED Matrix',
    model_code: 'SS-LM60',
    short_description:
      'Ma trận LED 60-pixel mật độ điểm ảnh cao, ghép nối modular thành bức tường ánh sáng 3D cho đại nhạc hội và truyền hình trực tiếp.',
    technical_specs: {
      variant: '60-pixel',
      dimensions: '1000 × 600 × 150 mm',
      cable_travel_or_power: '60 × 20W RGBW Pixel + Tungsten Effect (1.200W)',
      speed: 'Tần số làm tươi 18.000 Hz · Pixel mapping 3D',
      control_protocol: 'Art-Net / sACN / DMX512 / Kling-Net',
      voltage: 'AC 100–240V, 50/60Hz',
      weight: '18.2 kg / module',
    },
    image_url: '/assets/squaresnake/led-matrix.jpg',
    video_demo_url: '',
    is_featured: true,
    status: 'available',
  },
  {
    category_id: 2,
    product_name: '20W Laser',
    model_code: 'SS-LS20',
    short_description:
      'Máy trình diễn Laser Full-Color 20W cho sân khấu trong nhà, club và sự kiện hội nghị cần độ sắc nét tia cao.',
    technical_specs: {
      variant: '20W Pure Diode RGB',
      dimensions: '380 × 280 × 210 mm',
      cable_travel_or_power: '20.000 mW Pure Diode (R:5W / G:6W / B:9W)',
      speed: 'Quét tia Galvo 40Kpps @ 8° (Góc mở 60°)',
      control_protocol: 'Pangolin FB4 / LAN / Art-Net / DMX512',
      voltage: 'AC 100–240V, 600W',
      weight: '18.0 kg · Chuẩn IP54',
    },
    image_url: '/assets/squaresnake/laser.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
  {
    category_id: 2,
    product_name: '30W Laser',
    model_code: 'SS-LS30',
    short_description:
      'Hệ thống trình diễn Laser công suất thực 30W Pure Diode RGB chống bụi nước IP65 ngoài trời, tích hợp Pangolin FB4.',
    technical_specs: {
      variant: '30W IP65 Outdoor',
      dimensions: '485 × 340 × 260 mm',
      cable_travel_or_power: '30.000 mW Pure Diode (R:8W / G:10W / B:12W)',
      speed: 'Quét tia Galvo 45Kpps @ 8°',
      control_protocol: 'Pangolin FB4 (LAN / Art-Net / DMX)',
      voltage: 'AC 100–240V, 950W',
      weight: '28.5 kg · Chuẩn IP65',
    },
    image_url: '/assets/squaresnake/laser.jpg',
    video_demo_url: '',
    is_featured: true,
    status: 'available',
  },
  {
    category_id: 2,
    product_name: '40W Laser',
    model_code: 'SS-LS40',
    short_description:
      'Hệ thống Laser công suất lớn 40W tạo quạt tia và hiệu ứng không trung tầm xa cho lễ hội âm nhạc ngoài trời.',
    technical_specs: {
      variant: '40W High-Power',
      dimensions: '520 × 360 × 275 mm',
      cable_travel_or_power: '40.000 mW Pure Diode RGB',
      speed: 'Quét tia Galvo 45Kpps @ 8° · E-Stop Safety',
      control_protocol: 'Pangolin FB4 / Timecode / DMX512',
      voltage: 'AC 100–240V, 1.250W',
      weight: '32.0 kg · Chuẩn IP65',
    },
    image_url: '/assets/squaresnake/laser.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
  {
    category_id: 2,
    product_name: '60W Laser',
    model_code: 'SS-LS60',
    short_description:
      'Hệ thống Laser công suất cực đại 60W cho sân vận động và quảng trường quy mô hàng chục nghìn khán giả.',
    technical_specs: {
      variant: '60W Stadium Grade',
      dimensions: '610 × 410 × 310 mm',
      cable_travel_or_power: '60.000 mW Pure Diode RGB',
      speed: 'Quét tia Galvo 45Kpps · Chiếu xa > 1.500m',
      control_protocol: 'Pangolin FB4 / Optical Fiber / Art-Net',
      voltage: 'AC 100–240V, 1.850W',
      weight: '42.0 kg · Chuẩn IP65',
    },
    image_url: '/assets/squaresnake/laser.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
  {
    category_id: 3,
    product_name: 'Kinetic Balls',
    model_code: 'SS-KN-BALL',
    short_description:
      'Quả cầu LED khuếch tán 360 độ kết hợp tời kéo servo siêu êm 6m–12m, tạo sóng chuyển động không gian đồng bộ âm nhạc.',
    technical_specs: {
      variant: 'Balls (250mm / 350mm)',
      dimensions: 'Đường kính bóng 250 mm · Cụm tời 320×210×280 mm',
      cable_travel_or_power: 'Hành trình cáp 6m – 12m · LED 18W RGBW',
      speed: '0.1 – 1.2 m/s (Độ ồn < 36dB)',
      control_protocol: 'Art-Net / DMX512 / Madrix 3D',
      voltage: 'AC 100–240V, 50/60Hz (110W)',
      weight: '7.8 kg / bộ',
    },
    image_url: '/assets/squaresnake/kinetic-balls.jpg',
    video_demo_url: '',
    is_featured: true,
    status: 'available',
  },
  {
    category_id: 3,
    product_name: 'Kinetic Rings',
    model_code: 'SS-KN-RING',
    short_description:
      'Vòng ánh sáng pixel đường kính 1.2m trang bị 3 motor servo độc lập, cho phép vừa nâng hạ vừa xoay nghiêng đa trục 360 độ.',
    technical_specs: {
      variant: 'Rings (Double Axis 1.2m)',
      dimensions: 'Đường kính 1.200 mm · Nhôm 6061',
      cable_travel_or_power: 'Hành trình 9.0 m · 120W RGB Pixel hai mặt',
      speed: '0.8 m/s · Nghiêng góc 0° – 360°',
      control_protocol: 'Art-Net / Madrix / GrandMA3 Timecode',
      voltage: 'AC 100–240V (360W / bộ 3 winch)',
      weight: '24.0 kg / bộ hoàn chỉnh',
    },
    image_url: '/assets/squaresnake/kinetic-rings.jpg',
    video_demo_url: '',
    is_featured: true,
    status: 'available',
  },
  {
    category_id: 3,
    product_name: 'Kinetic Lanterns',
    model_code: 'SS-KN-LANT',
    short_description:
      'Hệ thống đèn lồng Kinetic nghệ thuật treo trần mang âm hưởng kiến trúc ánh sáng đương đại cho lễ hội và sự kiện văn hóa.',
    technical_specs: {
      variant: 'Lanterns',
      dimensions: '380 × 380 × 460 mm · Tời 320×210×280 mm',
      cable_travel_or_power: 'Hành trình cáp 8.0 m · LED 24W RGBW',
      speed: '0.1 – 0.9 m/s · Phanh từ kép an toàn',
      control_protocol: 'DMX512 / Art-Net / Madrix',
      voltage: 'AC 100–240V, 120W',
      weight: '8.6 kg / bộ',
    },
    image_url: '/assets/squaresnake/kinetic-lanterns.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
  {
    category_id: 3,
    product_name: 'Kinetic Milk-drop',
    model_code: 'SS-KN-DROP',
    short_description:
      'Đầu đèn giọt sương hữu cơ ánh sáng ấm/RGB tạo chuyển động mềm mại theo giai điệu cho triển lãm nghệ thuật và gala.',
    technical_specs: {
      variant: 'Milk-drop',
      dimensions: '180 × 180 × 340 mm · Tời đôi chuẩn DMX',
      cable_travel_or_power: 'Hành trình cáp 6m – 10m · LED 16W RGBW',
      speed: '0.1 – 1.0 m/s · Chống xoắn cáp',
      control_protocol: 'Art-Net / DMX512 / Timecode',
      voltage: 'AC 100–240V, 95W',
      weight: '6.9 kg / bộ',
    },
    image_url: '/assets/squaresnake/kinetic-milk-drop.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
  {
    category_id: 3,
    product_name: 'Kinetic Metal spheres',
    model_code: 'SS-KN-METL',
    short_description:
      'Quả cầu kim loại gương phản chiếu ánh sáng Moving Head & Laser tạo không gian kiến trúc sang trọng cho showroom và concert.',
    technical_specs: {
      variant: 'Metal spheres (Mirror)',
      dimensions: 'Đường kính cầu 220mm / 300mm',
      cable_travel_or_power: 'Hành trình cáp 8m – 12m · Cáp thép chịu tải',
      speed: '0.1 – 1.1 m/s · Servo tốc độ biến thiên',
      control_protocol: 'Art-Net / DMX512 / GrandMA3',
      voltage: 'AC 100–240V, 85W',
      weight: '8.2 kg / bộ',
    },
    image_url: '/assets/squaresnake/kinetic-metal-spheres.jpg',
    video_demo_url: '',
    is_featured: false,
    status: 'available',
  },
];

const PROJECTS = [
  [
    'Đại Nhạc Hội Sóng Đêm 2026',
    'Zeit Media & Live Nation VN',
    'Sân vận động Mỹ Đình, Hà Nội',
    '2026-10-18',
    'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3',
    'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính cho 35.000 khán giả.',
    '/assets/squaresnake/laser.jpg',
  ],
  [
    'Triển Lãm Ô Tô Tương Lai SECC',
    'VinMotion Auto Group',
    'SECC Quận 7, TP. Hồ Chí Minh',
    '2026-09-12',
    'Kinetic Rings · Kinetic Metal spheres · 20-pixel LED Matrix',
    'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ mỗi ngày.',
    '/assets/squaresnake/kinetic-rings.jpg',
  ],
  [
    'Countdown Gala Phố Đi Bộ Nguyễn Huệ',
    'Sở Văn Hóa & Nghệ Thuật TP.HCM',
    'Quận 1, TP. Hồ Chí Minh',
    '2026-08-29',
    '60-pixel LED Matrix · Laser 30W · Kinetic Balls',
    'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình trực tiếp.',
    '/assets/squaresnake/led-matrix.jpg',
  ],
];

const CONTACTS = [
  [
    'Trần Hoàng Nam',
    '0912345678',
    'nam.tran@apexevent.vn',
    'Apex Event Production',
    '2026-12-24',
    'Kinetic Balls, 30W Laser',
    'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Balls và 4 máy Laser 30W.',
    'quoted',
  ],
  [
    'Lê Thảo Vy',
    '0987654321',
    'vy.le@skylightagency.vn',
    'Skylight Creative Agency',
    '2026-12-31',
    'Kinetic Rings, 60-pixel LED Matrix',
    'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Rings và 24 panel 60-pixel LED Matrix.',
    'pending',
  ],
];

async function ensureSchema(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS categories (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(120) NOT NULL,
      slug VARCHAR(120) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
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
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
      INDEX idx_products_category (category_id),
      INDEX idx_products_featured (is_featured)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      project_id INT AUTO_INCREMENT PRIMARY KEY,
      event_name VARCHAR(200) NOT NULL,
      client_name VARCHAR(160) NOT NULL,
      location VARCHAR(180) NOT NULL,
      event_date DATE NOT NULL,
      equipment_used VARCHAR(255) NOT NULL,
      summary TEXT,
      thumbnail_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_projects_date (event_date DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_contacts_status (status),
      INDEX idx_contacts_created (created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function seedDatabase() {
  const safeDbName = DB_CONFIG.database.replace(/`/g, '');
  const bootstrapConn = await mysql.createConnection({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    charset: 'utf8mb4',
  });

  await bootstrapConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${safeDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrapConn.end();

  const pool = mysql.createPool(DB_CONFIG);
  const connection = await pool.getConnection();

  try {
    console.log(`[Seed] Đang kết nối MySQL (${DB_CONFIG.host}:${DB_CONFIG.port}/${safeDbName})...`);
    await ensureSchema(connection);
    await connection.beginTransaction();

    // 1. Nạp bảng categories
    for (const cat of CATEGORIES) {
      await connection.query(
        `INSERT INTO categories (category_id, category_name, slug, description)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           category_name = VALUES(category_name),
           slug = VALUES(slug),
           description = VALUES(description)`,
        cat
      );
    }

    // 2. Nạp bảng products (11 models LED Matrix, Laser, Kinetic)
    for (const p of PRODUCTS) {
      await connection.query(
        `INSERT INTO products (
          category_id, product_name, model_code, short_description,
          technical_specs, image_url, video_demo_url, is_featured, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          category_id = VALUES(category_id),
          product_name = VALUES(product_name),
          short_description = VALUES(short_description),
          technical_specs = VALUES(technical_specs),
          image_url = VALUES(image_url),
          video_demo_url = VALUES(video_demo_url),
          is_featured = VALUES(is_featured),
          status = VALUES(status)`,
        [
          p.category_id,
          p.product_name,
          p.model_code,
          p.short_description,
          JSON.stringify(p.technical_specs),
          p.image_url,
          p.video_demo_url,
          p.is_featured,
          p.status,
        ]
      );
    }

    // 3. Nạp bảng projects nếu đang trống
    const [projCountRows] = await connection.query('SELECT COUNT(*) AS count FROM projects');
    if (projCountRows[0].count === 0) {
      for (const proj of PROJECTS) {
        await connection.query(
          `INSERT INTO projects (event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          proj
        );
      }
    }

    // 4. Nạp bảng contacts nếu đang trống
    const [contactCountRows] = await connection.query('SELECT COUNT(*) AS count FROM contacts');
    if (contactCountRows[0].count === 0) {
      for (const c of CONTACTS) {
        await connection.query(
          `INSERT INTO contacts (customer_name, phone, email, company_agency, event_date, interested_categories, stage_requirements, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          c
        );
      }
    }

    await connection.commit();
    console.log(
      `[Seed] Hoàn tất nạp dữ liệu mẫu SquareSnake FX (${CATEGORIES.length} danh mục, ${PRODUCTS.length} sản phẩm, ${PROJECTS.length} dự án, ${CONTACTS.length} liên hệ mẫu).`
    );
  } catch (err) {
    await connection.rollback();
    console.error('[Seed] Lỗi nạp dữ liệu:', err.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedDatabase();
