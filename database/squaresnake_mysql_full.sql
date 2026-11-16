-- =============================================================================
-- CƠ SỞ DỮ LIỆU MYSQL CHÍNH THỨC: SQUARESNAKE FX VIỆT NAM
-- Tương thích: MySQL 8.0+ / MariaDB 10.4+ (XAMPP, Laragon, MySQL Workbench, phpMyAdmin)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS squaresnake_fx
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE squaresnake_fx;

-- Xóa bảng cũ theo thứ tự khóa ngoại khi cần import lại từ đầu
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS customer_inbox;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS site_settings;

-- -----------------------------------------------------------------------------
-- 1. Bảng categories: Danh mục nhóm thiết bị hiệu ứng sân khấu
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Bảng products: Chi tiết từng model thiết bị (LED Matrix, Laser, Kinetic)
-- -----------------------------------------------------------------------------
CREATE TABLE products (
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
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_products_category (category_id),
  INDEX idx_products_slug (slug_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Bảng projects: Trường hợp dự án tiêu biểu (Case Studies)
-- -----------------------------------------------------------------------------
CREATE TABLE projects (
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
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_projects_category_slug (category_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Bảng media_assets: Thư viện Ảnh & Video do Admin tải lên hoặc gắn link
-- -----------------------------------------------------------------------------
CREATE TABLE media_assets (
  media_id INT AUTO_INCREMENT PRIMARY KEY,
  slug_id VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  url VARCHAR(500) NOT NULL,
  category VARCHAR(120) NOT NULL DEFAULT 'Thư viện media',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_type (media_type),
  INDEX idx_media_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Bảng site_settings: Cấu hình nội dung Trang chủ, Giới thiệu & Footer
-- -----------------------------------------------------------------------------
CREATE TABLE site_settings (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Bảng customer_inbox: Hộp thư yêu cầu báo giá từ khách hàng
-- -----------------------------------------------------------------------------
CREATE TABLE customer_inbox (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inbox_status (status),
  INDEX idx_inbox_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA)
-- =============================================================================

INSERT INTO categories (category_id, slug, name, kicker, hero_line1, hero_line2, hero_description, hero_image_url) VALUES
(1, 'led-matrix', 'LED Matrix', '01 / LED MATRIX', 'Every pixel.', 'Every possibility.', 'Shape your show with expressive pixel effects.\nExplore 20-pixel and 60-pixel LED Matrix variants.', '/assets/squaresnake/led-matrix.jpg'),
(2, 'laser', 'Laser', '02 / LASER', 'Precision light.', 'Powerful impact.', 'Explore laser systems in four power options.\nFind a starting point for your next production.', '/assets/squaresnake/laser.jpg'),
(3, 'kinetic', 'Kinetic', '03 / KINETIC', 'Sculpt the air.', 'Move the room.', 'Suspended forms. Choreographed movement.\nExplore five shapes for your kinetic installation.', '/assets/squaresnake/kinetic-balls.jpg');

INSERT INTO site_settings (
  setting_id, company_name, hero_kicker, hero_title_line1, hero_title_line2,
  hero_description, hero_image_url, hero_video_url,
  about_kicker, about_title_line1, about_title_line2, about_description, about_image_url,
  footer_description, phone, zalo, email, address
) VALUES (
  1,
  'CÔNG TY TNHH SQUARESNAKE FX VIỆT NAM',
  'LIGHT. MOTION. IMPACT.',
  'Built for the',
  'unforgettable.',
  'LED Matrix, laser and kinetic systems.\nExtraordinary possibilities for your next show.',
  '/assets/squaresnake/hero-concert.jpg',
  '',
  'VỀ SQUARESNAKE FX VIỆT NAM',
  'Kỹ thuật chính xác.',
  'Hiệu ứng đỉnh cao.',
  'Công ty TNHH SquareSnake FX Việt Nam chuyên cung cấp, cho thuê và trực tiếp lập trình vận hành các hệ thống LED Matrix, Laser công suất lớn và cơ khí Kinetic cho concert, triển lãm và sự kiện quy mô lớn tại Hà Nội, TP.HCM và toàn quốc.',
  '/assets/squaresnake/hero-concert.jpg',
  'Sự cam kết không ngừng nghỉ của chúng tôi trong việc thúc đẩy công nghệ ánh sáng sân khấu Kinetic, Laser và LED Matrix đã mang lại danh tiếng vững chắc trong ngành tổ chức sự kiện.',
  '+84 909 886 247',
  '+84 909 886 247',
  'baogia@squaresnake.vn',
  'Lô B4-12 Khu công nghiệp Thạch Bàn, Quận Long Biên, Hà Nội & 88 Nguyễn Văn Linh, Quận 7, TP.HCM.'
);

INSERT INTO products (
  slug_id, category_id, kicker, short_label, title_line1, title_line2, full_name,
  card_tag, hero_summary, image_url, video_url, gallery_images, specs, specs_footnote,
  applications_lead, applications_body, applications_footnote
) VALUES
(
  'led-matrix-20-pixel', 1, 'LED MATRIX / 20-PIXEL', '20-pixel', '20-pixel', 'LED Matrix', '20-pixel LED Matrix',
  'Discover the 20-pixel format for your next design.',
  'Build your pixel lighting concept around the 20-pixel LED Matrix variant.',
  '/assets/squaresnake/led-matrix.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Variant', 'value', '20-pixel'),
    JSON_OBJECT('label', 'Dimensions / weight', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Power requirements', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Only the variant is supplied. All other technical details need verification before publication.',
  'Pixel chases. Wave forms. Graphic textures.',
  'Explore how pixel-based lighting could shape a stage, installation or live performance.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'led-matrix-60-pixel', 1, 'LED MATRIX / 60-PIXEL', '60-pixel', '60-pixel', 'LED Matrix', '60-pixel LED Matrix',
  'Explore the 60-pixel format and creative possibilities.',
  'Build your pixel lighting concept around the 60-pixel LED Matrix variant.',
  '/assets/squaresnake/led-matrix.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Variant', 'value', '60-pixel'),
    JSON_OBJECT('label', 'Dimensions / weight', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Power requirements', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Only the variant is supplied. All other technical details need verification before publication.',
  'Pixel chases. Wave forms. Graphic textures.',
  'Explore how pixel-based lighting could shape a stage, installation or live performance.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'laser-20w', 2, 'LASER / 20W', '20W', '20W', 'Laser', '20W Laser',
  'Laser system / 20W',
  'Explore the 20W laser option for your next production. Ask for a verified system datasheet.',
  '/assets/squaresnake/laser.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Power option', 'value', '20W'),
    JSON_OBJECT('label', 'Wavelengths / colour', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Power options are supplied; output ratings and full specifications require manufacturer verification.',
  'Beam fans. Aerial patterns. Show moments.',
  'Imagine the visual possibilities for a live show or installation. Final selection requires venue planning and a professional laser safety assessment.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'laser-30w', 2, 'LASER / 30W', '30W', '30W', 'Laser', '30W Laser',
  'Laser system / 30W',
  'Explore the 30W laser option for your next production. Ask for a verified system datasheet.',
  '/assets/squaresnake/laser.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Power option', 'value', '30W'),
    JSON_OBJECT('label', 'Wavelengths / colour', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Power options are supplied; output ratings and full specifications require manufacturer verification.',
  'Beam fans. Aerial patterns. Show moments.',
  'Imagine the visual possibilities for a live show or installation. Final selection requires venue planning and a professional laser safety assessment.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'laser-40w', 2, 'LASER / 40W', '40W', '40W', 'Laser', '40W Laser',
  'Laser system / 40W',
  'Explore the 40W laser option for your next production. Ask for a verified system datasheet.',
  '/assets/squaresnake/laser.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Power option', 'value', '40W'),
    JSON_OBJECT('label', 'Wavelengths / colour', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Power options are supplied; output ratings and full specifications require manufacturer verification.',
  'Beam fans. Aerial patterns. Show moments.',
  'Imagine the visual possibilities for a live show or installation. Final selection requires venue planning and a professional laser safety assessment.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'laser-60w', 2, 'LASER / 60W', '60W', '60W', 'Laser', '60W Laser',
  'Laser system / 60W',
  'Explore the 60W laser option for your next production. Ask for a verified system datasheet.',
  '/assets/squaresnake/laser.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Power option', 'value', '60W'),
    JSON_OBJECT('label', 'Wavelengths / colour', 'value', 'To be confirmed'),
    JSON_OBJECT('label', 'Control protocol', 'value', 'To be confirmed')
  ),
  'Power options are supplied; output ratings and full specifications require manufacturer verification.',
  'Beam fans. Aerial patterns. Show moments.',
  'Imagine the visual possibilities for a live show or installation. Final selection requires venue planning and a professional laser safety assessment.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'kinetic-balls', 3, 'KINETIC / BALLS', 'Balls', 'Kinetic', 'Balls', 'Kinetic Balls',
  'Kinetic / Balls',
  'Explore balls as part of a suspended kinetic installation designed around your space.',
  '/assets/squaresnake/kinetic-balls.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Form', 'value', 'Balls'),
    JSON_OBJECT('label', 'Motion / control', 'value', 'To be confirmed')
  ),
  'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
  'Sculptural forms. Choreographed movement.',
  'Imagine a moving installation built around balls. Discuss layout, suspension and the visual rhythm of your space.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'kinetic-rings', 3, 'KINETIC / RINGS', 'Rings', 'Kinetic', 'Rings', 'Kinetic Rings',
  'Kinetic / Rings',
  'Explore rings as part of a suspended kinetic installation designed around your space.',
  '/assets/squaresnake/kinetic-rings.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Form', 'value', 'Rings'),
    JSON_OBJECT('label', 'Motion / control', 'value', 'To be confirmed')
  ),
  'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
  'Sculptural forms. Choreographed movement.',
  'Imagine a moving installation built around rings. Discuss layout, suspension and the visual rhythm of your space.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'kinetic-lanterns', 3, 'KINETIC / LANTERNS', 'Lanterns', 'Kinetic', 'Lanterns', 'Kinetic Lanterns',
  'Kinetic / Lanterns',
  'Explore lanterns as part of a suspended kinetic installation designed around your space.',
  '/assets/squaresnake/kinetic-lanterns.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Form', 'value', 'Lanterns'),
    JSON_OBJECT('label', 'Motion / control', 'value', 'To be confirmed')
  ),
  'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
  'Sculptural forms. Choreographed movement.',
  'Imagine a moving installation built around lanterns. Discuss layout, suspension and the visual rhythm of your space.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'kinetic-milk-drop', 3, 'KINETIC / MILK-DROP', 'Milk-drop', 'Kinetic', 'Milk-drop', 'Kinetic Milk-drop',
  'Kinetic / Milk-drop',
  'Explore milk-drop as part of a suspended kinetic installation designed around your space.',
  '/assets/squaresnake/kinetic-milk-drop.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Form', 'value', 'Milk-drop'),
    JSON_OBJECT('label', 'Motion / control', 'value', 'To be confirmed')
  ),
  'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
  'Sculptural forms. Choreographed movement.',
  'Imagine a moving installation built around milk-drop. Discuss layout, suspension and the visual rhythm of your space.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
),
(
  'kinetic-metal-spheres', 3, 'KINETIC / METAL SPHERES', 'Metal spheres', 'Kinetic', 'Metal spheres', 'Kinetic Metal spheres',
  'Kinetic / Metal spheres',
  'Explore metal spheres as part of a suspended kinetic installation designed around your space.',
  '/assets/squaresnake/kinetic-metal-spheres.jpg', '', JSON_ARRAY(),
  JSON_ARRAY(
    JSON_OBJECT('label', 'Form', 'value', 'Metal spheres'),
    JSON_OBJECT('label', 'Motion / control', 'value', 'To be confirmed')
  ),
  'Shapes are supplied. Dimensions, motion, load ratings and safety details need manufacturer verification.',
  'Sculptural forms. Choreographed movement.',
  'Imagine a moving installation built around metal spheres. Discuss layout, suspension and the visual rhythm of your space.',
  'Illustrative concept. Verified show references and model-specific media to be supplied.'
);

INSERT INTO projects (slug_id, num_label, title, detail, summary, image_url, video_url, category_slug) VALUES
('case-song-dem', '01 / MUSIC FESTIVAL', 'Đại Nhạc Hội Sóng Đêm — SVĐ Mỹ Đình', 'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3', 'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính cho 35.000 khán giả.', '/assets/squaresnake/laser.jpg', '', 'laser'),
('case-secc-auto', '02 / AUTO EXHIBITION', 'Triển Lãm Ô Tô Tương Lai — SECC Quận 7', 'Kinetic Rings · Kinetic Metal spheres', 'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ/ngày.', '/assets/squaresnake/kinetic-rings.jpg', '', 'kinetic'),
('case-countdown-hcm', '03 / LIVE STAGE & TV', 'Countdown Gala — Phố Đi Bộ Nguyễn Huệ', '60-pixel LED Matrix · Laser 30W', 'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình trực tiếp.', '/assets/squaresnake/led-matrix.jpg', '', 'led-matrix');

INSERT INTO media_assets (slug_id, title, media_type, url, category) VALUES
('media-hero-concert', 'Concert Stage Concept', 'image', '/assets/squaresnake/hero-concert.jpg', 'Sân khấu chính'),
('media-led-matrix', 'LED Matrix Wave Array', 'image', '/assets/squaresnake/led-matrix.jpg', 'LED Matrix'),
('media-laser-beams', 'Laser Fan Array', 'image', '/assets/squaresnake/laser.jpg', 'Laser'),
('media-kinetic-balls', 'Kinetic Balls Array', 'image', '/assets/squaresnake/kinetic-balls.jpg', 'Kinetic'),
('media-kinetic-rings', 'Kinetic Double Axis Rings', 'image', '/assets/squaresnake/kinetic-rings.jpg', 'Kinetic');

INSERT INTO customer_inbox (reference_code, customer_name, phone, company_agency, event_date, interested_categories, stage_requirements, status, admin_note) VALUES
('SS-BG-1001', 'Trần Hoàng Nam', 'nam.tran@apexevent.vn · 0912345678', 'Apex Event Production', '2026-12-24', JSON_ARRAY('Kinetic Balls', '30W Laser'), 'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Balls và 4 máy Laser 30W.', 'quoted', 'Đã gửi báo giá sơ bộ qua email ngày 12/11.'),
('SS-BG-1002', 'Lê Thảo Vy', 'vy.le@skylight.vn · 0987654321', 'Skylight Creative Agency', '2026-12-31', JSON_ARRAY('Kinetic Rings', '60-pixel LED Matrix'), 'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Rings và 24 panel 60-pixel LED Matrix.', 'pending', '');
