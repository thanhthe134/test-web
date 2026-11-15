import React, { useMemo } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { EquipmentItem, ProductCategoryKey } from '../types/equipment';
import { ResilientImage } from './ResilientImage';

interface ProductsViewProps {
  catalog: EquipmentItem[];
  selectedCategory: ProductCategoryKey;
  searchQuery: string;
  onCategoryChange: (category: ProductCategoryKey) => void;
  onSearchChange: (query: string) => void;
  onSelectProduct: (productId: string) => void;
}

const FILTER_TABS: { key: ProductCategoryKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'kinetic', label: 'Hệ thống Kinetic' },
  { key: 'laser', label: 'Ánh sáng Laser' },
  { key: 'led-matrix', label: 'LED Matrix' },
];

export const ProductsView: React.FC<ProductsViewProps> = ({
  catalog,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSelectProduct,
}) => {
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.categoryKey === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const searchable = [
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
      return searchable.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-[#F5C518] mb-2">
          Showroom Kỹ Thuật Số 24/7
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Danh Mục Thiết Bị Sân Khấu
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-2 max-w-2xl">
          Tra cứu nhanh thông số DMX/Art-Net, hành trình cáp, công suất quang và chọn thiết bị
          để xem trình mô phỏng hiệu ứng thực tế.
        </p>
      </div>

      {/* Filter Tabs & Quick Search Bar */}
      <div className="rounded-[12px] bg-[#161B26] border border-[#263042] p-4 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Lọc theo dòng thiết bị"
          className="flex flex-wrap items-center gap-1.5"
        >
          {FILTER_TABS.map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(tab.key)}
                className={`px-4 py-2 min-h-[40px] rounded-[8px] text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] ${
                  active
                    ? 'bg-[#F5C518] text-[#0B0E14] font-semibold'
                    : 'bg-[#0B0E14] text-[#94A3B8] hover:text-white border border-[#263042]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên, công suất (30W, 12m, FB4)..."
            aria-label="Tìm kiếm thiết bị theo tên hoặc công suất"
            className="w-full min-h-[40px] pl-10 pr-9 py-2 rounded-[8px] bg-[#0B0E14] border border-[#263042] text-sm text-white placeholder-[#94A3B8]/70 focus:outline-none focus:border-[#F5C518] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-5">
        <span>
          Hiển thị{' '}
          <strong className="text-white tabular-nums">{filteredItems.length}</strong> thiết bị sẵn
          sàng vận hành tại kho Hà Nội &amp; TP.HCM
        </span>
      </div>

      {/* Product Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-[12px] bg-[#161B26] border border-[#263042] p-12 text-center">
          <p className="text-base font-semibold text-white">
            Không tìm thấy thiết bị phù hợp với "{searchQuery}"
          </p>
          <p className="text-sm text-[#94A3B8] mt-1.5">
            Thử tìm với từ khóa khác như "Kinetic", "30W", "FB4", "5x5" hoặc đặt lại bộ lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              onCategoryChange('all');
              onSearchChange('');
            }}
            className="mt-5 px-5 py-2.5 min-h-[40px] rounded-[8px] bg-[#F5C518] hover:bg-[#E0B312] text-[#0B0E14] text-sm font-semibold transition-colors cursor-pointer"
          >
            Xem tất cả thiết bị
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group rounded-[12px] bg-[#161B26] border border-[#263042] hover:border-[#F5C518]/65 hover:shadow-[0_0_24px_rgba(245,197,24,0.1)] overflow-hidden transition-all duration-200 flex flex-col"
            >
              {/* 4:3 Image Frame */}
              <button
                type="button"
                onClick={() => onSelectProduct(item.id)}
                className="aspect-[4/3] w-full overflow-hidden bg-[#0B0E14] relative cursor-pointer text-left"
                aria-label={`Xem chi tiết ${item.name}`}
              >
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.name}
                  fallbackTitle={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-transparent to-transparent opacity-60" />
              </button>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                <div>
                  {/* Clean Unboxed Metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                    <span className="text-[#F5C518] font-medium">{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{item.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">Kho: {item.stockCount} bộ</span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-white leading-snug">
                    {item.name}
                  </h2>

                  {/* 2 Highlight Technical Specs */}
                  <div className="mt-4 pt-3 border-t border-[#263042] space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#94A3B8] shrink-0">{item.highlightSpec1Label}</span>
                      <span className="font-mono tabular-nums text-white font-medium text-right truncate">
                        {item.highlightSpec1Value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-[#94A3B8] shrink-0">{item.highlightSpec2Label}</span>
                      <span className="font-mono tabular-nums text-[#00F0FF] font-medium text-right truncate">
                        {item.highlightSpec2Value}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProduct(item.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-[8px] bg-[#0B0E14] hover:bg-[#F5C518] text-white hover:text-[#0B0E14] border border-[#263042] hover:border-[#F5C518] text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
