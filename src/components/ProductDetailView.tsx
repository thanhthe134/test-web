import React, { useState } from 'react';
import { ArrowLeft, Cpu, GitBranch, PlayCircle, Sparkles } from 'lucide-react';
import { HERO_STAGE_IMAGE } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { MotorCutawayDiagram, TrussRiggingDiagram } from './EngineeringDiagrams';
import { ResilientImage } from './ResilientImage';
import { StageEffectCanvas } from './StageEffectCanvas';

interface ProductDetailViewProps {
  equipment: EquipmentItem;
  catalog: EquipmentItem[];
  onBackToCatalog: () => void;
  onRequestQuoteForItem: (equipment: EquipmentItem) => void;
  onSelectProduct: (productId: string) => void;
}

type MediaTabKey = 'demo' | 'motor' | 'truss' | 'live';

const MEDIA_THUMBNAILS: {
  key: MediaTabKey;
  label: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: 'demo',
    label: 'Video Demo',
    caption: 'Mô phỏng DMX thực tế',
    icon: PlayCircle,
  },
  {
    key: 'motor',
    label: 'Cấu tạo Motor',
    caption: 'Bản vẽ kỹ thuật chi tiết',
    icon: Cpu,
  },
  {
    key: 'truss',
    label: 'Sơ đồ treo Truss',
    caption: 'Tải trọng & cáp an toàn',
    icon: GitBranch,
  },
  {
    key: 'live',
    label: 'Sự kiện thực tế',
    caption: 'Hình ảnh vận hành show',
    icon: Sparkles,
  },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  equipment,
  catalog,
  onBackToCatalog,
  onRequestQuoteForItem,
  onSelectProduct,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<MediaTabKey>('demo');

  const relatedItems = catalog.filter(
    (item) => item.id !== equipment.id && item.categoryKey === equipment.categoryKey
  ).slice(0, 2);

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Breadcrumb Back Action */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Danh mục thiết bị</span>
        </button>
      </div>

      {/* Main 2-Column Technical Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Media Demo + 4 Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          {activeMediaTab === 'demo' && (
            <StageEffectCanvas
              key={equipment.id}
              systemType={equipment.systemType}
              deviceTitle={equipment.name}
              initialPlaying={false}
            />
          )}

          {activeMediaTab === 'motor' && <MotorCutawayDiagram equipment={equipment} />}

          {activeMediaTab === 'truss' && <TrussRiggingDiagram equipment={equipment} />}

          {activeMediaTab === 'live' && (
            <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-[#0B0E14] border border-[#263042]">
              <ResilientImage
                src={equipment.id.includes('30w') ? HERO_STAGE_IMAGE : equipment.imageUrl}
                alt={`${equipment.name} trong sự kiện thực tế`}
                fallbackTitle={equipment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0B0E14]/90 via-[#0B0E14]/40 to-transparent p-5">
                <p className="text-xs font-mono text-[#F5C518]">ẢNH THỰC TẾ TẠI HIỆN TRƯỜNG</p>
                <p className="text-sm text-white font-medium mt-1">
                  {equipment.name} vận hành đồng bộ trong hệ thống ánh sáng sân khấu SquareSnake
                </p>
              </div>
            </div>
          )}

          {/* 4 Interactive Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MEDIA_THUMBNAILS.map((thumb) => {
              const Icon = thumb.icon;
              const selected = activeMediaTab === thumb.key;
              return (
                <button
                  key={thumb.key}
                  type="button"
                  onClick={() => setActiveMediaTab(thumb.key)}
                  className={`text-left p-3 rounded-[10px] border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] ${
                    selected
                      ? 'bg-[#161B26] border-[#F5C518] text-white shadow-[0_0_16px_rgba(245,197,24,0.12)]'
                      : 'bg-[#161B26]/60 border-[#263042] text-[#94A3B8] hover:text-white hover:border-[#384660]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        selected ? 'text-[#F5C518]' : 'text-[#00F0FF]'
                      }`}
                    />
                    <span className="text-xs font-semibold truncate">{thumb.label}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] truncate">{thumb.caption}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Classification, Description, Technical Specs Table & CTA */}
        <div className="lg:col-span-5 rounded-[12px] bg-[#161B26] border border-[#263042] p-6 sm:p-7">
          {/* Unboxed Category Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8] mb-3">
            <span className="text-[#F5C518] font-semibold">{equipment.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Mã thiết bị: {equipment.code}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-[#00F0FF]">
              Sẵn kho {equipment.stockCount} bộ
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {equipment.name}
          </h1>

          <p className="text-sm text-white/90 font-medium mt-2">{equipment.tagline}</p>

          <p className="text-sm text-[#94A3B8] leading-relaxed mt-4">{equipment.description}</p>

          {/* Stage Application Block */}
          <div className="mt-5 pt-5 border-t border-[#263042]">
            <h2 className="text-xs font-semibold text-[#F5C518] uppercase tracking-wider mb-2">
              Ứng dụng sân khấu thực tế
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {equipment.stageApplication}
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div className="mt-6 pt-5 border-t border-[#263042]">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Bảng thông số kỹ thuật chi tiết
            </h2>
            <div className="divide-y divide-[#263042] border-y border-[#263042]">
              {equipment.specs.map((row) => (
                <div
                  key={row.label}
                  className="py-2.5 flex items-baseline justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="text-[#94A3B8] shrink-0">{row.label}</span>
                  <span className="font-mono tabular-nums text-white text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Conversion CTA */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onRequestQuoteForItem(equipment)}
              className="w-full py-3.5 px-6 min-h-[48px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] text-white text-sm font-bold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Đăng ký báo giá thiết bị này
            </button>
            <p className="text-xs text-[#94A3B8] text-center mt-2.5">
              Hỗ trợ kỹ sư khảo sát mặt bằng &amp; dựng mô phỏng 3D miễn phí trong 24h
            </p>
          </div>
        </div>
      </div>

      {/* Related Devices in Same Category */}
      {relatedItems.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#263042]">
          <h2 className="font-display text-xl font-bold text-white mb-6">
            Thiết bị cùng phân hệ {equipment.categoryLabel}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedItems.map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => {
                  setActiveMediaTab('demo');
                  onSelectProduct(rel.id);
                }}
                className="text-left rounded-[12px] bg-[#161B26] border border-[#263042] hover:border-[#F5C518]/60 p-4 flex items-center gap-4 transition-colors cursor-pointer"
              >
                <div className="w-28 aspect-[4/3] rounded-[8px] overflow-hidden bg-[#0B0E14] shrink-0">
                  <ResilientImage
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[#F5C518]">{rel.code}</p>
                  <h3 className="font-display text-base font-bold text-white truncate mt-0.5">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 truncate">{rel.tagline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
