-- =============================================================================
-- CƠ SỞ DỮ LIỆU: SQUARESNAKE FX VIỆT NAM (STAGE EFFECTS & EVENT EQUIPMENT)
-- Tương thích: MySQL 8.0+ / MariaDB 10.4+ (phpMyAdmin / XAMPP / MySQL Workbench)
-- 4 Bảng dữ liệu chính: categories, products, projects, contacts
-- =============================================================================

CREATE DATABASE IF NOT EXISTS squaresnake_fx
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE squaresnake_fx;

-- Xóa bảng cũ theo đúng thứ tự khóa ngoại khi import lại từ đầu
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS customer_inbox;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Bảng categories: Danh mục nhóm thiết bị hiệu ứng sân khấu
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Bảng products: Chi tiết thiết bị hiệu ứng (LED Matrix, Laser, Kinetic)
-- -----------------------------------------------------------------------------
CREATE TABLE products (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Bảng projects: Hồ sơ dự án sân khấu thực tế (Case Studies)
-- -----------------------------------------------------------------------------
CREATE TABLE projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(200) NOT NULL,
  client_name VARCHAR(160) NOT NULL,
  location VARCHAR(180) NOT NULL,
  event_date DATE NOT NULL,
  equipment_used VARCHAR(255) NOT NULL,
  summary TEXT,
  thumbnail_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_projects_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Bảng contacts: Yêu cầu tư vấn & báo giá từ khách hàng
-- -----------------------------------------------------------------------------
CREATE TABLE contacts (
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
  INDEX idx_contacts_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (INITIAL SAMPLE DATA)
-- =============================================================================

INSERT INTO categories (category_id, category_name, slug, description) VALUES
(1, 'LED Matrix', 'led-matrix', 'Hệ thống ma trận điểm ảnh LED lập trình 3D (20-pixel, 60-pixel), ghép nối modular không viền cho concert và lễ hội.'),
(2, 'Laser', 'laser', 'Hệ thống trình diễn Laser công suất thực 20W–60W Pure Diode RGB chuẩn IP65 điều khiển qua mạng Pangolin FB4.'),
(3, 'Kinetic', 'kinetic', 'Hệ thống cơ khí nâng hạ nghệ thuật đồng bộ DMX512 / Art-Net / Madrix gồm 5 dòng: Balls, Rings, Lanterns, Milk-drop và Metal spheres.');

INSERT INTO products (
  category_id, product_name, model_code, short_description,
  technical_specs, image_url, video_demo_url, is_featured, status
) VALUES
-- LED Matrix (2 models)
(
  1,
  '20-pixel LED Matrix',
  'SS-LM20',
  'Ma trận điểm ảnh LED 20-pixel trang bị chip COB công suất cao ánh sáng ấm tungsten và viền RGB halo, tạo hiệu ứng chasing sắc nét.',
  JSON_OBJECT(
    'variant', '20-pixel',
    'dimensions', '580 × 460 × 140 mm',
    'cable_travel_or_power', '20 × 30W COB Warm White + RGB Halo (640W)',
    'speed', 'Tần số làm tươi 18.000 Hz · Pixel chase 60fps',
    'control_protocol', 'DMX512 / Art-Net / sACN / Madrix',
    'voltage', 'AC 100–240V, 50/60Hz (PowerCON True1)',
    'weight', '11.5 kg / module'
  ),
  '/assets/squaresnake/led-matrix.jpg',
  '',
  TRUE,
  'available'
),
(
  1,
  '60-pixel LED Matrix',
  'SS-LM60',
  'Ma trận LED 60-pixel mật độ điểm ảnh cao, ghép nối modular thành bức tường ánh sáng 3D cho đại nhạc hội và truyền hình trực tiếp.',
  JSON_OBJECT(
    'variant', '60-pixel',
    'dimensions', '1000 × 600 × 150 mm',
    'cable_travel_or_power', '60 × 20W RGBW Pixel + Tungsten Effect (1.200W)',
    'speed', 'Tần số làm tươi 18.000 Hz · Pixel mapping 3D',
    'control_protocol', 'Art-Net / sACN / DMX512 / Kling-Net',
    'voltage', 'AC 100–240V, 50/60Hz',
    'weight', '18.2 kg / module'
  ),
  '/assets/squaresnake/led-matrix.jpg',
  '',
  TRUE,
  'available'
),

-- Laser (4 models: 20W, 30W, 40W, 60W)
(
  2,
  '20W Laser',
  'SS-LS20',
  'Máy trình diễn Laser Full-Color 20W cho sân khấu trong nhà, club và sự kiện hội nghị cần độ sắc nét tia cao.',
  JSON_OBJECT(
    'variant', '20W Pure Diode RGB',
    'dimensions', '380 × 280 × 210 mm',
    'cable_travel_or_power', '20.000 mW Pure Diode (R:5W / G:6W / B:9W)',
    'speed', 'Quét tia Galvo 40Kpps @ 8° (Góc mở 60°)',
    'control_protocol', 'Pangolin FB4 / LAN / Art-Net / DMX512',
    'voltage', 'AC 100–240V, 600W',
    'weight', '18.0 kg · Chuẩn IP54'
  ),
  '/assets/squaresnake/laser.jpg',
  '',
  FALSE,
  'available'
),
(
  2,
  '30W Laser',
  'SS-LS30',
  'Hệ thống trình diễn Laser công suất thực 30W Pure Diode RGB chống bụi nước IP65 ngoài trời, tích hợp Pangolin FB4.',
  JSON_OBJECT(
    'variant', '30W IP65 Outdoor',
    'dimensions', '485 × 340 × 260 mm',
    'cable_travel_or_power', '30.000 mW Pure Diode (R:8W / G:10W / B:12W)',
    'speed', 'Quét tia Galvo 45Kpps @ 8°',
    'control_protocol', 'Pangolin FB4 (LAN / Art-Net / DMX)',
    'voltage', 'AC 100–240V, 950W',
    'weight', '28.5 kg · Chuẩn IP65'
  ),
  '/assets/squaresnake/laser.jpg',
  '',
  TRUE,
  'available'
),
(
  2,
  '40W Laser',
  'SS-LS40',
  'Hệ thống Laser công suất lớn 40W tạo quạt tia và hiệu ứng không trung tầm xa cho lễ hội âm nhạc ngoài trời.',
  JSON_OBJECT(
    'variant', '40W High-Power',
    'dimensions', '520 × 360 × 275 mm',
    'cable_travel_or_power', '40.000 mW Pure Diode RGB',
    'speed', 'Quét tia Galvo 45Kpps @ 8° · E-Stop Safety',
    'control_protocol', 'Pangolin FB4 / Timecode / DMX512',
    'voltage', 'AC 100–240V, 1.250W',
    'weight', '32.0 kg · Chuẩn IP65'
  ),
  '/assets/squaresnake/laser.jpg',
  '',
  FALSE,
  'available'
),
(
  2,
  '60W Laser',
  'SS-LS60',
  'Hệ thống Laser công suất cực đại 60W cho sân vận động và quảng trường quy mô hàng chục nghìn khán giả.',
  JSON_OBJECT(
    'variant', '60W Stadium Grade',
    'dimensions', '610 × 410 × 310 mm',
    'cable_travel_or_power', '60.000 mW Pure Diode RGB',
    'speed', 'Quét tia Galvo 45Kpps · Chiếu xa > 1.500m',
    'control_protocol', 'Pangolin FB4 / Optical Fiber / Art-Net',
    'voltage', 'AC 100–240V, 1.850W',
    'weight', '42.0 kg · Chuẩn IP65'
  ),
  '/assets/squaresnake/laser.jpg',
  '',
  FALSE,
  'available'
),

-- Kinetic (5 models: Balls, Rings, Lanterns, Milk-drop, Metal spheres)
(
  3,
  'Kinetic Balls',
  'SS-KN-BALL',
  'Quả cầu LED khuếch tán 360 độ kết hợp tời kéo servo siêu êm 6m–12m, tạo sóng chuyển động không gian đồng bộ âm nhạc.',
  JSON_OBJECT(
    'variant', 'Balls (250mm / 350mm)',
    'dimensions', 'Đường kính bóng 250 mm · Cụm tời 320×210×280 mm',
    'cable_travel_or_power', 'Hành trình cáp 6m – 12m · LED 18W RGBW',
    'speed', '0.1 – 1.2 m/s (Độ ồn < 36dB)',
    'control_protocol', 'Art-Net / DMX512 / Madrix 3D',
    'voltage', 'AC 100–240V, 50/60Hz (110W)',
    'weight', '7.8 kg / bộ'
  ),
  '/assets/squaresnake/kinetic-balls.jpg',
  '',
  TRUE,
  'available'
),
(
  3,
  'Kinetic Rings',
  'SS-KN-RING',
  'Vòng ánh sáng pixel đường kính 1.2m trang bị 3 motor servo độc lập, cho phép vừa nâng hạ vừa xoay nghiêng đa trục 360 độ.',
  JSON_OBJECT(
    'variant', 'Rings (Double Axis 1.2m)',
    'dimensions', 'Đường kính 1.200 mm · Nhôm 6061',
    'cable_travel_or_power', 'Hành trình 9.0 m · 120W RGB Pixel hai mặt',
    'speed', '0.8 m/s · Nghiêng góc 0° – 360°',
    'control_protocol', 'Art-Net / Madrix / GrandMA3 Timecode',
    'voltage', 'AC 100–240V (360W / bộ 3 winch)',
    'weight', '24.0 kg / bộ hoàn chỉnh'
  ),
  '/assets/squaresnake/kinetic-rings.jpg',
  '',
  TRUE,
  'available'
),
(
  3,
  'Kinetic Lanterns',
  'SS-KN-LANT',
  'Hệ thống đèn lồng Kinetic nghệ thuật treo trần mang âm hưởng kiến trúc ánh sáng đương đại cho lễ hội và sự kiện văn hóa.',
  JSON_OBJECT(
    'variant', 'Lanterns',
    'dimensions', '380 × 380 × 460 mm · Tời 320×210×280 mm',
    'cable_travel_or_power', 'Hành trình cáp 8.0 m · LED 24W RGBW',
    'speed', '0.1 – 0.9 m/s · Phanh từ kép an toàn',
    'control_protocol', 'DMX512 / Art-Net / Madrix',
    'voltage', 'AC 100–240V, 120W',
    'weight', '8.6 kg / bộ'
  ),
  '/assets/squaresnake/kinetic-lanterns.jpg',
  '',
  FALSE,
  'available'
),
(
  3,
  'Kinetic Milk-drop',
  'SS-KN-DROP',
  'Đầu đèn giọt sương hữu cơ ánh sáng ấm/RGB tạo chuyển động mềm mại theo giai điệu cho triển lãm nghệ thuật và gala.',
  JSON_OBJECT(
    'variant', 'Milk-drop',
    'dimensions', '180 × 180 × 340 mm · Tời đôi chuẩn DMX',
    'cable_travel_or_power', 'Hành trình cáp 6m – 10m · LED 16W RGBW',
    'speed', '0.1 – 1.0 m/s · Chống xoắn cáp',
    'control_protocol', 'Art-Net / DMX512 / Timecode',
    'voltage', 'AC 100–240V, 95W',
    'weight', '6.9 kg / bộ'
  ),
  '/assets/squaresnake/kinetic-milk-drop.jpg',
  '',
  FALSE,
  'available'
),
(
  3,
  'Kinetic Metal spheres',
  'SS-KN-METL',
  'Quả cầu kim loại gương phản chiếu ánh sáng Moving Head & Laser tạo không gian kiến trúc sang trọng cho showroom và concert.',
  JSON_OBJECT(
    'variant', 'Metal spheres (Mirror)',
    'dimensions', 'Đường kính cầu 220mm / 300mm',
    'cable_travel_or_power', 'Hành trình cáp 8m – 12m · Cáp thép chịu tải',
    'speed', '0.1 – 1.1 m/s · Servo tốc độ biến thiên',
    'control_protocol', 'Art-Net / DMX512 / GrandMA3',
    'voltage', 'AC 100–240V, 85W',
    'weight', '8.2 kg / bộ'
  ),
  '/assets/squaresnake/kinetic-metal-spheres.jpg',
  '',
  FALSE,
  'available'
);

INSERT INTO projects (
  event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url
) VALUES
(
  'Đại Nhạc Hội Sóng Đêm 2026',
  'Zeit Media & Live Nation VN',
  'Sân vận động Mỹ Đình, Hà Nội',
  '2026-10-18',
  'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3',
  'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính cho 35.000 khán giả.',
  '/assets/squaresnake/laser.jpg'
),
(
  'Triển Lãm Ô Tô Tương Lai SECC',
  'VinMotion Auto Group',
  'SECC Quận 7, TP. Hồ Chí Minh',
  '2026-09-12',
  'Kinetic Rings · Kinetic Metal spheres · 20-pixel LED Matrix',
  'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ mỗi ngày.',
  '/assets/squaresnake/kinetic-rings.jpg'
),
(
  'Countdown Gala Phố Đi Bộ Nguyễn Huệ',
  'Sở Văn Hóa & Nghệ Thuật TP.HCM',
  'Quận 1, TP. Hồ Chí Minh',
  '2026-08-29',
  '60-pixel LED Matrix · Laser 30W · Kinetic Balls',
  'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình trực tiếp.',
  '/assets/squaresnake/led-matrix.jpg'
);

INSERT INTO contacts (
  customer_name, phone, email, company_agency, event_date, interested_categories, stage_requirements, status
) VALUES
(
  'Trần Hoàng Nam',
  '0912345678',
  'nam.tran@apexevent.vn',
  'Apex Event Production',
  '2026-12-24',
  'Kinetic Balls, 30W Laser',
  'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Balls và 4 máy Laser 30W.',
  'quoted'
),
(
  'Lê Thảo Vy',
  '0987654321',
  'vy.le@skylightagency.vn',
  'Skylight Creative Agency',
  '2026-12-31',
  'Kinetic Rings, 60-pixel LED Matrix',
  'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Rings và 24 panel 60-pixel LED Matrix.',
  'pending'
);
