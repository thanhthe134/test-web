import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { EquipmentSystemType } from '../types/equipment';

interface StageEffectCanvasProps {
  systemType: EquipmentSystemType;
  deviceTitle: string;
  initialPlaying?: boolean;
}

const PATTERN_PRESETS: Record<EquipmentSystemType, { id: string; label: string }[]> = {
  'kinetic-ball': [
    { id: 'wave', label: 'Sóng Sin 3D' },
    { id: 'helix', label: 'Xoắn Ốc DMX' },
    { id: 'pulse', label: 'Nhịp Bass Drop' },
  ],
  'kinetic-ring': [
    { id: 'tilt', label: 'Nghiêng Đa Trục' },
    { id: 'cascade', label: 'Thác Ánh Sáng' },
    { id: 'sync', label: 'Đồng Tâm 360°' },
  ],
  'laser-pro': [
    { id: 'fan', label: 'Quét Tia Fan' },
    { id: 'tunnel', label: 'Hầm Không Gian' },
    { id: 'matrix', label: 'Lưới Laser FB4' },
  ],
  'led-matrix': [
    { id: 'chase', label: 'Chạy Pixel 5×5' },
    { id: 'blinder', label: 'Chớp Blinder Ấm' },
    { id: 'diagonal', label: 'Sóng Chéo Art-Net' },
  ],
};

export const StageEffectCanvas: React.FC<StageEffectCanvasProps> = ({
  systemType,
  deviceTitle,
  initialPlaying = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [patternIdx, setPatternIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const patterns = PATTERN_PRESETS[systemType];

  useEffect(() => {
    setPatternIdx(0);
    setElapsedSec(0);
  }, [systemType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTs = performance.now();
    let simTime = 1.8;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      if (isPlaying) {
        simTime += dt;
        setElapsedSec((prev) => prev + dt);
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Deep stage background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#07090D');
      bg.addColorStop(0.65, '#0B0E14');
      bg.addColorStop(1, '#121826');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle overhead truss grid bar
      ctx.fillStyle = '#1E2636';
      ctx.fillRect(w * 0.08, 22, w * 0.84, 8);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let x = w * 0.1; x < w * 0.9; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 22);
        ctx.lineTo(x + 12, 30);
        ctx.stroke();
      }

      if (systemType === 'kinetic-ball') {
        const cols = 12;
        const rows = 3;
        const startX = w * 0.14;
        const spanX = w * 0.72;

        for (let r = 0; r < rows; r++) {
          const depthScale = 0.75 + r * 0.15;
          for (let c = 0; c < cols; c++) {
            const x = startX + (c / (cols - 1)) * spanX + (r - 1) * 8;
            let dropOffset = 0;
            if (patternIdx === 0) {
              dropOffset = Math.sin(simTime * 2.2 + c * 0.55 + r * 0.8) * 52;
            } else if (patternIdx === 1) {
              dropOffset = Math.cos(simTime * 2.6 + c * 0.85 - r * 1.1) * 58;
            } else {
              const beat = Math.abs(Math.sin(simTime * 3.1));
              dropOffset = (c % 2 === 0 ? 1 : -1) * beat * 45;
            }

            const ballY = h * 0.44 + r * 16 + dropOffset;
            const radius = 9.5 * depthScale;

            // Steel cable
            ctx.beginPath();
            ctx.moveTo(x, 30);
            ctx.lineTo(x, ballY - radius);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Color mix between Stage Gold and Electric Cyan
            const phase = (Math.sin(simTime * 1.8 + c * 0.4 + r * 0.7) + 1) / 2;
            const color = phase > 0.48 ? '#F5C518' : '#00F0FF';
            const glowColor =
              phase > 0.48 ? 'rgba(245, 197, 24, 0.45)' : 'rgba(0, 240, 255, 0.45)';

            const glow = ctx.createRadialGradient(x, ballY, 1, x, ballY, radius * 2.8);
            glow.addColorStop(0, glowColor);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, ballY, radius * 2.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, ballY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x - radius * 0.25, ballY - radius * 0.25, radius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.fill();
          }
        }
      } else if (systemType === 'kinetic-ring') {
        const ringCount = 5;
        for (let i = 0; i < ringCount; i++) {
          const cx = w * (0.2 + i * 0.15);
          let cy = h * 0.5;
          let tiltAngle = 0;

          if (patternIdx === 0) {
            cy = h * 0.48 + Math.sin(simTime * 1.9 + i * 0.9) * 44;
            tiltAngle = Math.sin(simTime * 1.5 + i * 0.7) * 0.52;
          } else if (patternIdx === 1) {
            cy = h * 0.36 + ((i * 22 + Math.sin(simTime * 2 + i) * 32) % 90);
            tiltAngle = Math.cos(simTime * 1.8 + i * 0.5) * 0.4;
          } else {
            cy = h * 0.5 + Math.sin(simTime * 2.4) * 35;
            tiltAngle = (i - 2) * 0.16 * Math.sin(simTime * 2);
          }

          const rx = 56;
          const ry = Math.max(12, 22 + Math.abs(Math.sin(simTime + i)) * 14);

          // 3 hoist cables per ring
          const anchors = [-rx * 0.8, 0, rx * 0.8];
          anchors.forEach((ax) => {
            const rotX = ax * Math.cos(tiltAngle);
            const rotY = ax * Math.sin(tiltAngle);
            ctx.beginPath();
            ctx.moveTo(cx + ax, 30);
            ctx.lineTo(cx + rotX, cy + rotY);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(tiltAngle);

          // Ring glow
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(245, 197, 24, 0.25)' : 'rgba(0, 240, 255, 0.25)';
          ctx.lineWidth = 12;
          ctx.stroke();

          // Core pixel ring
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = i % 2 === 0 ? '#F5C518' : '#00F0FF';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner pixel segments
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            rx,
            ry,
            0,
            simTime * 2 + i,
            simTime * 2 + i + Math.PI * 0.75
          );
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4.5;
          ctx.stroke();

          ctx.restore();
        }
      } else if (systemType === 'laser-pro') {
        const emitters = [
          { x: w * 0.25, y: 34 },
          { x: w * 0.5, y: 34 },
          { x: w * 0.75, y: 34 },
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        if (patternIdx === 0) {
          // Volumetric fan beams
          emitters.forEach((em, eIdx) => {
            const beamCount = 9;
            for (let b = 0; b < beamCount; b++) {
              const offset = Math.sin(simTime * 2.4 + eIdx * 1.1) * 0.32;
              const angle = Math.PI * 0.5 + (b - 4) * 0.13 + offset;
              const len = h * 1.15;
              const ex = em.x + Math.cos(angle) * len;
              const ey = em.y + Math.sin(angle) * len;

              const color =
                (b + eIdx) % 3 === 0
                  ? 'rgba(0, 240, 255, 0.85)'
                  : (b + eIdx) % 3 === 1
                  ? 'rgba(245, 197, 24, 0.8)'
                  : 'rgba(255, 42, 95, 0.72)';

              const grad = ctx.createLinearGradient(em.x, em.y, ex, ey);
              grad.addColorStop(0, color);
              grad.addColorStop(0.75, color.replace(/0\.\d+\)/, '0.12)'));
              grad.addColorStop(1, 'rgba(0,0,0,0)');

              ctx.beginPath();
              ctx.moveTo(em.x, em.y);
              ctx.lineTo(ex, ey);
              ctx.strokeStyle = grad;
              ctx.lineWidth = 2.4;
              ctx.stroke();
            }
          });
        } else if (patternIdx === 1) {
          // Volumetric laser cone tunnel
          const cx = w * 0.5;
          const cy = h * 0.58;
          const rings = 14;
          for (let i = 0; i < rings; i++) {
            const p = ((i / rings + simTime * 0.35) % 1);
            const r = p * Math.min(w, h) * 0.42;
            ctx.beginPath();
            ctx.ellipse(cx, cy, r * 1.35, r * 0.72, simTime * 0.3, 0, Math.PI * 2);
            ctx.strokeStyle =
              i % 2 === 0
                ? `rgba(0, 240, 255, ${(1 - p) * 0.9})`
                : `rgba(245, 197, 24, ${(1 - p) * 0.85})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        } else {
          // Crossed laser grid
          for (let i = 0; i < 11; i++) {
            const lx = w * (0.1 + i * 0.08);
            const rx = w * (0.9 - i * 0.08) + Math.sin(simTime * 3 + i) * 28;
            ctx.beginPath();
            ctx.moveTo(w * 0.5, 34);
            ctx.lineTo(lx, h);
            ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.65)' : 'rgba(245, 197, 24, 0.65)';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(w * 0.25, 34);
            ctx.lineTo(rx, h);
            ctx.strokeStyle = 'rgba(255, 42, 95, 0.45)';
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }
        }
        ctx.restore();
      } else {
        // LED Matrix 5x5 Modular Panels
        const panelCols = 3;
        const panelSize = Math.min(w * 0.2, h * 0.48);
        const gap = 18;
        const totalW = panelCols * panelSize + (panelCols - 1) * gap;
        const startX = (w - totalW) / 2;
        const startY = (h - panelSize) / 2 + 12;

        for (let p = 0; p < panelCols; p++) {
          const px = startX + p * (panelSize + gap);
          ctx.fillStyle = '#0D1119';
          ctx.strokeStyle = '#263042';
          ctx.lineWidth = 2;
          ctx.fillRect(px, startY, panelSize, panelSize);
          ctx.strokeRect(px, startY, panelSize, panelSize);

          const cell = panelSize / 5;
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
              const cx = px + c * cell + cell / 2;
              const cy = startY + r * cell + cell / 2;
              let intensity = 0.2;

              if (patternIdx === 0) {
                const idx = p * 25 + r * 5 + c;
                intensity = Math.max(0.1, Math.sin(simTime * 4 - idx * 0.22));
              } else if (patternIdx === 1) {
                intensity = 0.55 + 0.45 * Math.sin(simTime * 5 + p * 1.2);
              } else {
                intensity = Math.max(0.1, Math.cos(simTime * 3.5 - (r + c + p * 2) * 0.5));
              }

              if (intensity > 0.35) {
                const halo = ctx.createRadialGradient(cx, cy, 1, cx, cy, cell * 0.65);
                halo.addColorStop(0, `rgba(245, 197, 24, ${intensity * 0.75})`);
                halo.addColorStop(1, 'rgba(245, 197, 24, 0)');
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(cx, cy, cell * 0.65, 0, Math.PI * 2);
                ctx.fill();
              }

              ctx.beginPath();
              ctx.arc(cx, cy, cell * 0.28, 0, Math.PI * 2);
              ctx.fillStyle =
                intensity > 0.75
                  ? '#FFF7D6'
                  : intensity > 0.3
                  ? `rgba(245, 197, 24, ${0.35 + intensity * 0.65})`
                  : '#1E2534';
              ctx.fill();
            }
          }
        }
      }

      // Subtle stage floor reflection line
      ctx.fillStyle = 'rgba(245, 197, 24, 0.08)';
      ctx.fillRect(0, h - 4, w, 4);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [systemType, isPlaying, patternIdx]);

  const formattedTime = `00:${String(Math.floor(elapsedSec) % 60).padStart(2, '0')}`;

  return (
    <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-[#07090D] border border-[#263042]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-label={`Mô phỏng hiệu ứng sân khấu trực quan cho ${deviceTitle}`}
      />

      {/* Central Play Overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-[#0B0E14]/50 flex flex-col items-center justify-center gap-3 p-4">
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="w-16 h-16 rounded-full bg-[#FF2A5F] hover:bg-[#E01E4F] text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Phát Video Demo hiệu ứng"
          >
            <Play className="w-7 h-7 fill-white ml-0.5" />
          </button>
          <span className="text-sm font-medium text-white">
            Nhấn để chạy mô phỏng hiệu ứng thực tế
          </span>
        </div>
      )}

      {/* Bottom Interactive Control Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0B0E14]/95 via-[#0B0E14]/80 to-transparent px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#161B26] hover:bg-[#1F2636] border border-[#263042] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Tạm dừng' : 'Phát hiệu ứng'}</span>
          </button>

          <button
            type="button"
            onClick={() => setElapsedSec(0)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] bg-[#161B26] hover:bg-[#1F2636] border border-[#263042] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            aria-label="Đặt lại thời gian mô phỏng"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono tabular-nums text-[#94A3B8] ml-1">
            {formattedTime}
          </span>
        </div>

        {/* Interactive DMX Chase Pattern Selector */}
        <div className="flex items-center gap-1 bg-[#161B26]/90 p-1 rounded-[8px] border border-[#263042]">
          {patterns.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPatternIdx(idx);
                setIsPlaying(true);
              }}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                patternIdx === idx
                  ? 'bg-[#F5C518] text-[#0B0E14] font-semibold'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
