import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppView } from '../types/equipment';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenQuote: () => void;
}

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: 'home', label: 'Trang chủ' },
  { view: 'products', label: 'Thiết bị' },
  { view: 'projects', label: 'Dự án' },
  { view: 'contact', label: 'Liên hệ' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNavActive = (view: AppView) => {
    if (view === 'products' && currentView === 'detail') return true;
    return currentView === view;
  };

  const handleLinkClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#263042]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="font-display text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] rounded cursor-pointer"
          aria-label="SquareSnake Việt Nam - Trang chủ"
        >
          <span className="text-white">SQUARE</span>
          <span className="text-[#00F0FF]">SNAKE</span>
        </button>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.view);
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleLinkClick(item.view)}
                className={`relative py-2 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] rounded ${
                  active ? 'text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#F5C518] transition-opacity duration-150 ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA button + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="px-4 py-2 min-h-[40px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Nhận báo giá
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[8px] border border-[#263042] bg-[#161B26] text-white hover:border-[#F5C518]/60 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#263042] bg-[#0B0E14] px-4 py-3">
          <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item.view);
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => handleLinkClick(item.view)}
                  className={`w-full text-left px-3 min-h-[44px] rounded-[8px] text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#161B26] text-[#F5C518]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#161B26]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
