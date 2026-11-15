import React from 'react';
import { Facebook, Instagram, Mail, Youtube } from 'lucide-react';
import { CollectionSlug, DEFAULT_SITE_SETTINGS } from '../../data/figmaCatalog';
import { SiteSettings } from '../../types/cms';
import { FigmaRoute } from './FigmaHeader';

interface FigmaFooterProps {
  route: FigmaRoute;
  detailCollectionSlug?: CollectionSlug;
  detailCollectionName?: string;
  siteSettings?: SiteSettings;
  onNavigate: (next: FigmaRoute) => void;
}

const PRODUCT_LINKS: { label: string; route: FigmaRoute }[] = [
  { label: 'LED Matrix 20-pixel', route: { page: 'detail', modelId: 'led-matrix-20-pixel' } },
  { label: 'LED Matrix 60-pixel', route: { page: 'detail', modelId: 'led-matrix-60-pixel' } },
  { label: 'Ánh sáng Laser 20W – 60W', route: { page: 'collection', slug: 'laser' } },
  { label: 'Kinetic Balls', route: { page: 'detail', modelId: 'kinetic-balls' } },
  { label: 'Kinetic Rings', route: { page: 'detail', modelId: 'kinetic-rings' } },
  { label: 'Kinetic Lanterns', route: { page: 'detail', modelId: 'kinetic-lanterns' } },
  { label: 'Kinetic Milk-drop', route: { page: 'detail', modelId: 'kinetic-milk-drop' } },
  { label: 'Kinetic Metal spheres', route: { page: 'detail', modelId: 'kinetic-metal-spheres' } },
];

const QUICK_LINKS: { label: string; route: FigmaRoute }[] = [
  { label: 'Trang chủ', route: { page: 'home' } },
  { label: 'Về chúng tôi', route: { page: 'about' } },
  { label: 'Trường hợp dự án', route: { page: 'projects' } },
  { label: 'Trung tâm thông tin', route: { page: 'info' } },
  { label: 'Liên hệ với chúng tôi', route: { page: 'quote' } },
  { label: 'Quản trị CMS (Admin)', route: { page: 'admin' } },
];

export const FigmaFooter: React.FC<FigmaFooterProps> = ({
  siteSettings = DEFAULT_SITE_SETTINGS,
  onNavigate,
}) => {
  return (
    <footer className="bg-gradient-to-br from-[#231F1D] via-[#1B1B1E] to-[#141417] border-t border-[#242429] text-white">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">
        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-14">
          {/* Column 1: Company Name & Mission */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-display text-lg font-bold tracking-wide text-[#E5C148] uppercase leading-snug">
              {siteSettings.companyName}
            </h2>
            <p className="text-sm text-[#D4D4D8] leading-relaxed">
              {siteSettings.footerDescription}
            </p>
          </div>

          {/* Column 2: SẢN PHẨM */}
          <div className="lg:col-span-3 lg:pl-6">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wide mb-4">
              SẢN PHẨM
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D4D4D8]">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="hover:text-[#E5C148] transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: LIÊN KẾT NHANH */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wide mb-4">
              LIÊN KẾT NHANH
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D4D4D8]">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="hover:text-[#E5C148] transition-colors text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: LIÊN HỆ VỚI CHÚNG TÔI */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wide mb-4">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h3>
            <p className="text-sm text-[#D4D4D8] tabular-nums">
              Điện thoại: {siteSettings.phone}
            </p>
            <p className="text-sm text-[#D4D4D8] tabular-nums">
              Zalo / WhatsApp: {siteSettings.zalo}
            </p>
            <p className="text-sm text-[#D4D4D8]">
              E-mail:{' '}
              <a
                href={`mailto:${siteSettings.email}`}
                className="hover:text-[#E5C148] transition-colors"
              >
                {siteSettings.email}
              </a>
            </p>
            <p className="text-sm text-[#D4D4D8] leading-relaxed">
              Địa chỉ: {siteSettings.address}
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'quote' })}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Liên hệ với chúng tôi</span>
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Social Row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#D4D4D8]">
            © Bản quyền 2026 SquareSnake FX Việt Nam. Mọi quyền được bảo lưu.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate({ page: 'projects' })}
              aria-label="Facebook SquareSnake FX"
              className="w-9 h-9 rounded-full border border-white/60 hover:border-[#E5C148] text-white hover:text-[#E5C148] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'info' })}
              aria-label="YouTube SquareSnake FX"
              className="w-9 h-9 rounded-full border border-white/60 hover:border-[#E5C148] text-white hover:text-[#E5C148] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Youtube className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'quote' })}
              aria-label="Instagram SquareSnake FX"
              className="w-9 h-9 rounded-full border border-white/60 hover:border-[#E5C148] text-white hover:text-[#E5C148] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
