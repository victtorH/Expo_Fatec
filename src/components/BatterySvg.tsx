import React from 'react';

interface BatterySvgProps {
  x: number;
  y: number;
  voltage?: string;
}

export const BatterySvg: React.FC<BatterySvgProps> = ({ x, y, voltage = '9V' }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none">
      {/* Top Tape Strip */}
      <rect
        x="-15"
        y="-12"
        width="45"
        height="18"
        transform="rotate(-8 -15 -12)"
        fill="rgba(255, 255, 255, 0.75)"
        stroke="rgba(200, 200, 190, 0.6)"
        strokeWidth="1"
        rx="2"
      />

      {/* Bottom Tape Strip */}
      <rect
        x="-18"
        y="50"
        width="45"
        height="18"
        transform="rotate(12 -18 50)"
        fill="rgba(255, 255, 255, 0.75)"
        stroke="rgba(200, 200, 190, 0.6)"
        strokeWidth="1"
        rx="2"
      />

      {/* Battery Box Outline */}
      <rect
        x="0"
        y="0"
        width="76"
        height="84"
        rx="6"
        fill="#f8fafc"
        stroke="#1e293b"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Top Cap */}
      <path
        d="M 12 0 L 12 -6 L 64 -6 L 64 0"
        fill="none"
        stroke="#1e293b"
        strokeWidth="2.4"
      />

      {/* Diagonal Hatching in lower portion */}
      <g stroke="#64748b" strokeWidth="1.2" opacity="0.65">
        <line x1="2" y1="58" x2="22" y2="82" />
        <line x1="12" y1="58" x2="36" y2="82" />
        <line x1="24" y1="58" x2="48" y2="82" />
        <line x1="36" y1="58" x2="60" y2="82" />
        <line x1="48" y1="58" x2="72" y2="82" />
        <line x1="60" y1="58" x2="75" y2="76" />
      </g>

      {/* Horizontal divider line inside battery */}
      <line x1="2" y1="52" x2="74" y2="52" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* 9V Handwritten Text */}
      <text
        x="38"
        y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#0f172a"
        className="font-caveat font-bold text-3xl tracking-wide"
        style={{ fontSize: '30px', fontWeight: 700 }}
      >
        {voltage}
      </text>

      {/* Positive Terminal (+) on right top */}
      <circle cx="76" cy="18" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
      <text
        x="88"
        y="12"
        fill="#2563eb"
        className="font-hand font-bold text-lg"
        style={{ fontSize: '18px', fontWeight: 700 }}
      >
        +
      </text>

      {/* Negative Terminal (-) on right bottom */}
      <circle cx="76" cy="58" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
      <text
        x="88"
        y="62"
        fill="#dc2626"
        className="font-hand font-bold text-xl"
        style={{ fontSize: '20px', fontWeight: 700 }}
      >
        -
      </text>
    </g>
  );
};
