/**
 * Script nạp dữ liệu mẫu (Seed Data) thực tế cho SquareSnake Việt Nam
 * Chạy lệnh: node seed.js
 */
const { pool } = require('./config/db');

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('Bắt đầu nạp dữ liệu mẫu SquareSnake Việt Nam...');
    await connection.beginTransaction();

    // 1. Nạp danh mục (categories)
    const categories = [
      [
        1,
        'Hệ thống Kinetic',
        'kinetic',
        'Hệ thống bóng LED và vòng ánh sáng nâng hạ cơ khí chính xác theo chuẩn DMX512, Art-Net và Madrix.',
      ],
      [
        2,
        'Ánh sáng Laser',
        'laser',
        'Hệ thống trình diễn Laser Full-Color RGB công suất lớn 15W–30W IP65 điều khiển qua mạng Pangolin FB4.',
      ],
      [
        3,
        'Màn hình LED Matrix',
        'led-matrix',
        'Hệ thống ma trận điểm ảnh LED COB công suất cao, ghép nối modular không viền cho concert và lễ hội.',
      ],
    ];

    for (const cat of categories) {
      await connection.query(
        `INSERT INTO categories (category_id, category_name, slug, description)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           category_name = VALUES(category_name),
           description = VALUES(description)`,
        cat
      );
    }

    // 2. Nạp sản phẩm (products)
    const products = [
      {
        category_id: 1,
        product_name: 'Kinetic Ball RGBW 250mm',
        model_code: 'SS-KB250',
        short_description:
          'Quả cầu LED khuếch tán 360 độ kết hợp tời kéo servo siêu êm 6m–12m, tạo sóng chuyển động không gian đồng bộ âm nhạc.',
        technical_specs: JSON.stringify({
          dimensions: 'Đường kính bóng 250 mm · Cụm tời 320×210×280 mm',
          cable_travel_or_power: 'Hành trình cáp 6m – 12m · LED 18W RGBW',
          speed: '0.1 – 1.0 m/s',
          control_protocol: 'Art-Net / DMX512 / Madrix 3D',
          voltage: 'AC 100–240V, 50/60Hz (110W)',
          weight: '7.8 kg / bộ',
        }),
        image_url: '/assets/images/product_kinetic_ball.jpg',
        video_demo_url: 'https://squaresnake.vn/demo/kinetic-ball-250',
        is_featured: true,
        status: 'available',
      },
      {
        category_id: 1,
        product_name: 'Kinetic Ring Double Axis 1.2m',
        model_code: 'SS-KR120',
        short_description:
          'Vòng ánh sáng pixel đường kính 1.2m trang bị 3 motor servo độc lập, cho phép vừa nâng hạ vừa xoay nghiêng đa trục 360 độ.',
        technical_specs: JSON.stringify({
          dimensions: 'Đường kính 1.200 mm · Bản khung 45×45 mm',
          cable_travel_or_power: 'Hành trình 9.0 m · 120W RGB Pixel',
          speed: '0.8 m/s · Nghiêng góc 0° – 360°',
          control_protocol: 'Art-Net / Madrix / GrandMA3 Timecode',
          voltage: 'AC 100–240V (360W)',
          weight: '24.0 kg / bộ',
        }),
        image_url: '/assets/images/product_kinetic_ring.jpg',
        video_demo_url: 'https://squaresnake.vn/demo/kinetic-ring-120',
        is_featured: true,
        status: 'available',
      },
      {
        category_id: 2,
        product_name: 'Laser Full-Color 30W IP65',
        model_code: 'SS-LP30',
        short_description:
          'Hệ thống trình diễn Laser công suất thực 30W Pure Diode RGB chống bụi nước IP65 ngoài trời, tích hợp Pangolin FB4.',
        technical_specs: JSON.stringify({
          dimensions: '485 × 340 × 260 mm',
          cable_travel_or_power: '30.000 mW Pure Diode RGB',
          speed: 'Quét tia Galvo 45Kpps @ 8°',
          control_protocol: 'Pangolin FB4 (LAN / Art-Net / DMX)',
          voltage: 'AC 100–240V, 950W',
          weight: '28.5 kg · IP65',
        }),
        image_url: '/assets/images/product_laser_pro.jpg',
        video_demo_url: 'https://squaresnake.vn/demo/laser-30w-ip65',
        is_featured: true,
        status: 'available',
      },
      {
        category_id: 3,
        product_name: 'LED Matrix Panel 5x5 Pixel',
        model_code: 'SS-LM55',
        short_description:
          'Ma trận điểm ảnh LED 5x5 trang bị 25 bóng COB 30W ánh sáng ấm tungsten và viền RGB halo, ghép nối modular không viền.',
        technical_specs: JSON.stringify({
          dimensions: '580 × 580 × 145 mm',
          cable_travel_or_power: '25 × 30W COB Warm White + RGB Halo',
          speed: 'Tần số làm tươi 18.000 Hz',
          control_protocol: 'DMX512 / Art-Net / sACN',
          voltage: 'AC 100–240V (PowerCON True1)',
          weight: '14.5 kg / panel',
        }),
        image_url: '/assets/images/product_led_matrix.jpg',
        video_demo_url: 'https://squaresnake.vn/demo/led-matrix-5x5',
        is_featured: true,
        status: 'available',
      },
    ];

    for (const p of products) {
      await connection.query(
        `INSERT INTO products (
          category_id, product_name, model_code, short_description,
          technical_specs, image_url, video_demo_url, is_featured, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          product_name = VALUES(product_name),
          short_description = VALUES(short_description),
          technical_specs = VALUES(technical_specs)`,
        [
          p.category_id,
          p.product_name,
          p.model_code,
          p.short_description,
          p.technical_specs,
          p.image_url,
          p.video_demo_url,
          p.is_featured,
          p.status,
        ]
      );
    }

    // 3. Nạp dự án mẫu nếu bảng projects đang trống
    const [existingProjects] = await connection.query('SELECT COUNT(*) AS count FROM projects');
    if (existingProjects[0].count === 0) {
      await connection.query(
        `INSERT INTO projects (event_name, client_name, location, event_date, equipment_used, summary, thumbnail_url) VALUES
        ('Đại Nhạc Hội Sóng Đêm 2026', 'Zeit Media VN', 'SVĐ Mỹ Đình, Hà Nội', '2026-10-18', '96× Kinetic Sphere Pro · 12× Laser 30W IP65 · 32× LED Matrix 5x5', 'Triển khai 96 bóng Kinetic và 12 máy Laser 30W ngoài trời đồng bộ Timecode.', '/assets/images/hero_stage_show.jpg'),
        ('Triển Lãm Ô Tô Tương Lai SECC', 'VinMotion Group', 'SECC Quận 7, TP.HCM', '2026-09-12', '12× Kinetic Ring 1.2m · 48× Kinetic Ball 250mm', 'Lắp đặt 12 vòng Kinetic Ring xoay nghiêng đa trục phía trên khu trưng bày xe concept.', '/assets/images/product_kinetic_ring.jpg')`
      );
    }

    await connection.commit();
    console.log('Nạp dữ liệu mẫu SquareSnake Việt Nam hoàn tất!');
  } catch (err) {
    await connection.rollback();
    console.error('Lỗi khi chạy seed.js:', err);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedDatabase();
