import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { CollectionSlug } from '../../data/figmaCatalog';

export type FigmaRoute =
  | { page: 'home' }
  | { page: 'about' }
  | { page: 'collection'; slug: CollectionSlug }
  | { page: 'detail'; modelId: string }
  | { page: 'projects' }
  | { page: 'info' }
  | { page: 'quote'; prefillModel?: string };

interface FigmaHeaderProps {
  route: FigmaRoute;
  activeCollectionSlug?: CollectionSlug;
  onNavigate: (next: FigmaRoute) => void;
}

type DropdownKey = 'about' | 'products' | 'info' | null;

export const SquareSnakeLogoMark: React.FC = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d="M18 3L30 10L24 13.5L18 10L12 13.5L6 10L18 3Z" fill="#F4F4F5" />
    <path
      d="M6 11.5L17 17.8V32.5L6 26.2V21.5L12.8 25.4V22.4L6 18.5V11.5Z"
      fill="#E5C148"
    />
    <path
      d="M30 11.5L19 17.8V32.5L30 26.2V21.5L23.2 25.4V22.4L30 18.5V11.5Z"
      fill="#C9A233"
    />
  </svg>
);

export const FigmaHeader: React.FC<FigmaHeaderProps> = ({
  route,
  onNavigate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGo = (next: FigmaRoute) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    onNavigate(next);
  };

  const isHomeActive = route.page === 'home';
  const isAboutActive = route.page === 'about';
  const isProductsActive = route.page === 'collection' || route.page === 'detail';
  const isProjectsActive = route.page === 'projects';
  const isInfoActive = route.page === 'info';

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-[#0B0B0D]/95 backdrop-blur-md border-b border-[#1E1E24]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between gap-6">
        {/* Zone 1: Logo Mark + Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleGo({ page: 'home' })}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C148]"
        >
          <SquareSnakeLogoMark />
          <span className="text-[15px] sm:text-base font-bold tracking-[0.06em] text-white uppercase">
            SQUARESNAKE FX
          </span>
        </button>

        {/* Zone 2: 5 Vietnamese Navigation Items matching screenshot */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-8"
        >
          {/* 1. Trang Chủ */}
          <button
            type="button"
            onClick={() => handleGo({ page: 'home' })}
            className={`relative py-2 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isHomeActive ? 'text-[#E5C148]' : 'text-[#E4E4E7] hover:text-white'
            }`}
          >
            <span>Trang Chủ</span>
            {isHomeActive && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-7 h-[2.5px] bg-[#E5C148]" />
            )}
          </button>

          {/* 2. Về Chúng Tôi ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('about')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) => (prev === 'about' ? null : 'about'))
              }
              className={`relative py-2 inline-flex items-center gap-1 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isAboutActive ? 'text-[#E5C148]' : 'text-[#E4E4E7] hover:text-white'
              }`}
              aria-expanded={openDropdown === 'about'}
            >
              <span>Về Chúng Tôi</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              {isAboutActive && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-7 h-[2.5px] bg-[#E5C148]" />
              )}
            </button>

            {openDropdown === 'about' && (
              <div className="absolute left-0 top-full pt-1 w-56">
                <div className="bg-[#141417] border border-[#242429] py-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'about' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors cursor-pointer"
                  >
                    Giới thiệu SquareSnake FX
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'quote' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors cursor-pointer"
                  >
                    Liên hệ &amp; Đặt lịch khảo sát
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Các Sản Phẩm ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('products')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) => (prev === 'products' ? null : 'products'))
              }
              className={`relative py-2 inline-flex items-center gap-1 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isProductsActive ? 'text-[#E5C148]' : 'text-[#E4E4E7] hover:text-white'
              }`}
              aria-expanded={openDropdown === 'products'}
            >
              <span>Các Sản Phẩm</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              {isProductsActive && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-7 h-[2.5px] bg-[#E5C148]" />
              )}
            </button>

            {openDropdown === 'products' && (
              <div className="absolute left-0 top-full pt-1 w-60">
                <div className="bg-[#141417] border border-[#242429] py-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'collection', slug: 'led-matrix' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>LED Matrix (20px / 60px)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'collection', slug: 'laser' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Laser (20W / 30W / 40W / 60W)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'collection', slug: 'kinetic' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Kinetic (Balls / Rings / Lanterns)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Trường Hợp Dự Án */}
          <button
            type="button"
            onClick={() => handleGo({ page: 'projects' })}
            className={`relative py-2 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isProjectsActive ? 'text-[#E5C148]' : 'text-[#E4E4E7] hover:text-white'
            }`}
          >
            <span>Trường Hợp Dự Án</span>
            {isProjectsActive && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-7 h-[2.5px] bg-[#E5C148]" />
            )}
          </button>

          {/* 5. Trung Tâm Thông Tin ▾ */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('info')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) => (prev === 'info' ? null : 'info'))
              }
              className={`relative py-2 inline-flex items-center gap-1 text-[14px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isInfoActive ? 'text-[#E5C148]' : 'text-[#E4E4E7] hover:text-white'
              }`}
              aria-expanded={openDropdown === 'info'}
            >
              <span>Trung Tâm Thông Tin</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              {isInfoActive && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-7 h-[2.5px] bg-[#E5C148]" />
              )}
            </button>

            {openDropdown === 'info' && (
              <div className="absolute right-0 top-full pt-1 w-60">
                <div className="bg-[#141417] border border-[#242429] py-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'info' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors cursor-pointer"
                  >
                    Tài liệu DMX / Art-Net &amp; An toàn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo({ page: 'quote' })}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#D4D4D8] hover:text-[#E5C148] hover:bg-[#1C1C21] transition-colors cursor-pointer"
                  >
                    Yêu cầu báo giá dự án
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary CTA Button + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleGo({ page: 'quote' })}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[40px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-[13px] font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Request a quote</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 border border-[#242429] bg-[#141417] text-white cursor-pointer"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#1E1E24] bg-[#0B0B0D] px-5 py-4 space-y-1">
          <button
            type="button"
            onClick={() => handleGo({ page: 'home' })}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer ${
              isHomeActive ? 'text-[#E5C148] bg-[#141417]' : 'text-[#E4E4E7]'
            }`}
          >
            Trang Chủ
          </button>
          <button
            type="button"
            onClick={() => handleGo({ page: 'about' })}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer ${
              isAboutActive ? 'text-[#E5C148] bg-[#141417]' : 'text-[#E4E4E7]'
            }`}
          >
            Về Chúng Tôi
          </button>
          <div className="pl-3 space-y-1 border-l border-[#242429] ml-3 my-1">
            <p className="text-[11px] text-[#9E9EA7] uppercase tracking-wider px-3 pt-1">
              Các Sản Phẩm
            </p>
            <button
              type="button"
              onClick={() => handleGo({ page: 'collection', slug: 'led-matrix' })}
              className="w-full text-left px-3 py-2 text-sm text-[#D4D4D8] hover:text-[#E5C148] cursor-pointer"
            >
              LED Matrix
            </button>
            <button
              type="button"
              onClick={() => handleGo({ page: 'collection', slug: 'laser' })}
              className="w-full text-left px-3 py-2 text-sm text-[#D4D4D8] hover:text-[#E5C148] cursor-pointer"
            >
              Laser
            </button>
            <button
              type="button"
              onClick={() => handleGo({ page: 'collection', slug: 'kinetic' })}
              className="w-full text-left px-3 py-2 text-sm text-[#D4D4D8] hover:text-[#E5C148] cursor-pointer"
            >
              Kinetic
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleGo({ page: 'projects' })}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer ${
              isProjectsActive ? 'text-[#E5C148] bg-[#141417]' : 'text-[#E4E4E7]'
            }`}
          >
            Trường Hợp Dự Án
          </button>
          <button
            type="button"
            onClick={() => handleGo({ page: 'info' })}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer ${
              isInfoActive ? 'text-[#E5C148] bg-[#141417]' : 'text-[#E4E4E7]'
            }`}
          >
            Trung Tâm Thông Tin
          </button>
        </div>
      )}
    </header>
  );
};
