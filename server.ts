import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

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

interface StoreContact {
  contact_id: number;
  reference_code: string;
  customer_name: string;
  phone: string;
  company_agency: string;
  event_date: string;
  interested_categories: string[];
  stage_requirements: string;
  status: 'pending' | 'contacted' | 'quoted';
  created_at: string;
}

interface DatabaseStore {
  categories: StoreCategory[];
  products: StoreProduct[];
  projects: StoreProject[];
  contacts: StoreContact[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'squaresnake_store.json');

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
        'Lắp đặt làm phông nền sau sân khấu (backdrop matrix), viền khung truss hoặc treo trần nghiêng tạo hiệu ứng ánh sáng ấm mô phỏng đèn halogen kết hợp chớp pixel tốc độ cao.',
      imageUrl: '/src/assets/images/product_led_matrix_1794743188837.jpg',
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
        { label: 'Công suất tiêu thụ', value: '820W tối đa' },
        { label: 'Góc chiếu tia', value: '4.5° (Beam) / 28° (Wash phụ)' },
        { label: 'Chuẩn điều khiển', value: 'DMX512 (7/25/100 CH), Art-Net, sACN' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 50/60Hz (PowerCON True1)' },
        { label: 'Trọng lượng', value: '14.5 kg / panel' },
        { label: 'Chuẩn bảo vệ', value: 'IP20 (Sân khấu trong nhà & mái che)' },
      ],
      riggingNotes: {
        trussLoad: '14.5 kg / module (ghép tối đa 8 tầng dọc)',
        suspensionPoints: '2 × Quick-Lock Clamp hoặc Flying Bar 4 điểm',
        cableDrop: 'Khóa cam-lock liên kết cơ khí 4 cạnh',
        controlChain: 'RJ45 Art-Net Loop + DMX 5-Pin Thru',
      },
    },
    {
      id: 'led-matrix-bar-10x10',
      code: 'SS-LMB10',
      name: 'LED Matrix Bar 10x10 Beam',
      categoryKey: 'led-matrix',
      categoryLabel: 'LED Matrix',
      systemType: 'led-matrix',
      tagline: 'Thanh LED 10 pixel tia hẹp 4° · Quét mảng không gian',
      description:
        'Thanh ma trận LED công suất cao cho phép tạo bức tường tia sáng thẳng đứng hoặc sắp xếp dạng lưới không gian đa lớp trên sân khấu EDM và fashion show.',
      stageApplication:
        'Tạo hàng rào ánh sáng cắt ngang sân khấu, phối hợp cùng khói lạnh (haze) để dựng khối hình học ánh sáng đồng bộ theo nhịp bass.',
      imageUrl: '/src/assets/images/product_led_matrix_1794743188837.jpg',
      highlightSpec1Label: 'Nguồn sáng',
      highlightSpec1Value: '10 × 40W RGBW 4in1',
      highlightSpec2Label: 'Góc mở tia',
      highlightSpec2Value: '3.8° siêu hẹp',
      stockCount: 96,
      status: 'available',
      isFeatured: false,
      specs: [
        { label: 'Kích thước khung', value: '1000 × 120 × 165 mm' },
        { label: 'Nguồn sáng', value: '10 × 40W Osram RGBW COB' },
        { label: 'Công suất tiêu thụ', value: '420W' },
        { label: 'Tần số làm tươi', value: '18.000 Hz (Không nhấp nháy trên camera)' },
        { label: 'Chuẩn điều khiển', value: 'DMX512 / Art-Net / RDM' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 50/60Hz' },
        { label: 'Trọng lượng', value: '8.2 kg' },
        { label: 'Chuẩn bảo vệ', value: 'IP65 (Dùng ngoài trời)' },
      ],
      riggingNotes: {
        trussLoad: '8.2 kg / thanh',
        suspensionPoints: '2 × Omega Bracket xoay 360°',
        cableDrop: 'Liên kết nối tiếp tối đa 6 thanh qua chốt trượt',
        controlChain: 'PowerCON True1 & Art-Net IP65',
      },
    },
    {
      id: 'laser-full-color-30w-ip65',
      code: 'SS-LP30',
      name: 'Laser Full-Color 30W IP65',
      categoryKey: 'laser',
      categoryLabel: 'Ánh sáng Laser',
      systemType: 'laser-pro',
      tagline: '30W Diode thuần RGB · Chống nước IP65 · Pangolin FB4',
      description:
        'Máy phát Laser công suất thực 30W chuẩn công nghiệp chống bụi nước IP65, chuyên trị các đại nhạc hội ngoài trời, sân vận động và quảng trường lớn với tia cắt không gian xa hàng km.',
      stageApplication:
        'Trình chiếu tia quét không gian trên cao (aerial beam show), mapping logo thương hiệu độ phân giải cao lên công trình kiến trúc hoặc màn nước ngoài trời.',
      imageUrl: '/src/assets/images/product_laser_pro_1794743188964.jpg',
      highlightSpec1Label: 'Công suất Laser',
      highlightSpec1Value: '30W Pure Diode RGB',
      highlightSpec2Label: 'Tốc độ quét',
      highlightSpec2Value: '45Kpps @ 8° · Pangolin FB4',
      stockCount: 24,
      status: 'available',
      isFeatured: true,
      specs: [
        { label: 'Kích thước máy', value: '485 × 340 × 260 mm' },
        { label: 'Công suất thực', value: '30.000 mW (R: 8W / G: 10W / B: 12W)' },
        { label: 'Tốc độ quét Galvo', value: '45Kpps ILDA (Mở góc tối đa 60°)' },
        { label: 'Độ phân kỳ tia', value: '< 0.9 mrad (Tia mảnh sắc nét tầm xa)' },
        { label: 'Chuẩn điều khiển', value: 'Tích hợp Pangolin FB4 (LAN/Art-Net/DMX)' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 950W' },
        { label: 'Trọng lượng', value: '28.5 kg' },
        { label: 'Chuẩn bảo vệ', value: 'IP65 (Vận hành ổn định dưới mưa)' },
      ],
      riggingNotes: {
        trussLoad: '28.5 kg + khung gá chữ U chịu lực',
        suspensionPoints: '2 × Kẹp Truss Heavy-Duty + Cáp an toàn 5mm',
        cableDrop: 'Độ cao lắp đặt tối thiểu 3.2m trên đầu khán giả',
        controlChain: 'Cáp mạng CAT6 trực tiếp từ bàn điều khiển Beyond/QuickShow',
      },
    },
    {
      id: 'laser-show-15w-analog',
      code: 'SS-LP15',
      name: 'Laser Show 15W Analog RGB',
      categoryKey: 'laser',
      categoryLabel: 'Ánh sáng Laser',
      systemType: 'laser-pro',
      tagline: '15W Analog RGB · Quét tia 40Kpps · Tối ưu sân khấu Indoor',
      description:
        'Hệ thống Laser RGB 15W điều biến Analog cho phép pha trộn hơn 16,7 triệu sắc thái màu mượt mà, kích thước nhỏ gọn dễ dàng bố trí dày đặc dọc giàn truss.',
      stageApplication:
        'Tạo hiệu ứng lưới tia, hầm ánh sáng và chuyển động đồ họa đồng bộ timecode cho nhà thi đấu, sự kiện ra mắt sản phẩm và tiệc gala doanh nghiệp.',
      imageUrl: '/src/assets/images/product_laser_pro_1794743188964.jpg',
      highlightSpec1Label: 'Công suất Laser',
      highlightSpec1Value: '15W Analog RGB',
      highlightSpec2Label: 'Tốc độ quét',
      highlightSpec2Value: '40Kpps · ILDA / FB4',
      stockCount: 36,
      status: 'available',
      isFeatured: false,
      specs: [
        { label: 'Kích thước máy', value: '360 × 270 × 195 mm' },
        { label: 'Công suất thực', value: '15.000 mW (R: 4W / G: 5W / B: 6W)' },
        { label: 'Tốc độ quét Galvo', value: '40Kpps @ 8°' },
        { label: 'Độ phân kỳ tia', value: '< 1.0 mrad' },
        { label: 'Chuẩn điều khiển', value: 'Pangolin FB4 / ILDA DB25 / DMX512' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 480W' },
        { label: 'Trọng lượng', value: '15.2 kg' },
        { label: 'Chuẩn bảo vệ', value: 'IP54' },
      ],
      riggingNotes: {
        trussLoad: '15.2 kg / máy',
        suspensionPoints: '1 × Coupler 500kg + 1 × Dây an toàn thép',
        cableDrop: 'Nút dừng khẩn cấp E-Stop nối chuỗi toàn hệ thống',
        controlChain: 'Ethernet Switch Gigabit tới hệ thống FB4',
      },
    },
    {
      id: 'kinetic-ball-rgbw-250',
      code: 'SS-KB250',
      name: 'Kinetic Ball RGBW 250mm',
      categoryKey: 'kinetic',
      categoryLabel: 'Hệ thống Kinetic',
      systemType: 'kinetic-ball',
      tagline: 'Bóng LED 250mm · Hành trình 6m–12m · Chuẩn Art-Net / Madrix',
      description:
        'Thiết bị chủ lực tạo nên thương hiệu SquareSnake Việt Nam: quả cầu khuếch tán ánh sáng 360 độ kết hợp tời kéo servo chính xác từng milimet, chuyển động mượt mà không rung lắc.',
      stageApplication:
        'Triển khai thành ma trận 32 đến 200+ quả cầu treo trên trần sân khấu hoặc khu vực sảnh triển lãm, lập trình sóng sin, khối chóp 3D và đổi màu theo tiết tấu.',
      imageUrl: '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
      highlightSpec1Label: 'Hành trình cáp',
      highlightSpec1Value: '6m – 12m (Tốc độ 1.0 m/s)',
      highlightSpec2Label: 'Điều khiển',
      highlightSpec2Value: 'Art-Net / DMX512 / Madrix',
      stockCount: 220,
      status: 'available',
      isFeatured: true,
      specs: [
        { label: 'Kích thước cụm tời', value: '320 × 210 × 280 mm' },
        { label: 'Đường kính bóng', value: '250 mm (Vỏ PC chống va đập)' },
        { label: 'Hành trình nâng hạ', value: '6m / 9m / 12m tùy chọn' },
        { label: 'Tốc độ di chuyển', value: '0.1 – 1.0 m/s (Lập trình gia tốc mượt)' },
        { label: 'Công suất LED', value: '18W RGBW 360° (Độ sáng đồng đều)' },
        { label: 'Chuẩn điều khiển', value: 'Art-Net, DMX512 (8 CH), Madrix 3D' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 110W / cụm' },
        { label: 'Trọng lượng tổng', value: '7.8 kg / bộ (Cảm biến quá tải kép)' },
      ],
      riggingNotes: {
        trussLoad: '7.8 kg / điểm (Lưới chuẩn cách tâm 0.8m–1.2m)',
        suspensionPoints: '2 × Kẹp Truss nhôm đúc + Cáp an toàn',
        cableDrop: 'Cáp đồng trục kép vừa tải lực vừa cấp nguồn 24V DC cho bóng',
        controlChain: 'Cấp nguồn PowerCON liên hoàn 10 bộ/line + Art-Net Switch',
      },
    },
    {
      id: 'kinetic-sphere-pro-350',
      code: 'SS-KB350',
      name: 'Kinetic Sphere Pro 350mm',
      categoryKey: 'kinetic',
      categoryLabel: 'Hệ thống Kinetic',
      systemType: 'kinetic-ball',
      tagline: 'Bóng cỡ lớn 350mm · Tốc độ 1.2m/s · Khán phòng trần cao 15m+',
      description:
        'Phiên bản nâng cấp đường kính lớn 350mm dành cho các nhà thi đấu và quảng trường trần cao, đảm bảo điểm ảnh sắc rõ ngay cả ở khoảng cách khán giả trên 80m.',
      stageApplication:
        'Phù hợp cho lễ trao giải truyền hình trực tiếp, đại nhạc hội sân vận động hoặc không gian atrium trung tâm thương mại trần cao.',
      imageUrl: '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
      highlightSpec1Label: 'Hành trình cáp',
      highlightSpec1Value: '12m (Tốc độ 1.2 m/s)',
      highlightSpec2Label: 'Độ sáng',
      highlightSpec2Value: '32W High-Output RGBW',
      stockCount: 80,
      status: 'available',
      isFeatured: false,
      specs: [
        { label: 'Kích thước cụm tời', value: '350 × 230 × 310 mm' },
        { label: 'Đường kính bóng', value: '350 mm (Khuếch tán mờ cao cấp)' },
        { label: 'Hành trình nâng hạ', value: '12 m (Tùy chọn mở rộng 15m)' },
        { label: 'Tốc độ di chuyển', value: 'Tối đa 1.2 m/s (Độ ồn < 36dB)' },
        { label: 'Chuẩn điều khiển', value: 'Art-Net / sACN / DMX512 / Madrix' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 145W' },
        { label: 'Trọng lượng tổng', value: '9.4 kg / bộ' },
        { label: 'Tính năng an toàn', value: 'Phanh điện từ tự khóa khi mất điện' },
      ],
      riggingNotes: {
        trussLoad: '9.4 kg / điểm treo',
        suspensionPoints: '2 × Trigger Clamp chịu tải 250kg',
        cableDrop: 'Cáp thép không xoắn 4mm kèm lõi đồng tín hiệu',
        controlChain: 'Art-Net redundant 2 cổng dự phòng',
      },
    },
    {
      id: 'kinetic-ring-double-axis-120',
      code: 'SS-KR120',
      name: 'Kinetic Ring Double Axis 1.2m',
      categoryKey: 'kinetic',
      categoryLabel: 'Hệ thống Kinetic',
      systemType: 'kinetic-ring',
      tagline: '3 motor độc lập · Nghiêng góc 360° · LED Pixel 2 mặt',
      description:
        'Vòng ánh sáng động cơ học với đường kính 1.2m được treo bởi 3 cụm tời servo độc lập, cho phép vừa nâng hạ vừa nghiêng đa trục, xoay đảo chiều ấn tượng trong không trung.',
      stageApplication:
        'Điểm nhấn thị giác trung tâm phía trên ca sĩ, DJ hoặc khu vực trưng bày xe hơi, tạo hiệu ứng vòng hào quang chuyển động không gian 3 chiều.',
      imageUrl: '/src/assets/images/product_kinetic_ring_1794743191297.jpg',
      highlightSpec1Label: 'Cấu hình nâng',
      highlightSpec1Value: '3 Motor độc lập · Nghiêng 360°',
      highlightSpec2Label: 'Đường kính vòng',
      highlightSpec2Value: '1.2m · 144 Pixel SMD5050',
      stockCount: 32,
      status: 'available',
      isFeatured: true,
      specs: [
        { label: 'Đường kính vòng LED', value: '1.200 mm (Bản khung 45 × 45 mm)' },
        { label: 'Hệ thống truyền động', value: '3 × Servo Winch đồng bộ đa trục' },
        { label: 'Hành trình nâng hạ', value: '9.0 m (Góc nghiêng 0° – 360°)' },
        { label: 'Tốc độ di chuyển', value: '0.8 m/s (Độ chính xác vị trí ±1mm)' },
        { label: 'Công suất LED', value: '120W RGB Pixel (360° hai mặt phát sáng)' },
        { label: 'Chuẩn điều khiển', value: 'Art-Net / Madrix / GrandMA3 Timecode' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 360W / bộ hoàn chỉnh' },
        { label: 'Trọng lượng tổng', value: '24.0 kg (Bao gồm 3 cụm tời + vòng)' },
      ],
      riggingNotes: {
        trussLoad: '24 kg phân bổ đều lên 3 điểm tam giác đều trên truss',
        suspensionPoints: '3 × Điểm treo độc lập (Tam giác cạnh 1.35m)',
        cableDrop: '3 cáp tải tích hợp cấp nguồn không lộ dây rời',
        controlChain: 'Đồng bộ Art-Net Universe riêng cho chuyển động & LED',
      },
    },
    {
      id: 'kinetic-ring-tri-winch-180',
      code: 'SS-KR180',
      name: 'Kinetic Ring Tri-Winch 1.8m',
      categoryKey: 'kinetic',
      categoryLabel: 'Hệ thống Kinetic',
      systemType: 'kinetic-ring',
      tagline: 'Vòng đại 1.8m · Hành trình 10m · Tối ưu sân khấu lớn',
      description:
        'Thiết kế vòng LED khổ lớn 1.8m với độ cứng vững hợp kim nhôm hàng không, có thể xếp lồng đồng tâm nhiều vòng để tạo cấu trúc xoắn ốc trên sân khấu.',
      stageApplication:
        'Phối hợp từ 4 đến 12 vòng treo đồng tâm tại sân khấu âm nhạc, lễ hội đếm ngược và trình diễn thời trang cao cấp.',
      imageUrl: '/src/assets/images/product_kinetic_ring_1794743191297.jpg',
      highlightSpec1Label: 'Đường kính vòng',
      highlightSpec1Value: '1.8m · 216 Pixel kép',
      highlightSpec2Label: 'Hành trình nâng',
      highlightSpec2Value: '10.0m · 3 Winch đồng bộ',
      stockCount: 16,
      status: 'available',
      isFeatured: false,
      specs: [
        { label: 'Đường kính vòng LED', value: '1.800 mm (Hợp kim nhôm 6061)' },
        { label: 'Hệ thống truyền động', value: '3 × Heavy-Duty DMX Winch' },
        { label: 'Hành trình nâng hạ', value: '10.0 m' },
        { label: 'Tốc độ di chuyển', value: '0.75 m/s' },
        { label: 'Công suất LED', value: '180W RGBW Pixel' },
        { label: 'Chuẩn điều khiển', value: 'Art-Net / DMX512 / Madrix' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 480W' },
        { label: 'Trọng lượng tổng', value: '31.5 kg / bộ hoàn chỉnh' },
      ],
      riggingNotes: {
        trussLoad: '31.5 kg (Yêu cầu Truss hộp tối thiểu 400×400mm)',
        suspensionPoints: '3 × Kẹp Truss công nghiệp + Safety Cable',
        cableDrop: 'Cân chỉnh điểm 0 tự động trước giờ G bằng laser thước',
        controlChain: 'Quản lý tập trung qua tủ điện phân phối DMX Opto-Splitter',
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
        'Triển khai ma trận 96 quả Kinetic Ball 350mm kết hợp 12 máy Laser 30W IP65 quét tia đồng bộ Timecode với bàn điều khiển GrandMA3 suốt 4 giờ diễn ngoài trời.',
      imageUrl: '/src/assets/images/hero_stage_show_1794743188164.jpg',
      equipmentUsed: [
        '96 × Kinetic Sphere Pro 350mm',
        '12 × Laser Full-Color 30W IP65',
        '32 × LED Matrix Panel 5x5 Pixel',
      ],
      linkedCategory: 'laser',
    },
    {
      id: 'proj-future-mobility-expo',
      title: 'Triển Lãm Ô Tô Tương Lai SECC',
      eventType: 'Ra Mắt Sản Phẩm & Triển Lãm',
      clientName: 'VinMotion Auto Group',
      location: 'SECC Quận 7, TP. Hồ Chí Minh',
      date: 'Tháng 09, 2026',
      scaleMetric: '12.000 Khách tham quan/ngày',
      stageDimension: '28m × 16m × 11m',
      summary:
        'Lắp đặt 12 vòng Kinetic Ring Double Axis 1.2m xếp tầng đồng tâm phía trên khu vực trưng bày xe concept, lập trình chuyển động liên hoàn 10 giờ/ngày.',
      imageUrl: '/src/assets/images/product_kinetic_ring_1794743191297.jpg',
      equipmentUsed: [
        '12 × Kinetic Ring Double Axis 1.2m',
        '48 × Kinetic Ball RGBW 250mm',
        '16 × LED Matrix Bar 10x10 Beam',
      ],
      linkedCategory: 'kinetic',
    },
    {
      id: 'proj-countdown-gala',
      title: 'Countdown Gala Phố Đi Bộ Nguyễn Huệ',
      eventType: 'Sự Kiện Cộng Đồng Quy Mô Lớn',
      clientName: 'Sở Văn Hóa & Nghệ Thuật TP.HCM',
      location: 'Quận 1, TP. Hồ Chí Minh',
      date: 'Tháng 08, 2026',
      scaleMetric: '50.000+ Khán giả trực tiếp',
      stageDimension: '36m × 18m × 16m',
      summary:
        'Tổ hợp LED Matrix 5x5 làm bức tường ánh sáng chủ đạo cùng 8 hệ thống Laser 30W IP65 chống ẩm sương đêm, đảm bảo vận hành liên tục không gián đoạn.',
      imageUrl: '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
      equipmentUsed: [
        '40 × LED Matrix Panel 5x5 Pixel',
        '8 × Laser Full-Color 30W IP65',
        '64 × Kinetic Ball RGBW 250mm',
      ],
      linkedCategory: 'led-matrix',
    },
    {
      id: 'proj-tech-summit-ncc',
      title: 'Diễn Đàn Công Nghệ Quốc Gia',
      eventType: 'Hội Nghị & Lễ Trao Giải Truyền Hình',
      clientName: 'FPT Digital & VTV Events',
      location: 'Trung Tâm Hội Nghị Quốc Gia, Hà Nội',
      date: 'Tháng 07, 2026',
      scaleMetric: '3.500 Đại biểu · Phát sóng VTV',
      stageDimension: '24m × 12m × 10m',
      summary:
        'Hệ thống Kinetic Ball 250mm độ ồn siêu thấp (< 35dB) kết hợp Laser 15W Analog tần số quét mượt không sọc hình trên máy quay truyền hình 4K.',
      imageUrl: '/src/assets/images/product_led_matrix_1794743188837.jpg',
      equipmentUsed: [
        '80 × Kinetic Ball RGBW 250mm',
        '6 × Laser Show 15W Analog RGB',
        '6 × Kinetic Ring Double Axis 1.2m',
      ],
      linkedCategory: 'kinetic',
    },
  ],
  contacts: [
    {
      contact_id: 1,
      reference_code: 'SS-BG-1001',
      customer_name: 'Trần Hoàng Nam',
      phone: '0912345678',
      company_agency: 'Apex Event Production',
      event_date: '2026-12-24',
      interested_categories: ['Kinetic Ball', 'Laser'],
      stage_requirements: 'Sân khấu 28m × 14m × 12m (trong nhà). Cần khoảng 48 quả Kinetic Ball 250mm và 4 máy Laser 15W.',
      status: 'quoted',
      created_at: '2026-11-10T09:30:00.000Z',
    },
    {
      contact_id: 2,
      reference_code: 'SS-BG-1002',
      customer_name: 'Lê Thảo Vy',
      phone: '0987654321',
      company_agency: 'Skylight Creative Agency',
      event_date: '2026-12-31',
      interested_categories: ['Kinetic Ring', 'LED Matrix'],
      stage_requirements: 'Quảng trường ngoài trời 36m × 18m × 15m. Cần báo giá 8 vòng Kinetic Ring 1.2m và 24 panel LED Matrix 5x5.',
      status: 'pending',
      created_at: '2026-11-14T15:10:00.000Z',
    },
  ],
};

function readStore(): DatabaseStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(SEED_DATA)) as DatabaseStore;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseStore;
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(SEED_DATA)) as DatabaseStore;
  }
}

function writeStore(store: DatabaseStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure initial store file exists
  readStore();

  // RESTful API Routes
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
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
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
          item.highlightSpec1Value,
          item.highlightSpec2Value,
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

  app.get('/api/products/:id', (req, res) => {
    const store = readStore();
    const found = store.products.find((p) => p.id === req.params.id);
    if (!found) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị.' });
      return;
    }
    res.json({ success: true, data: found });
  });

  app.post('/api/products', (req, res) => {
    const store = readStore();
    const {
      name,
      code,
      categoryKey,
      tagline,
      description,
      powerOrTravel,
      controlProtocol,
      stockCount,
    } = req.body as {
      name?: string;
      code?: string;
      categoryKey?: 'kinetic' | 'laser' | 'led-matrix';
      tagline?: string;
      description?: string;
      powerOrTravel?: string;
      controlProtocol?: string;
      stockCount?: number;
    };

    if (!name || !code || !categoryKey) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ Tên thiết bị, Mã model và Phân loại.',
      });
      return;
    }

    const categoryMap: Record<
      'kinetic' | 'laser' | 'led-matrix',
      {
        label: string;
        systemType: 'kinetic-ball' | 'laser-pro' | 'led-matrix';
        imageUrl: string;
      }
    > = {
      kinetic: {
        label: 'Hệ thống Kinetic',
        systemType: 'kinetic-ball',
        imageUrl: '/src/assets/images/product_kinetic_ball_1794743189815.jpg',
      },
      laser: {
        label: 'Ánh sáng Laser',
        systemType: 'laser-pro',
        imageUrl: '/src/assets/images/product_laser_pro_1794743188964.jpg',
      },
      'led-matrix': {
        label: 'LED Matrix',
        systemType: 'led-matrix',
        imageUrl: '/src/assets/images/product_led_matrix_1794743188837.jpg',
      },
    };

    const meta = categoryMap[categoryKey];
    const slugId = `${code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newItem: StoreProduct = {
      id: slugId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      categoryKey,
      categoryLabel: meta.label,
      systemType: meta.systemType,
      tagline: tagline?.trim() || `${powerOrTravel || 'Cấu hình sân khấu'} · ${controlProtocol || 'Art-Net / DMX512'}`,
      description:
        description?.trim() ||
        'Thiết bị hiệu ứng sân khấu chuyên nghiệp thuộc hệ sinh thái SquareSnake Việt Nam.',
      stageApplication:
        'Phù hợp cho concert, lễ hội âm nhạc ngoài trời, sự kiện ra mắt sản phẩm và hội nghị truyền hình.',
      imageUrl: meta.imageUrl,
      highlightSpec1Label: categoryKey === 'kinetic' ? 'Hành trình / Công suất' : 'Công suất quang',
      highlightSpec1Value: powerOrTravel?.trim() || 'Theo tiêu chuẩn dự án',
      highlightSpec2Label: 'Điều khiển',
      highlightSpec2Value: controlProtocol?.trim() || 'Art-Net / DMX512',
      stockCount: Number(stockCount) > 0 ? Number(stockCount) : 20,
      status: 'available',
      isFeatured: false,
      specs: [
        { label: 'Mã thiết bị', value: code.trim().toUpperCase() },
        { label: 'Công suất / Hành trình', value: powerOrTravel?.trim() || 'Tiêu chuẩn sân khấu' },
        { label: 'Chuẩn điều khiển', value: controlProtocol?.trim() || 'Art-Net / DMX512' },
        { label: 'Điện áp hoạt động', value: 'AC 100–240V, 50/60Hz' },
      ],
      riggingNotes: {
        trussLoad: 'Treo trên khung Truss hộp 400×400mm kèm cáp an toàn',
        suspensionPoints: '2 × Quick-Lock Clamp công nghiệp',
        cableDrop: 'Cân chỉnh tự động trước giờ chạy chương trình',
        controlChain: controlProtocol?.trim() || 'Art-Net / DMX512 Loop',
      },
    };

    store.products.push(newItem);
    writeStore(store);

    res.status(201).json({ success: true, message: 'Đã thêm thiết bị mới thành công.', data: newItem });
  });

  app.get('/api/projects', (_req, res) => {
    const store = readStore();
    res.json({ success: true, count: store.projects.length, data: store.projects });
  });

  app.get('/api/contacts', (_req, res) => {
    const store = readStore();
    const sorted = [...store.contacts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json({ success: true, count: sorted.length, data: sorted });
  });

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
        message: 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại liên hệ.',
      });
      return;
    }

    const categoriesArr = Array.isArray(interested_categories)
      ? interested_categories
      : typeof interested_categories === 'string' && interested_categories.trim()
      ? interested_categories.split(',').map((s) => s.trim())
      : [];

    if (categoriesArr.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất 1 nhóm thiết bị quan tâm.',
      });
      return;
    }

    const nextId =
      store.contacts.length > 0
        ? Math.max(...store.contacts.map((c) => c.contact_id)) + 1
        : 1;
    const referenceCode = `SS-BG-${String(1000 + nextId)}`;

    const newContact: StoreContact = {
      contact_id: nextId,
      reference_code: referenceCode,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      company_agency: company_agency?.trim() || 'Khách hàng trực tiếp',
      event_date: event_date?.trim() || 'Chưa ấn định',
      interested_categories: categoriesArr,
      stage_requirements: stage_requirements?.trim() || 'Cần kỹ sư tư vấn khảo sát thực tế',
      status: 'pending',
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

  app.patch('/api/contacts/:id/status', (req, res) => {
    const store = readStore();
    const idNum = Number(req.params.id);
    const { status } = req.body as { status?: 'pending' | 'contacted' | 'quoted' };

    if (!status || !['pending', 'contacted', 'quoted'].includes(status)) {
      res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
      return;
    }

    const target = store.contacts.find((c) => c.contact_id === idNum);
    if (!target) {
      res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu báo giá.' });
      return;
    }

    target.status = status;
    writeStore(store);

    res.json({ success: true, message: 'Đã cập nhật trạng thái xử lý.', data: target });
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
    console.log(`[SquareSnake Full-Stack] Server đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer();
