import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/equipmentData';
import { ProductCategoryKey, ProjectCase } from '../types/equipment';
import { ResilientImage } from './ResilientImage';

interface ProjectsViewProps {
  onNavigateProducts: (category: ProductCategoryKey) => void;
  onRequestProjectQuote: (project: ProjectCase) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onNavigateProducts,
  onRequestProjectQuote,
}) => {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="mb-10">
        <p className="text-xs font-medium text-[#00F0FF] mb-2">
          Hồ sơ năng lực thực tế
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Dự Án Triển Khai Tiêu Biểu
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-2 max-w-2xl">
          Từ đại nhạc hội ngoài trời 50.000 khán giả đến triển lãm công nghệ và gala truyền hình
          trực tiếp, SquareSnake Việt Nam đảm nhận trọn gói thiết kế hiệu ứng, lắp đặt truss và
          vận hành Timecode 24/7.
        </p>
      </div>

      <div className="space-y-8">
        {FEATURED_PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="rounded-[12px] bg-[#161B26] border border-[#263042] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            {/* Image Container */}
            <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto bg-[#0B0E14] relative">
              <ResilientImage
                src={project.imageUrl}
                alt={project.title}
                fallbackTitle={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/70 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] mb-3">
                  <span className="font-mono text-[#F5C518] font-semibold">
                    0{index + 1}. {project.eventType}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{project.date}</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  {project.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{project.location}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-white">
                    Sân khấu: {project.stageDimension}
                  </span>
                </div>

                <p className="text-sm text-[#94A3B8] leading-relaxed mt-4">{project.summary}</p>

                {/* Equipment Manifest */}
                <div className="mt-5 pt-4 border-t border-[#263042]">
                  <p className="text-xs font-semibold text-white mb-2">
                    Cấu hình thiết bị đã triển khai
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {project.equipmentUsed.map((eq) => (
                      <li
                        key={eq}
                        className="text-xs font-mono tabular-nums text-[#94A3B8] bg-[#0B0E14] border border-[#263042] rounded-[8px] px-3 py-2"
                      >
                        {eq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#263042] flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-semibold text-[#F5C518] tabular-nums">
                  {project.scaleMetric}
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateProducts(project.linkedCategory)}
                    className="px-4 py-2 min-h-[40px] rounded-[8px] border border-[#263042] bg-[#0B0E14] hover:border-[#00F0FF]/70 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Xem thiết bị liên quan
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestProjectQuote(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Yêu cầu cấu hình tương tự</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
