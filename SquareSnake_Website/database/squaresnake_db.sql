-- =============================================================================
-- CƠ SỞ DỮ LIỆU: SQUARESNAKE VIỆT NAM (STAGE EFFECTS & EVENT EQUIPMENT)
-- Tương thích: MySQL 8.0+ / MariaDB 10.4+ (phpMyAdmin / XAMPP)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS squaresnake_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE squaresnake_db;

-- Xóa bảng cũ nếu import lại (theo đúng thứ tự khóa ngoại)
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
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
-- 2. Bảng products: Chi tiết thiết bị hiệu ứng sự kiện
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
-- 3. Bảng projects: Hồ sơ sự kiện thực tế (Portfolio)
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
  INDEX idx_projects_date (event_date DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Bảng contacts: Yêu cầu tư vấn và báo giá từ khách hàng
-- -----------------------------------------------------------------------------
CREATE TABLE contacts (
  contact_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150),
  company_agency VARCHAR(180),
  event_date DATE,
  interested_categories VARCHAR(255) NOT NULL,
  stage_requirements TEXT,
  status ENUM('pending', 'contacted', 'quoted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contacts_status (status),
  INDEX idx_contacts_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DỮ LIỆU MẪU THỰC TẾ (SEED DATA)
-- =============================================================================

INSERT INTO categories (category_id, category_name, slug, description) VALUES
(1, 'Hệ thống Kinetic', 'kinetic', 'Hệ thống bóng LED và vòng ánh sáng nâng hạ cơ khí chính xác theo chuẩn DMX512, Art-Net và Madrix.'),
(2, 'Ánh sáng Laser', 'laser', 'Hệ thống trình diễn Laser Full-Color RGB công suất lớn 15W–30W IP65 điều khiển qua mạng Pangolin FB4.'),
(3, 'Màn hình LED Matrix', 'led-matrix', 'Hệ thống ma trận điểm ảnh LED COB công suất cao, ghép nối modular không viền cho concert và lễ hội.');

INSERT INTO products (
  category_id, product_name, model_code, short_description,
  technical_specs, image_url, video_demo_url, is_featured, status
) VALUES
(
  1,
  'Kinetic Ball RGBW 250mm',
  'SS-KB250',
  'Quả cầu LED khuếch tán 360 độ kết hợp tời kéo servo siêu êm 6m–12m, tạo sóng chuyển động không gian đồng bộ âm nhạc.',
  JSON_OBJECT(
    'dimensions', 'Đường kính bóng 250 mm · Cụm tời 320×210×280 mm',
    'cable_travel_or_power', 'Hành trình cáp 6m – 12m · LED 18W RGBW',
    'speed', '0.1 – 1.0 m/s (Gia tốc mượt)',
    'control_protocol', 'Art-Net / DMX512 (8 CH) / Madrix 3D',
    'voltage', 'AC 100–240V, 50/60Hz (110W)',
    'weight', '7.8 kg / bộ'
  ),
  '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
  'https://squaresnake.vn/demo/kinetic-ball-250',
  TRUE,
  'available'
),
(
  1,
  'Kinetic Sphere Pro 350mm',
  'SS-KB350',
  'Phiên bản bóng Kinetic đường kính lớn 350mm độ sáng cao, tối ưu cho sân vận động và nhà thi đấu trần cao trên 15m.',
  JSON_OBJECT(
    'dimensions', 'Đường kính bóng 350 mm · Cụm tời 350×230×310 mm',
    'cable_travel_or_power', 'Hành trình cáp 12m (mở rộng 15m) · LED 32W RGBW',
    'speed', 'Tối đa 1.2 m/s (Độ ồn < 36dB)',
    'control_protocol', 'Art-Net / sACN / DMX512 / Madrix',
    'voltage', 'AC 100–240V, 50/60Hz (145W)',
    'weight', '9.4 kg / bộ'
  ),
  '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
  'https://squaresnake.vn/demo/kinetic-sphere-350',
  FALSE,
  'available'
),
(
  1,
  'Kinetic Ring Double Axis 1.2m',
  'SS-KR120',
  'Vòng ánh sáng pixel đường kính 1.2m trang bị 3 motor servo độc lập, cho phép vừa nâng hạ vừa xoay nghiêng đa trục 360 độ.',
  JSON_OBJECT(
    'dimensions', 'Đường kính 1.200 mm · Bản khung 45×45 mm',
    'cable_travel_or_power', 'Hành trình 9.0 m · 120W RGB Pixel hai mặt',
    'speed', '0.8 m/s · Nghiêng góc 0° – 360°',
    'control_protocol', 'Art-Net / Madrix / GrandMA3 Timecode',
    'voltage', 'AC 100–240V (360W / bộ 3 winch)',
    'weight', '24.0 kg / bộ hoàn chỉnh'
  ),
  '/src/assets/images/product_kinetic_ring_1794743191297.jpg',
  'https://squaresnake.vn/demo/kinetic-ring-120',
  TRUE,
  'available'
),
(
  1,
  'Kinetic Ring Tri-Winch 1.8m',
  'SS-KR180',
  'Vòng LED khổ đại 1.8m hợp kim nhôm hàng không, xếp tầng đồng tâm tạo xoắn ốc ánh sáng trên sân khấu lớn.',
  JSON_OBJECT(
    'dimensions', 'Đường kính 1.800 mm · Nhôm 6061',
    'cable_travel_or_power', 'Hành trình 10.0 m · 180W RGBW Pixel',
    'speed', '0.75 m/s · 3 Servo Winch đồng bộ',
    'control_protocol', 'Art-Net / DMX512 / Madrix',
    'voltage', 'AC 100–240V (480W)',
    'weight', '31.5 kg / bộ'
  ),
  '/src/assets/images/product_kinetic_ring_1794743191297.jpg',
  'https://squaresnake.vn/demo/kinetic-ring-180',
  FALSE,
  'available'
),
(
  2,
  'Laser Full-Color 30W IP65',
  'SS-LP30',
  'Hệ thống trình diễn Laser công suất thực 30W Pure Diode RGB chống bụi nước IP65 ngoài trời, tích hợp bộ giải mã Pangolin FB4.',
  JSON_OBJECT(
    'dimensions', '485 × 340 × 260 mm',
    'cable_travel_or_power', '30.000 mW Pure Diode (R:8W / G:10W / B:12W)',
    'speed', 'Quét tia Galvo 45Kpps @ 8° (Góc mở 60°)',
    'control_protocol', 'Pangolin FB4 (LAN / Art-Net / DMX)',
    'voltage', 'AC 100–240V, 950W',
    'weight', '28.5 kg · Chuẩn IP65'
  ),
  '/src/assets/images/product_laser_pro_1794743188964.jpg',
  'https://squaresnake.vn/demo/laser-30w-ip65',
  TRUE,
  'available'
),
(
  2,
  'Laser Show 15W Analog RGB',
  'SS-LP15',
  'Máy chiếu tia Laser RGB 15W điều biến Analog cho phép pha trộn 16,7 triệu màu mượt mà, tối ưu cho sân khấu trong nhà và nhà thi đấu.',
  JSON_OBJECT(
    'dimensions', '360 × 270 × 195 mm',
    'cable_travel_or_power', '15.000 mW Analog RGB (R:4W / G:5W / B:6W)',
    'speed', 'Quét tia Galvo 40Kpps @ 8°',
    'control_protocol', 'Pangolin FB4 / ILDA DB25 / DMX512',
    'voltage', 'AC 100–240V, 480W',
    'weight', '15.2 kg · Chuẩn IP54'
  ),
  '/src/assets/images/product_laser_pro_1794743188964.jpg',
  'https://squaresnake.vn/demo/laser-15w-analog',
  FALSE,
  'available'
),
(
  3,
  'LED Matrix Panel 5x5 Pixel',
  'SS-LM55',
  'Ma trận điểm ảnh LED 5x5 trang bị 25 bóng COB 30W ánh sáng ấm tungsten và viền RGB halo, ghép nối modular không viền.',
  JSON_OBJECT(
    'dimensions', '580 × 580 × 145 mm',
    'cable_travel_or_power', '25 × 30W COB Warm White + RGB Halo (820W)',
    'speed', 'Tần số làm tươi 18.000 Hz · Góc chiếu 4.5°',
    'control_protocol', 'DMX512 (7/25/100 CH) / Art-Net / sACN',
    'voltage', 'AC 100–240V (PowerCON True1)',
    'weight', '14.5 kg / panel'
  ),
  '/src/assets/images/product_led_matrix_1794743188837.jpg',
  'https://squaresnake.vn/demo/led-matrix-5x5',
  TRUE,
  'available'
),
(
  3,
  'LED Matrix Bar 10x10 Beam',
  'SS-LMB10',
  'Thanh ma trận LED công suất cao 10 pixel tia hẹp 3.8° chuẩn IP65, chuyên tạo bức tường ánh sáng và hiệu ứng chasing EDM.',
  JSON_OBJECT(
    'dimensions', '1000 × 120 × 165 mm',
    'cable_travel_or_power', '10 × 40W Osram RGBW COB (420W)',
    'speed', 'Tần số làm tươi 18.000 Hz · Góc tia 3.8°',
    'control_protocol', 'DMX512 / Art-Net / RDM',
    'voltage', 'AC 100–240V, 50/60Hz',
    'weight', '8.2 kg · Chuẩn IP65'
  ),
  '/src/assets/images/product_led_matrix_1794743188837.jpg',
  'https://squaresnake.vn/demo/led-matrix-bar',
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
  '96× Kinetic Sphere Pro 350mm · 12× Laser 30W IP65 · 32× LED Matrix 5x5',
  'Triển khai ma trận 96 quả cầu Kinetic cỡ lớn kết hợp 12 máy Laser 30W IP65 đồng bộ Timecode với bàn GrandMA3 cho 35.000 khán giả.',
  '/src/assets/images/hero_stage_show_1794743188164.jpg'
),
(
  'Triển Lãm Ô Tô Tương Lai SECC',
  'VinMotion Auto Group',
  'SECC Quận 7, TP. Hồ Chí Minh',
  '2026-09-12',
  '12× Kinetic Ring Double Axis 1.2m · 48× Kinetic Ball 250mm · 16× LED Matrix Bar',
  'Lắp đặt 12 vòng Kinetic Ring xếp tầng đồng tâm phía trên khu vực trưng bày xe concept, vận hành liên hoàn 10 giờ mỗi ngày.',
  '/src/assets/images/product_kinetic_ring_1794743191297.jpg'
),
(
  'Countdown Gala Phố Đi Bộ Nguyễn Huệ',
  'Sở Văn Hóa & Nghệ Thuật TP.HCM',
  'Quận 1, TP. Hồ Chí Minh',
  '2026-08-29',
  '40× LED Matrix 5x5 · 8× Laser Full-Color 30W IP65 · 64× Kinetic Ball 250mm',
  'Tổ hợp bức tường LED Matrix 5x5 cùng 8 hệ thống Laser 30W chống ẩm ngoài trời phục vụ hơn 50.000 khán giả.',
  '/src/assets/images/product_kinetic_ball_1794743189815.jpg'
),
(
  'Diễn Đàn Công Nghệ Quốc Gia',
  'FPT Digital & VTV Events',
  'Trung Tâm Hội Nghị Quốc Gia, Hà Nội',
  '2026-07-15',
  '80× Kinetic Ball 250mm · 6× Laser 15W Analog · 6× Kinetic Ring 1.2m',
  'Hệ thống Kinetic độ ồn siêu thấp (< 35dB) kết hợp Laser 15W không sọc hình trên máy quay truyền hình 4K trực tiếp.',
  '/src/assets/images/product_led_matrix_1794743188837.jpg'
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
  'Kinetic Ball, Laser',
  'Sân khấu 28m x 14m x 12m (trong nhà). Cần khoảng 48 quả Kinetic Ball 250mm và 4 máy Laser 15W.',
  'quoted'
),
(
  'Lê Thảo Vy',
  '0987654321',
  'vy.le@skylightagency.vn',
  'Skylight Creative Agency',
  '2026-12-31',
  'Kinetic Ring, LED Matrix',
  'Quảng trường ngoài trời 36m x 18m x 15m. Cần báo giá 8 vòng Kinetic Ring 1.2m và 24 panel LED Matrix 5x5.',
  'pending'
);
