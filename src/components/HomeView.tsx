import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import {
  CORE_PRODUCT_LINES,
  FEATURED_PROJECTS,
  HERO_STAGE_IMAGE,
} from '../data/equipmentData';
import { ProductCategoryKey } from '../types/equipment';
import { HeroBackdropCanvas } from './HeroBackdropCanvas';
import { ResilientImage } from './ResilientImage';

interface HomeViewProps {
  onNavigateProducts: (category?: ProductCategoryKey) => void;
  onSelectProduct: (productId: string) => void;
  onNavigateProjects: () => void;
  onOpenShowreel: () => void;
  onNavigateQuote: () => void;
}

const CAPABILITY_METRICS = [
  {
    value: '200+',
    label: 'Sự kiện quy mô lớn',
    detail: 'Concert, Festival, Triển lãm toàn quốc',
  },
  {
    value: '500+',
    label: 'Thiết bị sẵn kho',
    detail: 'Đáp ứng đồng thời 4 sân khấu lớn',
  },
  {
    value: '24/7',
    label: 'Vận hành kỹ thuật',
    detail: 'Kỹ sư DMX / Madrix / FB4 trực chiến',
  },
  {
    value: '2 Kho',
    label: 'Hà Nội & TP.HCM',
    detail: 'Triển khai lắp đặt nhanh toàn quốc',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateProducts,
  onSelectProduct,
  onNavigateProjects,
  onOpenShowreel,
  onNavigateQuote,
}) => {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#263042] bg-[#0B0E14]">
        {/* Stage Photography Backdrop with Measured Scrim */}
        <div className="absolute inset-0">
          <ResilientImage
            src={HERO_STAGE_IMAGE}
            alt="Sân khấu sự kiện đêm với hệ thống Kinetic Ball, Kinetic Ring và Laser Pro của SquareSnake Việt Nam"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/85 to-[#0B0E14]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[#0B0E14]/60" />
        </div>

        {/* Subtle Laser Beam Backdrop Canvas */}
        <HeroBackdropCanvas />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-36 lg:pb-28">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium text-[#F5C518] tracking-wide mb-4">
              SquareSnake Việt Nam · Showroom Kỹ Thuật Số 24/7 · Hà Nội &amp; TP.HCM
            </p>

            <h1
              className="font-display font-extrabold text-white tracking-tight leading-[1.12] mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                textWrap: 'balance',
              }}
            >
              Giải Pháp Thiết Bị &amp; Hiệu Ứng Sân Khấu Đỉnh Cao
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mb-8">
              Chuyên cung cấp, cho thuê và trực tiếp vận hành hệ thống{' '}
              <span className="text-white font-medium">Kinetic Ball</span>,{' '}
              <span className="text-white font-medium">Kinetic Ring</span>,{' '}
              <span className="text-white font-medium">Laser Pro RGB 30W</span> và{' '}
              <span className="text-white font-medium">LED Matrix 5x5</span> cho concert, lễ hội
              âm nhạc và triển lãm công nghệ.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigateProducts('all')}
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-[8px] bg-[#F5C518] hover:bg-[#E0B312] text-[#0B0E14] text-sm font-bold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Khám phá thiết bị</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenShowreel}
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-[8px] bg-[#161B26]/90 hover:bg-[#1E2534] border border-[#263042] hover:border-[#00F0FF]/60 text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
              >
                <Play className="w-4 h-4 text-[#00F0FF] fill-[#00F0FF]" />
                <span>Xem Showreel</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 4 Core Equipment Lines */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium text-[#F5C518] mb-2">
              Hệ sinh thái thiết bị chủ lực
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              4 Dòng Thiết Bị Hiệu Ứng Sân Khấu
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateProducts('all')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00F0FF] hover:text-white transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Xem toàn bộ danh mục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_PRODUCT_LINES.map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() => onSelectProduct(line.featuredProductId)}
              className="group text-left rounded-[12px] bg-[#161B26] border border-[#263042] hover:border-[#F5C518]/75 hover:shadow-[0_0_28px_rgba(245,197,24,0.14)] overflow-hidden transition-all duration-200 flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#0B0E14] relative">
                <ResilientImage
                  src={line.imageUrl}
                  alt={line.title}
                  fallbackTitle={line.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-[#F5C518] mb-1.5">{line.keyMetric}</p>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-[#F5C518] transition-colors">
                    {line.title}
                  </h3>
                  <p className="text-xs font-medium text-white/80 mt-0.5">{line.subtitle}</p>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mt-2.5 line-clamp-3">
                    {line.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#263042] flex items-center justify-between text-xs font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                  <span>Xem cấu hình &amp; Demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Section 3: Capacity Metrics & Featured Projects Proof */}
      <section className="border-t border-[#263042] bg-[#0F131C]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          {/* 4-column Capability KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-[#263042]">
            {CAPABILITY_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[12px] bg-[#161B26] border border-[#263042] p-5"
              >
                <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5C518] tabular-nums">
                  {metric.value}
                </p>
                <p className="text-sm font-semibold text-white mt-2">{metric.label}</p>
                <p className="text-xs text-[#94A3B8] mt-1">{metric.detail}</p>
              </div>
            ))}
          </div>

          {/* Adjacent Featured Projects Proof */}
          <div className="pt-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium text-[#00F0FF] mb-2">
                  Năng lực triển khai thực chiến
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Dự Án Sân Khấu Tiêu Biểu
                </h2>
              </div>
              <button
                type="button"
                onClick={onNavigateProjects}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F5C518] hover:text-white transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Khám phá tất cả dự án</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FEATURED_PROJECTS.slice(0, 2).map((project) => (
                <article
                  key={project.id}
                  className="rounded-[12px] bg-[#161B26] border border-[#263042] overflow-hidden flex flex-col sm:flex-row items-stretch"
                >
                  <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-[#0B0E14] shrink-0">
                    <ResilientImage
                      src={project.imageUrl}
                      alt={project.title}
                      fallbackTitle={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col justify-between gap-4 flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] mb-2">
                        <span className="text-[#F5C518] font-medium">{project.eventType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{project.date}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-1">{project.location}</p>
                      <p className="text-sm text-[#94A3B8] leading-relaxed mt-3 line-clamp-3">
                        {project.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#263042] flex items-center justify-between gap-3">
                      <span className="text-xs font-mono tabular-nums text-white">
                        {project.scaleMetric}
                      </span>
                      <button
                        type="button"
                        onClick={onNavigateQuote}
                        className="text-xs font-semibold text-[#FF2A5F] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Báo giá cấu hình này
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
