import React from 'react';
import { LogicGateType } from '../logic/types';

interface LogicGateSvgProps {
  id: string;
  type: LogicGateType;
  x: number;
  y: number;
  label?: string;
  outputPowered?: boolean;
}

export const LogicGateSvg: React.FC<LogicGateSvgProps> = ({
  type,
  x,
  y,
  label,
  outputPowered = false,
}) => {
  // Gate centered at (x, y)
  // Input pins on left at y-15 and y+15 (or y for NOT)
  // Output pin on right at x+45, y

  const renderSymbol = () => {
    switch (type) {
      case 'AND':
        return (
          <path
            d="M -20 -22 L 0 -22 C 16 -22, 25 -12, 25 0 C 25 12, 16 22, 0 22 L -20 22 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        );
      case 'NAND':
        return (
          <>
            <path
              d="M -20 -22 L 0 -22 C 16 -22, 25 -12, 25 0 C 25 12, 16 22, 0 22 L -20 22 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <circle cx="29" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />
          </>
        );
      case 'OR':
        return (
          <path
            d="M -22 -22 C -12 -10, -12 10, -22 22 C -2 22, 16 16, 26 0 C 16 -16, -2 -22, -22 -22 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        );
      case 'NOR':
        return (
          <>
            <path
              d="M -22 -22 C -12 -10, -12 10, -22 22 C -2 22, 16 16, 26 0 C 16 -16, -2 -22, -22 -22 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />
          </>
        );
      case 'XOR':
        return (
          <>
            <path
              d="M -28 -22 C -18 -10, -18 10, -28 22"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M -22 -22 C -12 -10, -12 10, -22 22 C -2 22, 16 16, 26 0 C 16 -16, -2 -22, -22 -22 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </>
        );
      case 'XNOR':
        return (
          <>
            <path
              d="M -28 -22 C -18 -10, -18 10, -28 22"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M -22 -22 C -12 -10, -12 10, -22 22 C -2 22, 16 16, 26 0 C 16 -16, -2 -22, -22 -22 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />
          </>
        );
      case 'NOT':
        return (
          <>
            <path
              d="M -20 -20 L 20 0 L -20 20 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="0" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none">
      {/* Soft shadow under gate symbol */}
      <g opacity="0.12" transform="translate(2, 2)">
        {renderSymbol()}
      </g>

      {/* Logic Gate Symbol */}
      {renderSymbol()}

      {/* Terminal pins */}
      {type === 'NOT' ? (
        <circle cx="-20" cy="0" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
      ) : (
        <>
          <circle cx="-20" cy="-12" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
          <circle cx="-20" cy="12" r="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
        </>
      )}

      {/* Output terminal */}
      <circle
        cx={type === 'NOT' ? 28 : type === 'NAND' || type === 'NOR' || type === 'XNOR' ? 34 : 26}
        cy="0"
        r="3"
        fill={outputPowered ? '#fde047' : '#ffffff'}
        stroke="#1e293b"
        strokeWidth="2"
      />

      {/* Gate Label in handwriting style */}
      <text
        x="0"
        y="32"
        textAnchor="middle"
        dominantBaseline="hanging"
        fill="#475569"
        className="font-caveat font-bold text-sm tracking-wide"
        style={{ fontSize: '16px', fontWeight: 700 }}
      >
        {label || type}
      </text>
    </g>
  );
};
