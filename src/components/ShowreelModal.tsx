import React, { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { EquipmentSystemType } from '../types/equipment';
import { StageEffectCanvas } from './StageEffectCanvas';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreEquipment: () => void;
}

const SHOWREEL_CHAPTERS: {
  id: EquipmentSystemType;
  title: string;
  subtitle: string;
  duration: string;
}[] = [
  {
    id: 'kinetic-ball',
    title: '01. Kinetic Ball RGBW 250mm',
    subtitle: 'Sóng chuyển động 3D · 96 điểm treo đồng bộ Madrix',
    duration: '00:45',
  },
  {
    id: 'laser-pro',
    title: '02. Laser Full-Color 30W IP65',
    subtitle: 'Quét tia không gian ngoài trời · Pangolin FB4',
    duration: '00:38',
  },
  {
    id: 'kinetic-ring',
    title: '03. Kinetic Ring Double Axis 1.2m',
    subtitle: 'Vòng sáng nghiêng 360° · 3 Servo Motor độc lập',
    duration: '00:52',
  },
  {
    id: 'led-matrix',
    title: '04. LED Matrix Panel 5x5 Pixel',
    subtitle: 'Ma trận 25 bóng COB 30W · Blinder & Pixel Chase',
    duration: '00:30',
  },
];

export const ShowreelModal: React.FC<ShowreelModalProps> = ({
  isOpen,
  onClose,
  onExploreEquipment,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeChapter = SHOWREEL_CHAPTERS[activeIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="showreel-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-[12px] bg-[#161B26] border border-[#263042] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#263042]">
          <div>
            <h2 id="showreel-modal-title" className="text-lg font-bold text-white">
              Showreel Hiệu Ứng Sân Khấu SquareSnake
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Mô phỏng thời gian thực 4 hệ thống thiết bị chủ lực tại các sự kiện quy mô lớn
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-[8px] border border-[#263042] bg-[#0B0E14] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng Showreel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="p-4 sm:p-5 bg-[#0B0E14]">
          <StageEffectCanvas
            key={activeChapter.id}
            systemType={activeChapter.id}
            deviceTitle={activeChapter.title}
            initialPlaying={true}
          />
        </div>

        {/* Chapter Switcher */}
        <div className="px-5 py-4 border-t border-[#263042] bg-[#161B26]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SHOWREEL_CHAPTERS.map((ch, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`text-left p-3 rounded-[8px] border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#0B0E14] border-[#F5C518] text-white'
                      : 'bg-[#0B0E14]/50 border-[#263042] text-[#94A3B8] hover:text-white hover:border-[#384660]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">{ch.title}</span>
                    <span className="text-[11px] font-mono tabular-nums text-[#F5C518] shrink-0">
                      {ch.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1">{ch.subtitle}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#263042] flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#94A3B8]">
              Đang phát: <span className="text-white font-medium">{activeChapter.subtitle}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onExploreEquipment();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-[8px] bg-[#FF2A5F] hover:bg-[#E01E4F] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Xem toàn bộ danh mục thiết bị</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
