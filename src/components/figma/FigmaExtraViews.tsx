import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  DEFAULT_MEDIA_LIBRARY,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_SETTINGS,
  FIGMA_ASSETS,
} from '../../data/figmaCatalog';
import { CmsMediaItem, CmsProjectCase, SiteSettings } from '../../types/cms';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';
import { MediaStageView } from './MediaRenderer';

interface AboutViewProps {
  siteSettings?: SiteSettings;
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaAboutView: React.FC<AboutViewProps> = ({
  siteSettings = DEFAULT_SITE_SETTINGS,
  onNavigate,
}) => {
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
              {siteSettings.aboutKicker}
            </p>
            <h1
              className="font-display font-semibold text-white tracking-[-0.025em] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)' }}
            >
              {siteSettings.aboutTitleLine1}
              <br />
              {siteSettings.aboutTitleLine2}
            </h1>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed mb-8 max-w-xl whitespace-pre-line">
              {siteSettings.aboutDescription}
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
                src={siteSettings.aboutImageUrl || FIGMA_ASSETS.heroConcert}
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

interface ProjectsViewProps {
  projects?: CmsProjectCase[];
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaProjectsView: React.FC<ProjectsViewProps> = ({
  projects = DEFAULT_PROJECTS,
  onNavigate,
}) => {
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
          {projects.map((c) => (
            <article
              key={c.id}
              className="bg-[#141417] border border-[#242429] flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B0B0D]">
                  <MediaStageView
                    imageUrl={c.imageUrl}
                    videoUrl={c.videoUrl}
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
                  onClick={() => onNavigate({ page: 'collection', slug: c.slug })}
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

interface InfoViewProps {
  media?: CmsMediaItem[];
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaInfoView: React.FC<InfoViewProps> = ({
  media = DEFAULT_MEDIA_LIBRARY,
  onNavigate,
}) => {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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

        {/* Media Gallery populated by Admin uploads */}
        {media.length > 0 && (
          <div className="mb-16 pt-12 border-t border-[#1E1E24]">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-2">
              STAGE MEDIA GALLERY
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em] mb-8">
              Thư viện Hình ảnh &amp; Video Trình diễn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141417] border border-[#242429] overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-[#0B0B0D]">
                    <MediaStageView
                      imageUrl={item.type === 'image' ? item.url : ''}
                      videoUrl={item.type === 'video' ? item.url : ''}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-[#9E9EA7] mt-0.5">
                        {item.category} · {item.type === 'video' ? 'Video' : 'Hình ảnh'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Modeling & Architecture (draw.io / PlantUML) */}
        <div className="mb-16 pt-12 border-t border-[#1E1E24]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-2">
                MÔ HÌNH HÓA HỆ THỐNG · DRAW.IO &amp; PLANTUML
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[-0.02em]">
                Sơ đồ Use Case, Sitemap, Kiến trúc Client–Server &amp; ERD 4 Bảng MySQL
              </h2>
            </div>
            <a
              href="/diagrams/SquareSnake_System_Diagrams.drawio"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              <span>Tải file draw.io (4 trang)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 01 Use Case */}
            <div className="bg-[#141417] border border-[#242429] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase">
                    01 / USE CASE DIAGRAM
                  </p>
                  <a
                    href="/diagrams/01-use-case.puml"
                    download
                    className="text-xs text-[#9E9EA7] hover:text-[#E5C148] transition-colors"
                  >
                    Tải .puml ↓
                  </a>
                </div>
                <svg viewBox="0 0 560 220" className="w-full h-auto bg-[#0B0B0D] border border-[#1E1E24] p-2">
                  <rect x="130" y="14" width="300" height="192" fill="#111114" stroke="#242429" />
                  <text x="280" y="32" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="600">
                    SHOWROOM SQUARESNAKE FX
                  </text>
                  <circle cx="55" cy="70" r="12" fill="none" stroke="#E5C148" strokeWidth="1.5" />
                  <line x1="55" y1="82" x2="55" y2="118" stroke="#E5C148" strokeWidth="1.5" />
                  <line x1="37" y1="95" x2="73" y2="95" stroke="#E5C148" strokeWidth="1.5" />
                  <text x="55" y="138" textAnchor="middle" fill="#FFFFFF" fontSize="10">Khách hàng</text>

                  <circle cx="505" cy="120" r="12" fill="none" stroke="#E5C148" strokeWidth="1.5" />
                  <line x1="505" y1="132" x2="505" y2="168" stroke="#E5C148" strokeWidth="1.5" />
                  <line x1="487" y1="145" x2="523" y2="145" stroke="#E5C148" strokeWidth="1.5" />
                  <text x="505" y="188" textAnchor="middle" fill="#FFFFFF" fontSize="10">Admin CMS</text>

                  <ellipse cx="280" cy="56" rx="115" ry="15" fill="#141417" stroke="#E5C148" />
                  <text x="280" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="10">Xem LED Matrix, Laser, Kinetic</text>

                  <ellipse cx="280" cy="96" rx="115" ry="15" fill="#141417" stroke="#E5C148" />
                  <text x="280" y="100" textAnchor="middle" fill="#FFFFFF" fontSize="10">Tra cứu thông số kỹ thuật &amp; Dự án</text>

                  <ellipse cx="280" cy="136" rx="115" ry="15" fill="#18181C" stroke="#E5C148" />
                  <text x="280" y="140" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="600">Gửi yêu cầu báo giá (contacts)</text>

                  <ellipse cx="280" cy="176" rx="115" ry="15" fill="#141417" stroke="#E5C148" />
                  <text x="280" y="180" textAnchor="middle" fill="#FFFFFF" fontSize="10">CRUD Sản phẩm, Media &amp; Xử lý Inbox</text>

                  <line x1="78" y1="90" x2="165" y2="56" stroke="#E5C148" strokeOpacity="0.65" />
                  <line x1="78" y1="98" x2="165" y2="96" stroke="#E5C148" strokeOpacity="0.65" />
                  <line x1="78" y1="106" x2="165" y2="136" stroke="#E5C148" strokeOpacity="0.65" />
                  <line x1="482" y1="145" x2="395" y2="176" stroke="#E5C148" strokeOpacity="0.65" />
                  <line x1="482" y1="140" x2="395" y2="136" stroke="#E5C148" strokeOpacity="0.4" />
                </svg>
              </div>
            </div>

            {/* 02 Sitemap */}
            <div className="bg-[#141417] border border-[#242429] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase">
                    02 / WEBSITE SITEMAP
                  </p>
                  <a
                    href="/diagrams/02-sitemap.puml"
                    download
                    className="text-xs text-[#9E9EA7] hover:text-[#E5C148] transition-colors"
                  >
                    Tải .puml ↓
                  </a>
                </div>
                <svg viewBox="0 0 560 220" className="w-full h-auto bg-[#0B0B0D] border border-[#1E1E24] p-2">
                  <rect x="200" y="16" width="160" height="32" fill="#E5C148" />
                  <text x="280" y="36" textAnchor="middle" fill="#0B0B0D" fontSize="11" fontWeight="700">
                    TRANG CHỦ (HOME)
                  </text>
                  <line x1="280" y1="48" x2="280" y2="68" stroke="#E5C148" />
                  <line x1="55" y1="68" x2="505" y2="68" stroke="#E5C148" />

                  {[
                    { x: 15, label: 'Về Chúng Tôi' },
                    { x: 125, label: 'Sản Phẩm (3)' },
                    { x: 235, label: 'Dự Án' },
                    { x: 345, label: 'Thông Tin' },
                    { x: 455, label: 'Báo Giá / CMS' },
                  ].map((node) => (
                    <g key={node.label}>
                      <line x1={node.x + 45} y1="68" x2={node.x + 45} y2="86" stroke="#E5C148" />
                      <rect x={node.x} y="86" width="90" height="28" fill="#141417" stroke="#E5C148" />
                      <text x={node.x + 45} y="104" textAnchor="middle" fill="#FFFFFF" fontSize="9.5">
                        {node.label}
                      </text>
                    </g>
                  ))}

                  <line x1="170" y1="114" x2="170" y2="132" stroke="#E5C148" />
                  <line x1="85" y1="132" x2="365" y2="132" stroke="#E5C148" />
                  {[
                    { x: 25, title: 'LED Matrix', sub: '20px · 60px' },
                    { x: 165, title: 'Laser RGB', sub: '20W·30W·40W·60W' },
                    { x: 305, title: 'Kinetic (5)', sub: 'Balls·Rings·Lanterns' },
                  ].map((cat) => (
                    <g key={cat.title}>
                      <line x1={cat.x + 60} y1="132" x2={cat.x + 60} y2="148" stroke="#E5C148" />
                      <rect x={cat.x} y="148" width="120" height="46" fill="#141417" stroke="#242429" />
                      <text x={cat.x + 60} y="166" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="600">
                        {cat.title}
                      </text>
                      <text x={cat.x + 60} y="182" textAnchor="middle" fill="#9E9EA7" fontSize="9">
                        {cat.sub}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 03 Client-Server Architecture */}
            <div className="bg-[#141417] border border-[#242429] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase">
                    03 / KIẾN TRÚC CLIENT – SERVER (3 TẦNG)
                  </p>
                  <a
                    href="/diagrams/03-client-server-architecture.puml"
                    download
                    className="text-xs text-[#9E9EA7] hover:text-[#E5C148] transition-colors"
                  >
                    Tải .puml ↓
                  </a>
                </div>
                <svg viewBox="0 0 560 220" className="w-full h-auto bg-[#0B0B0D] border border-[#1E1E24] p-2">
                  <rect x="20" y="16" width="520" height="48" fill="#141417" stroke="#E5C148" />
                  <text x="280" y="36" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="700">
                    PRESENTATION LAYER (CLIENT + POSTMAN)
                  </text>
                  <text x="280" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="9.5">
                    HTML5 · CSS3 · Bootstrap 5 · JS ES6+ (Fetch API) &amp; Postman JSON Testing
                  </text>

                  <line x1="280" y1="64" x2="280" y2="86" stroke="#E5C148" strokeWidth="1.5" />
                  <text x="340" y="79" fill="#9E9EA7" fontSize="9">RESTful JSON / HTTP</text>

                  <rect x="20" y="86" width="520" height="50" fill="#141417" stroke="#E5C148" />
                  <text x="280" y="106" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="700">
                    BUSINESS LOGIC LAYER (NODE.JS v20.x &amp; EXPRESS 4.x)
                  </text>
                  <text x="280" y="123" textAnchor="middle" fill="#FFFFFF" fontSize="9.5">
                    /api/products · /api/projects · /api/contacts · Static Media (/assets, /uploads)
                  </text>

                  <line x1="280" y1="136" x2="280" y2="158" stroke="#E5C148" strokeWidth="1.5" />
                  <text x="340" y="151" fill="#9E9EA7" fontSize="9">mysql2/promise Pool</text>

                  <rect x="20" y="158" width="520" height="48" fill="#18181C" stroke="#E5C148" />
                  <text x="280" y="178" textAnchor="middle" fill="#E5C148" fontSize="10" fontWeight="700">
                    DATA LAYER (XAMPP MYSQL / PHPMYADMIN)
                  </text>
                  <text x="280" y="194" textAnchor="middle" fill="#FFFFFF" fontSize="9.5">
                    4 Bảng: categories · products · projects · contacts + Local Assets
                  </text>
                </svg>
              </div>
            </div>

            {/* 04 Database ERD */}
            <div className="bg-[#141417] border border-[#242429] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase">
                    04 / SƠ ĐỒ CSDL ERD (4 BẢNG MYSQL)
                  </p>
                  <a
                    href="/diagrams/04-database-erd.puml"
                    download
                    className="text-xs text-[#9E9EA7] hover:text-[#E5C148] transition-colors"
                  >
                    Tải .puml ↓
                  </a>
                </div>
                <svg viewBox="0 0 560 220" className="w-full h-auto bg-[#0B0B0D] border border-[#1E1E24] p-2">
                  {/* categories */}
                  <rect x="20" y="16" width="210" height="86" fill="#141417" stroke="#E5C148" />
                  <rect x="20" y="16" width="210" height="22" fill="#E5C148" />
                  <text x="125" y="31" textAnchor="middle" fill="#0B0B0D" fontSize="10.5" fontWeight="700">categories</text>
                  <text x="30" y="52" fill="#FFFFFF" fontSize="9">PK category_id : INT</text>
                  <text x="30" y="67" fill="#D4D4D8" fontSize="9">category_name, slug (UQ)</text>
                  <text x="30" y="82" fill="#9E9EA7" fontSize="9">description, created_at</text>

                  {/* 1:N relation */}
                  <line x1="230" y1="58" x2="295" y2="58" stroke="#E5C148" strokeWidth="1.5" />
                  <text x="262" y="51" textAnchor="middle" fill="#E5C148" fontSize="9.5" fontWeight="700">1 : N</text>

                  {/* products */}
                  <rect x="295" y="16" width="245" height="94" fill="#141417" stroke="#E5C148" />
                  <rect x="295" y="16" width="245" height="22" fill="#E5C148" />
                  <text x="417" y="31" textAnchor="middle" fill="#0B0B0D" fontSize="10.5" fontWeight="700">products</text>
                  <text x="305" y="52" fill="#FFFFFF" fontSize="9">PK product_id | FK category_id</text>
                  <text x="305" y="67" fill="#D4D4D8" fontSize="9">product_name, model_code (UQ)</text>
                  <text x="305" y="82" fill="#9E9EA7" fontSize="9">technical_specs (JSON), image_url</text>
                  <text x="305" y="97" fill="#9E9EA7" fontSize="9">video_demo_url, is_featured, status</text>

                  {/* projects */}
                  <rect x="20" y="122" width="240" height="84" fill="#141417" stroke="#242429" />
                  <rect x="20" y="122" width="240" height="22" fill="#18181C" />
                  <text x="140" y="137" textAnchor="middle" fill="#E5C148" fontSize="10.5" fontWeight="700">projects</text>
                  <text x="30" y="158" fill="#FFFFFF" fontSize="9">PK project_id : INT</text>
                  <text x="30" y="173" fill="#D4D4D8" fontSize="9">event_name, client_name, location</text>
                  <text x="30" y="188" fill="#9E9EA7" fontSize="9">event_date, equipment_used, thumb</text>

                  {/* contacts */}
                  <rect x="285" y="122" width="255" height="84" fill="#141417" stroke="#242429" />
                  <rect x="285" y="122" width="255" height="22" fill="#18181C" />
                  <text x="412" y="137" textAnchor="middle" fill="#E5C148" fontSize="10.5" fontWeight="700">contacts</text>
                  <text x="295" y="158" fill="#FFFFFF" fontSize="9">PK contact_id : INT</text>
                  <text x="295" y="173" fill="#D4D4D8" fontSize="9">customer_name, phone, company_agency</text>
                  <text x="295" y="188" fill="#9E9EA7" fontSize="9">interested_categories, status ENUM</text>
                </svg>
              </div>
            </div>
          </div>
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
