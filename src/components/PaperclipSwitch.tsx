import React from 'react';
import { soundManager } from '../logic/sound';

interface PaperclipSwitchProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isClosed: boolean;
  onToggle: (id: string) => void;
  powered?: boolean;
}

export const PaperclipSwitch: React.FC<PaperclipSwitchProps> = ({
  id,
  label,
  x,
  y,
  isClosed,
  onToggle,
  powered = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClipToggle(!isClosed);
    onToggle(id);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group outline-none focus:outline-none"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Chave clipe ${label}: atualmente ${isClosed ? 'conectada' : 'desconectada'}. Clique para alterar.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          soundManager.playClipToggle(!isClosed);
          onToggle(id);
        }
      }}
    >
      {/* Invisible larger hit target for comfortable clicking on desktop and touch */}
      <rect
        x="-20"
        y="-35"
        width="110"
        height="70"
        fill="transparent"
        className="pointer-events-auto"
      />

      {/* Left Contact Terminal */}
      <circle
        cx="0"
        cy="0"
        r="4.5"
        fill={powered ? '#fde047' : '#ffffff'}
        stroke="#1e293b"
        strokeWidth="2.4"
        className="transition-colors duration-150"
      />

      {/* Right Contact Terminal */}
      <circle
        cx="68"
        cy="0"
        r="4.5"
        fill={isClosed && powered ? '#fde047' : '#ffffff'}
        stroke="#1e293b"
        strokeWidth="2.4"
        className="transition-colors duration-150"
      />

      {/* Spark or connection dot when closed and powered */}
      {isClosed && powered && (
        <circle cx="68" cy="0" r="8" fill="#38bdf8" opacity="0.4" className="animate-ping" />
      )}

      {/* The Paperclip Switch Element */}
      {/* Pivots around (0, 0) */}
      <g
        style={{
          transformOrigin: '0px 0px',
          transform: isClosed ? 'rotate(0deg)' : 'rotate(-26deg)',
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="filter drop-shadow-sm group-hover:brightness-110"
      >
        {/* Paperclip Outer Loop & Inner Loop Path */}
        {/* Soft shadow under clip */}
        <path
          d="M 2 2 
             L 58 2 
             C 68 2, 68 -10, 58 -10 
             L 10 -10 
             C 2 -10, 2 8, 12 8 
             L 52 8 
             C 58 8, 58 0, 52 0 
             L 16 0"
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(1, 2)"
        />

        {/* Paperclip Metallic Wire */}
        <path
          d="M 2 0 
             L 58 0 
             C 68 0, 68 -12, 58 -12 
             L 10 -12 
             C 2 -12, 2 6, 12 6 
             L 52 6 
             C 58 6, 58 -2, 52 -2 
             L 16 -2"
          fill="none"
          stroke="#64748b"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors"
        />

        {/* Metallic Highlight Wire */}
        <path
          d="M 4 -1 
             L 56 -1 
             C 64 -1, 64 -11, 56 -11 
             L 12 -11 
             C 4 -11, 4 5, 12 5 
             L 50 5 
             C 56 5, 56 -1, 50 -1 
             L 18 -1"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small pivot pin/ring over left contact */}
        <circle cx="0" cy="0" r="3.2" fill="#94a3b8" stroke="#334155" strokeWidth="1.2" />
      </g>

      {/* Blue Handwritten Label 'A', 'B', etc. below switch */}
      <text
        x="34"
        y="24"
        textAnchor="middle"
        dominantBaseline="hanging"
        fill="#2563eb"
        className="font-caveat font-bold select-none group-hover:text-blue-700 transition-colors"
        style={{ fontSize: '24px', fontWeight: 700 }}
      >
        {label}
      </text>

      {/* Hover state tooltip bubble */}
      <title>{`Clipe ${label}: ${isClosed ? 'Fechado (1)' : 'Aberto (0)'} - Clique para alterar`}</title>
    </g>
  );
};
