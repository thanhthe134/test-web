import React from 'react';
import { AppView } from '../types/equipment';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#263042] bg-[#0B0E14]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#263042]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-xl font-extrabold tracking-tight cursor-pointer"
            >
              <span className="text-white">SQUARE</span>
              <span className="text-[#00F0FF]">SNAKE</span>
            </button>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Công ty SquareSnake Việt Nam — Đơn vị cung cấp, cho thuê và trực tiếp vận hành giải
              pháp thiết bị hiệu ứng sân khấu Kinetic, Laser Pro và LED Matrix chuyên nghiệp.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Danh mục thiết bị
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dự án tiêu biểu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Liên hệ &amp; Báo giá
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#00F0FF] transition-colors cursor-pointer"
                >
                  Quản trị hệ thống (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Warehouses */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Liên hệ trực tiếp 24/7
            </h3>
            <div className="space-y-2 text-sm text-[#94A3B8]">
              <p>
                Hotline kỹ thuật:{' '}
                <a
                  href="tel:0909886247"
                  className="text-white font-mono tabular-nums hover:text-[#00F0FF] transition-colors"
                >
                  0909 886 247
                </a>
              </p>
              <p>Email: baogia@squaresnake.vn</p>
              <p className="text-xs leading-relaxed">
                Kho Hà Nội: KCN Thạch Bàn, Long Biên, Hà Nội
              </p>
              <p className="text-xs leading-relaxed">
                Kho TP.HCM: 88 Nguyễn Văn Linh, Quận 7, TP.HCM
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <p>© 2026 Công ty TNHH SquareSnake Việt Nam. Bảo lưu mọi quyền.</p>
          <p>Showroom Kỹ thuật số 24/7 · Kinetic · Laser Pro · LED Matrix</p>
        </div>
      </div>
    </footer>
  );
};
