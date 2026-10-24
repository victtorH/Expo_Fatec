import React, { useMemo } from 'react';
import { circlePath, jitterPath } from './handDrawn';

/**
 * Ícones de traço manual (substituem os ícones vetoriais uniformes).
 * Cada um usa leve jitter determinístico e traço arredondado, como grafite.
 */

type IconName = 'speaker' | 'speakerMuted' | 'exit' | 'reset' | 'check' | 'pencil' | 'book' | 'close' | 'trophy' | 'home' | 'play' | 'calendar';

const PATHS: Record<IconName, string[]> = {
  speaker: [
    'M 3 9 L 7 9 L 12 5 L 12 19 L 7 15 L 3 15 Z',
    'M 15 9 C 17 11 17 13 15 15',
    'M 18 6.5 C 21.5 10 21.5 14 18 17.5',
  ],
  speakerMuted: ['M 3 9 L 7 9 L 12 5 L 12 19 L 7 15 L 3 15 Z', 'M 15.5 9 L 21 15 M 21 9 L 15.5 15'],
  exit: ['M 10 4 L 4 4 L 4 20 L 10 20', 'M 9 12 L 20 12 M 16 8 L 20 12 L 16 16'],
  reset: [
    'M 19 12 C 19 16.5 15.5 19.5 11.5 19 C 7 18.5 4.5 14.5 5.5 10.5 C 6.5 7 9.5 5 13 5.3',
    'M 13 5.3 L 9.5 2.5 M 13 5.3 L 10 8.6',
  ],
  check: ['M 4 13 L 9.5 18.5 L 20 5'],
  pencil: ['M 4 20 L 5 15 L 16 4 L 20 8 L 9 19 Z', 'M 14 6 L 18 10'],
  book: [
    'M 4 5 C 8 4 10 5 12 7 C 14 5 16 4 20 5 L 20 19 C 16 18 14 19 12 21 C 10 19 8 18 4 19 Z',
    'M 12 7 L 12 21',
  ],
  close: ['M 5 5 L 19 19 M 19 5 L 5 19'],
  trophy: [
    'M 7 4 L 17 4 L 16 11 C 15.5 13.5 13.5 15 12 15 C 10.5 15 8.5 13.5 8 11 Z',
    'M 7 6 C 3 6 3 11 8 11 M 17 6 C 21 6 21 11 16 11',
    'M 12 15 L 12 19 M 8 20 L 16 20',
  ],
  home: ['M 3 12 L 12 4 L 21 12', 'M 6 10 L 6 20 L 18 20 L 18 10', 'M 10 20 L 10 14 L 14 14 L 14 20'],
  play: ['M 7 4 L 19 12 L 7 20 Z'],
  calendar: ['M 4 6 L 20 6 L 20 20 L 4 20 Z', 'M 4 10 L 20 10 M 8 3 L 8 8 M 16 3 L 16 8'],
};

interface HandIconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Cor de preenchimento opcional (lápis de cor). */
  fill?: string;
}

export const HandIcon: React.FC<HandIconProps> = ({
  name,
  size = 22,
  strokeWidth = 2,
  className,
  fill = 'none',
}) => {
  const d = useMemo(() => PATHS[name].map((p, i) => jitterPath(p, `${name}-${i}`, 0.35)), [name]);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {d.map((p, i) => (
        <path key={i} d={p} fill={i === 0 ? fill : 'none'} />
      ))}
    </svg>
  );
};

/** Pequena lâmpada desenhada (aceso = hachura amarela; apagado = só contorno). */
export const LampMini: React.FC<{ on: boolean; size?: number }> = ({ on, size = 34 }) => {
  const body = useMemo(
    () => jitterPath('M 16 3 C 24 3 28 9 28 15 C 28 20 24 22 23 27 L 9 27 C 8 22 4 20 4 15 C 4 9 8 3 16 3 Z', on ? 'lamp-on' : 'lamp-off', 0.5),
    [on]
  );
  const ring = useMemo(() => jitterPath(circlePath(16, 16, 1), 'x', 0), []);
  void ring;
  return (
    <svg width={size} height={size} viewBox="0 0 32 36" fill="none" stroke="#2a2e35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={body} fill={on ? '#fbe58a' : '#f7f0de'} />
      {on && <path d={body} fill="url(#hatch-yellow)" stroke="none" />}
      <path d="M 12 27 L 12 32 L 20 32 L 20 27" />
      <path d="M 13 20 L 14 13 L 16 16 L 18 13 L 19 20" strokeWidth="1.5" />
      {on ? (
        <g stroke="#b47a0e" strokeWidth="1.6">
          <path d="M 16 -1 L 16 1" />
          <path d="M 30 5 L 28.5 6.5" />
          <path d="M 2 5 L 3.5 6.5" />
        </g>
      ) : (
        <path d="M 9 8 C 11 5.5 13 4.5 15 4.2" stroke="#8b919a" strokeWidth="1.4" />
      )}
    </svg>
  );
};
