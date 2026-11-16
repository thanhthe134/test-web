/**
 * Script nạp dữ liệu mẫu (Seed Data) cho SquareSnake FX Việt Nam (4 bảng MySQL)
 * Chạy lệnh: node seed.js
 */
const { pool } = require('./config/db');

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('Bắt đầu nạp dữ liệu mẫu SquareSnake FX Việt Nam (4 bảng)...');
    await connection.beginTransaction();

    // 1. Nạp danh mục (categories)
    const categories = [
      [
        1,
        'LED Matrix',
        'led-matrix',
        'Hệ thống ma trận điểm ảnh LED lập trình pixel (20-pixel, 60-pixel), ghép nối modular cho concert và lễ hội.',
      ],
      [
        2,
        'Laser',
        'laser',
        'Hệ thống trình diễn Laser công suất thực 20W, 30W, 40W, 60W Pure Diode RGB điều khiển qua Pangolin FB4.',
      ],
      [
        3,
        'Kinetic',
        'kinetic',
        'Hệ thống cơ khí nâng hạ nghệ thuật 5 hình dáng: Balls, Rings, Lanterns, Milk-drop và Metal spheres.',
      ],
    ];

    for (const cat of categories) {
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

    // 2. Nạp 11 sản phẩm theo thiết kế Figma (products)
    const products = [
      {
        category_id: 1,
        product_name: '20-pixel LED Matrix',
        model_code: 'SS-LM20',
        short_description:
          'Biến thể 20-pixel LED Matrix chuyên tạo hiệu ứng chasing, sóng ánh sáng và ma trận hình học sắc nét.',
        technical_specs: JSON.stringify({
          variant: '20-pixel',
          dimensions: '580 × 460 × 140 mm',
          cable_travel_or_power: '20 × 30W COB Warm White + RGB Halo (640W)',
          speed: 'Tần số làm tươi 18.000 Hz · Pixel chase 60fps',
          control_protocol: 'DMX512 / Art-Net / sACN / Madrix',
          voltage: 'AC 100–240V, 50/60Hz',
          weight: '11.5 kg / module',
        }),
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
          'Biến thể 60-pixel LED Matrix mật độ điểm ảnh cao cho sân khấu đại nhạc hội và truyền hình trực tiếp.',
        technical_specs: JSON.stringify({
          variant: '60-pixel',
          dimensions: '1000 × 600 × 150 mm',
          cable_travel_or_power: '60 × 20W RGBW Pixel (1.200W)',
          speed: 'Tần số làm tươi 18.000 Hz',
          control_protocol: 'Art-Net / sACN / DMX512',
          voltage: 'AC 100–240V, 50/60Hz',
          weight: '18.2 kg / module',
        }),
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
          'Hệ thống Laser công suất 20W cho sự kiện trong nhà, câu lạc bộ và sân khấu hội nghị chuyên nghiệp.',
        technical_specs: JSON.stringify({
          variant: '20W Pure Diode RGB',
          dimensions: '380 × 280 × 210 mm',
          cable_travel_or_power: '20.000 mW RGB',
          speed: 'Quét tia Galvo 40Kpps @ 8°',
          control_protocol: 'Pangolin FB4 / Art-Net / DMX512',
          voltage: 'AC 100–240V, 600W',
          weight: '18.0 kg · IP54',
        }),
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
          'Hệ thống Laser 30W chuẩn chống nước IP65 ngoài trời, tích hợp bộ giải mã mạng Pangolin FB4.',
        technical_specs: JSON.stringify({
          variant: '30W IP65 Outdoor',
          dimensions: '485 × 340 × 260 mm',
          cable_travel_or_power: '30.000 mW Pure Diode RGB',
          speed: 'Quét tia Galvo 45Kpps @ 8°',
          control_protocol: 'Pangolin FB4 (LAN / Art-Net / DMX)',
          voltage: 'AC 100–240V, 950W',
          weight: '28.5 kg · IP65',
        }),
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
          'Hệ thống Laser công suất lớn 40W tạo quạt tia và hiệu ứng không trung tầm xa cho lễ hội âm nhạc.',
        technical_specs: JSON.stringify({
          variant: '40W High-Power',
          dimensions: '520 × 360 × 275 mm',
          cable_travel_or_power: '40.000 mW Pure Diode RGB',
          speed: 'Quét tia Galvo 45Kpps @ 8°',
          control_protocol: 'Pangolin FB4 / Timecode / DMX512',
          voltage: 'AC 100–240V, 1.250W',
          weight: '32.0 kg · IP65',
        }),
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
        technical_specs: JSON.stringify({
          variant: '60W Stadium Grade',
          dimensions: '610 × 410 × 310 mm',
          cable_travel_or_power: '60.000 mW Pure Diode RGB',
          speed: 'Quét tia Galvo 45Kpps · Chiếu xa > 1.500m',
          control_protocol: 'Pangolin FB4 / Optical Fiber / Art-Net',
          voltage: 'AC 100–240V, 1.850W',
          weight: '42.0 kg · IP65',
        }),
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
          'Quả cầu LED khuếch tán 360 độ kết hợp tời kéo servo siêu êm 6m–12m, tạo sóng chuyển động đồng bộ âm nhạc.',
        technical_specs: JSON.stringify({
          variant: 'Balls (250mm / 350mm)',
          dimensions: 'Đường kính bóng 250 mm',
          cable_travel_or_power: 'Hành trình cáp 6m – 12m · LED 18W RGBW',
          speed: '0.1 – 1.2 m/s (< 36dB)',
          control_protocol: 'Art-Net / DMX512 / Madrix 3D',
          voltage: 'AC 100–240V (110W)',
          weight: '7.8 kg / bộ',
        }),
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
          'Vòng ánh sáng pixel đường kính 1.2m trang bị 3 motor servo độc lập, cho phép nâng hạ và xoay nghiêng 360 độ.',
        technical_specs: JSON.stringify({
          variant: 'Rings (Double Axis 1.2m)',
          dimensions: 'Đường kính 1.200 mm',
          cable_travel_or_power: 'Hành trình 9.0 m · 120W RGB Pixel',
          speed: '0.8 m/s · Nghiêng góc 0° – 360°',
          control_protocol: 'Art-Net / Madrix / GrandMA3',
          voltage: 'AC 100–240V (360W)',
          weight: '24.0 kg / bộ',
        }),
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
          'Hệ thống đèn lồng Kinetic nghệ thuật treo trần mang âm hưởng kiến trúc ánh sáng đương đại.',
        technical_specs: JSON.stringify({
          variant: 'Lanterns',
          dimensions: '380 × 380 × 460 mm',
          cable_travel_or_power: 'Hành trình cáp 8.0 m · LED 24W RGBW',
          speed: '0.1 – 0.9 m/s',
          control_protocol: 'DMX512 / Art-Net / Madrix',
          voltage: 'AC 100–240V (120W)',
          weight: '8.6 kg / bộ',
        }),
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
          'Đầu đèn giọt sương hữu cơ ánh sáng ấm/RGB tạo chuyển động mềm mại theo giai điệu cho triển lãm và gala.',
        technical_specs: JSON.stringify({
          variant: 'Milk-drop',
          dimensions: '180 × 180 × 340 mm',
          cable_travel_or_power: 'Hành trình cáp 6m – 10m · LED 16W RGBW',
          speed: '0.1 – 1.0 m/s',
          control_protocol: 'Art-Net / DMX512 / Timecode',
          voltage: 'AC 100–240V (95W)',
          weight: '6.9 kg / bộ',
        }),
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
          'Quả cầu kim loại gương phản chiếu ánh sáng Moving Head & Laser tạo không gian kiến trúc sang trọng.',
        technical_specs: JSON.stringify({
          variant: 'Metal spheres (Mirror)',
          dimensions: 'Đường kính cầu 220mm / 300mm',
          cable_travel_or_power: 'Hành trình cáp 8m – 12m',
          speed: '0.1 – 1.1 m/s',
          control_protocol: 'Art-Net / DMX512 / GrandMA3',
          voltage: 'AC 100–240V (85W)',
          weight: '8.2 kg / bộ',
        }),
        image_url: '/assets/squaresnake/kinetic-metal-spheres.jpg',
        video_demo_url: '',
        is_featured: false,
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
          category_id = VALUES(category_id),
          product_name = VALUES(product_name),
          short_description = VALUES(short_description),
          technical_specs = VALUES(technical_specs),
          image_url = VALUES(image_url),
          is_featured = VALUES(is_featured)`,
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
        ('Đại Nhạc Hội Sóng Đêm 2026', 'Zeit Media & Live Nation VN', 'Sân vận động Mỹ Đình, Hà Nội', '2026-10-18', 'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3', 'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính.', '/assets/squaresnake/laser.jpg'),
        ('Triển Lãm Ô Tô Tương Lai SECC', 'VinMotion Auto Group', 'SECC Quận 7, TP. Hồ Chí Minh', '2026-09-12', 'Kinetic Rings · Kinetic Metal spheres · 20-pixel LED Matrix', 'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ/ngày.', '/assets/squaresnake/kinetic-rings.jpg'),
        ('Countdown Gala Phố Đi Bộ Nguyễn Huệ', 'Sở Văn Hóa & Nghệ Thuật TP.HCM', 'Quận 1, TP. Hồ Chí Minh', '2026-08-29', '60-pixel LED Matrix · Laser 30W · Kinetic Balls', 'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình.', '/assets/squaresnake/led-matrix.jpg')`
      );
    }

    await connection.commit();
    console.log('Nạp dữ liệu mẫu SquareSnake FX Việt Nam (11 models Figma) hoàn tất!');
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
