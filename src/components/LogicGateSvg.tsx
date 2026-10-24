import React, { useMemo } from 'react';
import { LogicGateType } from '../logic/types';
import { jitterPath } from './handDrawn';

interface LogicGateSvgProps {
  id: string;
  type: LogicGateType;
  x: number;
  y: number;
  label?: string;
  outputPowered?: boolean;
  /** Alturas (relativas ao centro da porta) onde os fios de entrada chegam. */
  inputPins?: number[];
}

const AND_D = 'M -20 -22 L 0 -22 C 16 -22 25 -12 25 0 C 25 12 16 22 0 22 L -20 22 Z';
const OR_D = 'M -22 -22 C -12 -10 -12 10 -22 22 C -2 22 16 16 26 0 C 16 -16 -2 -22 -22 -22 Z';
const XOR_BACK_D = 'M -28 -22 C -18 -10 -18 10 -28 22';
const NOT_D = 'M -20 -20 L 20 0 L -20 20 Z';

/** Tinta do símbolo: duas passadas de grafite, preenchimento de papel (ou hachura quando a saída é 1). */
const Body: React.FC<{ d: string; seed: string; lit: boolean }> = ({ d, seed, lit }) => {
  const a = useMemo(() => jitterPath(d, `${seed}-a`, 0.8), [d, seed]);
  const b = useMemo(() => jitterPath(d, `${seed}-b`, 1.4), [d, seed]);
  return (
    <>
      <path d={a} fill="#f7f0de" />
      {lit && <path d={a} fill="url(#hatch-yellow)" opacity="0.7" />}
      <path d={a} fill="none" stroke="#2a2e35" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d={b} fill="none" stroke="#2a2e35" strokeWidth="1" opacity="0.5" strokeLinejoin="round" />
    </>
  );
};

const Bubble: React.FC<{ cx: number; seed: string }> = ({ cx, seed }) => {
  const d = useMemo(
    () => jitterPath(`M ${cx - 4} 0 C ${cx - 4} -2.5 ${cx - 2} -4 ${cx} -4 C ${cx + 2.5} -4 ${cx + 4} -2.5 ${cx + 4} 0 C ${cx + 4} 2.5 ${cx + 2} 4 ${cx} 4 C ${cx - 2.5} 4 ${cx - 4} 2.5 ${cx - 4} 0 Z`, seed, 0.35),
    [cx, seed]
  );
  return <path d={d} fill="#f7f0de" stroke="#2a2e35" strokeWidth="2.2" />;
};

export const LogicGateSvg: React.FC<LogicGateSvgProps> = ({
  id,
  type,
  x,
  y,
  label,
  outputPowered = false,
  inputPins,
}) => {
  const seed = `gate-${id}-${type}`;

  const hasBubble = type === 'NAND' || type === 'NOR' || type === 'XNOR' || type === 'NOT';
  const outX = type === 'NOT' ? 28 : type === 'NAND' || type === 'NOR' || type === 'XNOR' ? 34 : 26;
  const pins = inputPins && inputPins.length > 0 ? inputPins : type === 'NOT' ? [0] : [-12, 12];

  const renderSymbol = () => {
    switch (type) {
      case 'AND':
        return <Body d={AND_D} seed={seed} lit={outputPowered} />;
      case 'NAND':
        return (
          <>
            <Body d={AND_D} seed={seed} lit={outputPowered} />
            <Bubble cx={29} seed={`${seed}-o`} />
          </>
        );
      case 'OR':
        return <Body d={OR_D} seed={seed} lit={outputPowered} />;
      case 'NOR':
        return (
          <>
            <Body d={OR_D} seed={seed} lit={outputPowered} />
            <Bubble cx={30} seed={`${seed}-o`} />
          </>
        );
      case 'XOR':
      case 'XNOR':
        return (
          <>
            <path d={jitterPath(XOR_BACK_D, `${seed}-x`, 0.7)} fill="none" stroke="#2a2e35" strokeWidth="2.6" strokeLinecap="round" />
            <Body d={OR_D} seed={seed} lit={outputPowered} />
            {type === 'XNOR' && <Bubble cx={30} seed={`${seed}-o`} />}
          </>
        );
      case 'NOT':
        return (
          <>
            <Body d={NOT_D} seed={seed} lit={outputPowered} />
            <Bubble cx={24} seed={`${seed}-o`} />
          </>
        );
      default:
        return null;
    }
  };

  void hasBubble;

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none">
      {/* terminais de entrada: pequenos traços que entram no corpo da porta */}
      {pins.map((py, i) => (
        <path
          key={i}
          d={jitterPath(`M -20 ${py} L -2 ${py}`, `${seed}-pin${i}`, 0.35)}
          stroke="#2a2e35"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {renderSymbol()}

      {/* terminal de saída, ligado ao início do fio de saída (+45) */}
      <path
        d={jitterPath(`M ${outX + 3} 0 L 45 0`, `${seed}-out`, 0.35)}
        stroke={outputPowered ? '#3b69ad' : '#2a2e35'}
        strokeWidth={outputPowered ? 3 : 2.2}
        strokeLinecap="round"
        fill="none"
      />
      {pins.map((py, i) => (
        <circle key={`c${i}`} cx="-20" cy={py} r="2.8" fill="#f7f0de" stroke="#2a2e35" strokeWidth="1.8" />
      ))}
      <circle cx={outX} cy="0" r="2.8" fill={outputPowered ? '#f0b92a' : '#f7f0de'} stroke="#2a2e35" strokeWidth="1.8" />

      {/* nome da porta, à mão */}
      {(label || type) && (
        <text
          x="0"
          y="46"
          textAnchor="middle"
          fill="#4b515b"
          style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 700, letterSpacing: '0.04em' }}
        >
          {label || type}
        </text>
      )}
    </g>
  );
};
