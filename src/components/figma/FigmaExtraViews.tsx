import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FIGMA_ASSETS } from '../../data/figmaCatalog';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';

interface ExtraViewProps {
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaAboutView: React.FC<ExtraViewProps> = ({ onNavigate }) => {
  return (
    <div>
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs text-[#9E9EA7]">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang Chủ
          </button>
          <span>/</span>
          <span className="text-white">Về Chúng Tôi</span>
        </div>
      </div>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20 border-b border-[#1E1E24]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-4">
              VỀ SQUARESNAKE FX VIỆT NAM
            </p>
            <h1
              className="font-display font-semibold text-white tracking-[-0.025em] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)' }}
            >
              Kỹ thuật chính xác.
              <br />
              Hiệu ứng đỉnh cao.
            </h1>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed mb-8 max-w-xl">
              Công ty TNHH SquareSnake FX Việt Nam chuyên cung cấp, cho thuê và trực tiếp lập
              trình vận hành các hệ thống LED Matrix, Laser công suất lớn và cơ khí Kinetic cho
              concert, triển lãm và sự kiện quy mô lớn tại Hà Nội, TP.HCM và toàn quốc.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'quote' })}
              className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Liên hệ hợp tác dự án</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141417] border border-[#242429]">
              <ResilientImage
                src={FIGMA_ASSETS.heroConcert}
                alt="SquareSnake FX Việt Nam"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#1E1E24]">
          {[
            { num: '200+', title: 'Sự kiện đã vận hành' },
            { num: '500+', title: 'Thiết bị sẵn kho HN & HCM' },
            { num: '24/7', title: 'Kỹ sư trực chiến Timecode' },
            { num: '03', title: 'Hệ thống chủ lực chuyên sâu' },
          ].map((stat) => (
            <div key={stat.title} className="bg-[#141417] border border-[#242429] p-6">
              <p className="font-display text-3xl font-bold text-[#E5C148] tabular-nums">
                {stat.num}
              </p>
              <p className="text-sm text-[#D4D4D8] mt-2">{stat.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const FigmaProjectsView: React.FC<ExtraViewProps> = ({ onNavigate }) => {
  const cases = [
    {
      num: '01 / MUSIC FESTIVAL',
      title: 'Đại Nhạc Hội Sóng Đêm — SVĐ Mỹ Đình',
      detail: 'Laser 60W & 40W · Kinetic Balls · Timecode GrandMA3',
      summary:
        'Triển khai đồng bộ hệ thống tia Laser công suất lớn ngoài trời kết hợp ma trận Kinetic trên giàn truss chính cho 35.000 khán giả.',
      image: FIGMA_ASSETS.laser,
      route: { page: 'collection' as const, slug: 'laser' as const },
    },
    {
      num: '02 / AUTO EXHIBITION',
      title: 'Triển Lãm Ô Tô Tương Lai — SECC Quận 7',
      detail: 'Kinetic Rings · Kinetic Metal spheres',
      summary:
        'Hệ thống vòng Kinetic đa trục chuyển động mượt mà phía trên khu trưng bày xe concept suốt 10 giờ/ngày.',
      image: FIGMA_ASSETS.kineticRings,
      route: { page: 'collection' as const, slug: 'kinetic' as const },
    },
    {
      num: '03 / LIVE STAGE & TV',
      title: 'Countdown Gala — Phố Đi Bộ Nguyễn Huệ',
      detail: '60-pixel LED Matrix · Laser 30W',
      summary:
        'Tổ hợp bức tường LED Matrix hiệu ứng sóng pixel 3D không nhấp nháy trên camera truyền hình trực tiếp.',
      image: FIGMA_ASSETS.ledMatrix,
      route: { page: 'collection' as const, slug: 'led-matrix' as const },
    },
  ];

  return (
    <div>
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs text-[#9E9EA7]">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang Chủ
          </button>
          <span>/</span>
          <span className="text-white">Trường Hợp Dự Án</span>
        </div>
      </div>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-3">
          CASE STUDIES
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] mb-12">
          Trường Hợp Dự Án Tiêu Biểu
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <article
              key={c.title}
              className="bg-[#141417] border border-[#242429] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B0B0D]">
                  <ResilientImage
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase mb-2">
                    {c.num}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-white mb-2">
                    {c.title}
                  </h2>
                  <p className="text-xs text-[#E5C148] mb-3">{c.detail}</p>
                  <p className="text-sm text-[#9E9EA7] leading-relaxed">{c.summary}</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => onNavigate(c.route)}
                  className="w-full pt-4 border-t border-[#242429] flex items-center justify-between text-xs font-semibold text-white hover:text-[#E5C148] transition-colors cursor-pointer"
                >
                  <span>Xem dòng thiết bị triển khai</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E5C148]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export const FigmaInfoView: React.FC<ExtraViewProps> = ({ onNavigate }) => {
  const topics = [
    {
      num: '01 / CONTROL PROTOCOLS',
      title: 'Chuẩn điều khiển DMX512, Art-Net & Pangolin FB4',
      body: 'Toàn bộ hệ thống LED Matrix, Laser và Kinetic của SquareSnake FX hỗ trợ đồng bộ Timecode từ bàn GrandMA3, Avolites, Madrix và Pangolin Beyond qua mạng LAN tốc độ cao.',
    },
    {
      num: '02 / RIGGING & LOAD SAFETY',
      title: 'Tiêu chuẩn tải trọng Truss & Phanh từ Kinetic',
      body: 'Mỗi cụm tời Kinetic trang bị cảm biến quá tải kép, phanh điện từ tự khóa khi mất nguồn và cáp an toàn thép độc lập cho các sự kiện trong nhà lẫn ngoài trời.',
    },
    {
      num: '03 / LASER SAFETY ASSESSMENT',
      title: 'An toàn tia Laser công suất lớn 20W – 60W',
      body: 'Đội ngũ kỹ sư khảo sát cao độ lắp đặt tối thiểu, vùng quét an toàn (Audience Scanning Zone) và nút dừng khẩn cấp E-Stop trước mỗi buổi tổng duyệt.',
    },
  ];

  return (
    <div>
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs text-[#9E9EA7]">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Trang Chủ
          </button>
          <span>/</span>
          <span className="text-white">Trung Tâm Thông Tin</span>
        </div>
      </div>

      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-3">
          TECHNICAL RESOURCE CENTER
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] mb-12">
          Trung Tâm Thông Tin Kỹ Thuật
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {topics.map((t) => (
            <div key={t.num} className="bg-[#141417] border border-[#242429] p-6 sm:p-8">
              <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase mb-3">
                {t.num}
              </p>
              <h2 className="font-display text-xl font-semibold text-white mb-3">{t.title}</h2>
              <p className="text-sm text-[#9E9EA7] leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#E5C148] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B0B0D]">
              Cần Datasheet chi tiết hoặc tư vấn sơ đồ Truss?
            </h2>
            <p className="text-sm text-[#0B0B0D]/80 mt-1.5">
              Gửi thông số sân khấu để kỹ sư SquareSnake FX gửi tài liệu kỹ thuật đầy đủ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'quote' })}
            className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-[#0B0B0D] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Yêu cầu tư vấn kỹ thuật</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
