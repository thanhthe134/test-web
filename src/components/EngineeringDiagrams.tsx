import React from 'react';
import { EquipmentItem } from '../types/equipment';

interface DiagramProps {
  equipment: EquipmentItem;
}

export const MotorCutawayDiagram: React.FC<DiagramProps> = ({ equipment }) => {
  const isKinetic = equipment.categoryKey === 'kinetic';
  const isLaser = equipment.categoryKey === 'laser';

  return (
    <div className="w-full aspect-video rounded-[12px] bg-[#0B0E14] border border-[#263042] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4 border-b border-[#263042] pb-3">
        <div>
          <p className="text-xs font-mono text-[#F5C518]">
            {isKinetic ? 'CẤU TẠO CỤM TỜI SERVO & CẢM BIẾN' : isLaser ? 'CẤU TRÚC QUANG HỌC GALVO & DIODE' : 'KIẾN TRÚC TẢN NHIỆT & BO MẠCH LED COB'}
          </p>
          <h4 className="text-base font-semibold text-white mt-0.5">{equipment.name}</h4>
        </div>
        <span className="text-xs font-mono tabular-nums text-[#94A3B8]">
          Mã bản vẽ: {equipment.code}-ENG
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center py-3">
        <svg viewBox="0 0 640 260" className="w-full h-full max-h-[240px]" role="img" aria-label={`Bản vẽ cấu tạo kỹ thuật ${equipment.name}`}>
          <defs>
            <pattern id="engGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E2636" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="640" height="260" fill="url(#engGrid)" rx="8" />

          {isKinetic ? (
            <>
              {/* Winch Housing */}
              <rect x="180" y="34" width="280" height="110" rx="8" fill="#161B26" stroke="#384660" strokeWidth="2" />
              {/* Servo Motor */}
              <rect x="200" y="54" width="90" height="70" rx="4" fill="#1E293B" stroke="#F5C518" strokeWidth="1.5" />
              <text x="245" y="93" textAnchor="middle" fill="#F5C518" fontSize="11" fontFamily="monospace">SERVO MOTOR</text>
              {/* Cable Drum */}
              <ellipse cx="355" cy="89" rx="34" ry="34" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" />
              <line x1="335" y1="70" x2="375" y2="70" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="335" y1="82" x2="375" y2="82" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="335" y1="94" x2="375" y2="94" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="335" y1="106" x2="375" y2="106" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Electromagnetic Brake */}
              <rect x="405" y="64" width="38" height="50" rx="3" fill="#1E293B" stroke="#FF2A5F" strokeWidth="1.5" />
              <text x="424" y="93" textAnchor="middle" fill="#FF2A5F" fontSize="9" fontFamily="monospace">BRAKE</text>
              {/* Cable drop */}
              <line x1="355" y1="123" x2="355" y2="195" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="4 2" />
              {/* Kinetic fixture */}
              {equipment.systemType === 'kinetic-ring' ? (
                <ellipse cx="355" cy="215" rx="75" ry="16" fill="none" stroke="#F5C518" strokeWidth="4" />
              ) : (
                <circle cx="355" cy="215" r="22" fill="#F5C518" fillOpacity="0.2" stroke="#F5C518" strokeWidth="2.5" />
              )}
              {/* Annotations */}
              <line x1="180" y1="89" x2="100" y2="89" stroke="#94A3B8" strokeWidth="1" />
              <text x="20" y="85" fill="#FFFFFF" fontSize="11">Phanh từ tự khóa</text>
              <text x="20" y="101" fill="#94A3B8" fontSize="10">An toàn cấp 2</text>

              <line x1="460" y1="89" x2="520" y2="89" stroke="#94A3B8" strokeWidth="1" />
              <text x="526" y="85" fill="#FFFFFF" fontSize="11">Cảm biến tải</text>
              <text x="526" y="101" fill="#94A3B8" fontSize="10">Độ lệch ±1mm</text>
            </>
          ) : isLaser ? (
            <>
              {/* Sealed IP65 Housing */}
              <rect x="130" y="55" width="320" height="145" rx="8" fill="#161B26" stroke="#384660" strokeWidth="2" />
              {/* RGB Diode Modules */}
              <rect x="155" y="75" width="75" height="30" rx="3" fill="#1E293B" stroke="#FF2A5F" strokeWidth="1.5" />
              <text x="192" y="94" textAnchor="middle" fill="#FF2A5F" fontSize="10" fontFamily="monospace">RED DIODE</text>
              <rect x="155" y="113" width="75" height="30" rx="3" fill="#1E293B" stroke="#F5C518" strokeWidth="1.5" />
              <text x="192" y="132" textAnchor="middle" fill="#F5C518" fontSize="10" fontFamily="monospace">GREEN 520nm</text>
              <rect x="155" y="151" width="75" height="30" rx="3" fill="#1E293B" stroke="#00F0FF" strokeWidth="1.5" />
              <text x="192" y="170" textAnchor="middle" fill="#00F0FF" fontSize="10" fontFamily="monospace">BLUE 445nm</text>
              {/* Dichroic Mirrors */}
              <line x1="280" y1="80" x2="300" y2="100" stroke="#94A3B8" strokeWidth="3" />
              <line x1="280" y1="118" x2="300" y2="138" stroke="#94A3B8" strokeWidth="3" />
              <line x1="280" y1="156" x2="300" y2="176" stroke="#94A3B8" strokeWidth="3" />
              {/* Combined Beam */}
              <line x1="230" y1="90" x2="290" y2="90" stroke="#FF2A5F" strokeWidth="2" />
              <line x1="230" y1="128" x2="290" y2="128" stroke="#F5C518" strokeWidth="2" />
              <line x1="230" y1="166" x2="290" y2="166" stroke="#00F0FF" strokeWidth="2" />
              <line x1="290" y1="90" x2="290" y2="166" stroke="#FFFFFF" strokeWidth="2.5" />
              {/* Galvo Scanner */}
              <rect x="340" y="95" width="75" height="66" rx="4" fill="#0F172A" stroke="#00F0FF" strokeWidth="1.5" />
              <text x="377" y="124" textAnchor="middle" fill="#00F0FF" fontSize="10" fontFamily="monospace">GALVO</text>
              <text x="377" y="139" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">45Kpps</text>
              <line x1="290" y1="128" x2="340" y2="128" stroke="#FFFFFF" strokeWidth="2.5" />
              {/* Output aperture */}
              <line x1="415" y1="128" x2="590" y2="95" stroke="#00F0FF" strokeWidth="2.5" />
              <line x1="415" y1="128" x2="590" y2="160" stroke="#F5C518" strokeWidth="2.5" />
              <text x="485" y="75" fill="#FFFFFF" fontSize="11">Cửa quang học chống phản xạ</text>
            </>
          ) : (
            <>
              {/* LED Matrix Panel Cutaway */}
              <rect x="160" y="42" width="160" height="160" rx="6" fill="#161B26" stroke="#384660" strokeWidth="2" />
              {Array.from({ length: 5 }).map((_, r) =>
                Array.from({ length: 5 }).map((__, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={184 + c * 28}
                    cy={66 + r * 28}
                    r="9"
                    fill="#F5C518"
                    fillOpacity="0.25"
                    stroke="#F5C518"
                    strokeWidth="1.5"
                  />
                ))
              )}
              {/* Heatsink & Art-Net Board */}
              <rect x="360" y="52" width="120" height="140" rx="6" fill="#1E293B" stroke="#00F0FF" strokeWidth="1.5" />
              <text x="420" y="108" textAnchor="middle" fill="#00F0FF" fontSize="11" fontFamily="monospace">ART-NET / DMX</text>
              <text x="420" y="128" textAnchor="middle" fill="#FFFFFF" fontSize="11">Khối tản nhiệt nhôm</text>
              <text x="420" y="146" textAnchor="middle" fill="#94A3B8" fontSize="10">PWM 18.000 Hz</text>
              <line x1="320" y1="122" x2="360" y2="122" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
            </>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#263042] text-xs">
        <div>
          <span className="text-[#94A3B8] block">Chuẩn kết nối</span>
          <span className="text-white font-mono">{equipment.riggingNotes.controlChain}</span>
        </div>
        <div>
          <span className="text-[#94A3B8] block">Cơ chế an toàn</span>
          <span className="text-white font-mono">{equipment.riggingNotes.suspensionPoints}</span>
        </div>
      </div>
    </div>
  );
};

export const TrussRiggingDiagram: React.FC<DiagramProps> = ({ equipment }) => {
  return (
    <div className="w-full aspect-video rounded-[12px] bg-[#0B0E14] border border-[#263042] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4 border-b border-[#263042] pb-3">
        <div>
          <p className="text-xs font-mono text-[#00F0FF]">
            SƠ ĐỒ TREO TRUSS & PHÂN BỔ TẢI TRỌNG
          </p>
          <h4 className="text-base font-semibold text-white mt-0.5">
            Cấu hình lắp đặt tiêu chuẩn · {equipment.code}
          </h4>
        </div>
        <span className="text-xs font-mono tabular-nums text-[#F5C518]">
          {equipment.riggingNotes.trussLoad}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center py-3">
        <svg viewBox="0 0 640 240" className="w-full h-full max-h-[220px]" role="img" aria-label={`Sơ đồ treo giàn Truss cho ${equipment.name}`}>
          {/* Top Truss Box */}
          <rect x="60" y="28" width="520" height="24" fill="#161B26" stroke="#94A3B8" strokeWidth="1.5" />
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={70 + i * 28}
              y1="28"
              x2={86 + i * 28}
              y2="52"
              stroke="#384660"
              strokeWidth="1.5"
            />
          ))}
          <text x="320" y="18" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace">
            GIÀN TRUSS NHÔM HỘP 400 × 400 MM (TẢI AN TOÀN)
          </text>

          {/* 3 Fixture Mounting Points */}
          {[160, 320, 480].map((x, idx) => (
            <g key={x}>
              {/* Clamp */}
              <rect x={x - 10} y="48" width="20" height="14" rx="2" fill="#F5C518" />
              {/* Safety Cable */}
              <path
                d={`M ${x - 16} 52 Q ${x - 24} 75 ${x - 8} 90`}
                fill="none"
                stroke="#FF2A5F"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              {/* Drop Cable / Mount */}
              <line x1={x} y1="62" x2={x} y2={110 + idx * 14} stroke="#00F0FF" strokeWidth="2" />
              {/* Unit representation */}
              {equipment.systemType === 'kinetic-ball' ? (
                <circle cx={x} cy={126 + idx * 14} r="14" fill="#F5C518" fillOpacity="0.3" stroke="#F5C518" strokeWidth="2" />
              ) : equipment.systemType === 'kinetic-ring' ? (
                <ellipse cx={x} cy={126 + idx * 14} rx="44" ry="12" fill="none" stroke="#00F0FF" strokeWidth="3" />
              ) : (
                <rect x={x - 22} y={96} width="44" height="32" rx="4" fill="#1E293B" stroke="#F5C518" strokeWidth="2" />
              )}
              <text x={x} y="185" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                UNIT #{idx + 1}
              </text>
            </g>
          ))}

          {/* Daisy Chain Line */}
          <path d="M 160 66 L 480 66" stroke="#00F0FF" strokeWidth="1.2" strokeDasharray="5 3" />
          <text x="320" y="218" textAnchor="middle" fill="#FFFFFF" fontSize="11">
            Hành trình / Lắp đặt: {equipment.riggingNotes.cableDrop}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#263042] text-xs">
        <div>
          <span className="text-[#94A3B8] block">Điểm treo yêu cầu</span>
          <span className="text-white">{equipment.riggingNotes.suspensionPoints}</span>
        </div>
        <div>
          <span className="text-[#94A3B8] block">Tải trọng giàn Truss</span>
          <span className="text-white tabular-nums">{equipment.riggingNotes.trussLoad}</span>
        </div>
      </div>
    </div>
  );
};
