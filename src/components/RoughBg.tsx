import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { roughRect } from './handDrawn';

interface RoughBgProps {
  /** Semente: mantém o desenho estável entre renderizações. */
  seed: string;
  /** Cor do papel (preenchimento). */
  fill?: string;
  /** Cor do traço de lápis/tinta. */
  stroke?: string;
  /** Padrão de hachura de lápis de cor (ex.: 'hatch-green'). */
  hatch?: string;
  hatchOpacity?: number;
  strokeWidth?: number;
  /** Intensidade da irregularidade do contorno. */
  amp?: number;
}

/**
 * Fundo desenhado à mão: contorno em duas passadas de lápis, com leve
 * irregularidade. Deve ser o primeiro filho de um elemento posicionado
 * (relative/absolute). Usa pixels reais, então não deforma o traço.
 */
export const RoughBg: React.FC<RoughBgProps> = ({
  seed,
  fill = 'transparent',
  stroke = '#2a2e35',
  hatch,
  hatchOpacity = 0.55,
  strokeWidth = 2.2,
  amp = 1.7,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ w: 120, h: 44 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.max(20, Math.round(el.offsetWidth));
      const h = Math.max(20, Math.round(el.offsetHeight));
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paths = useMemo(() => roughRect(size.w, size.h, seed, amp), [size.w, size.h, seed, amp]);

  return (
    <span ref={ref} className="rough-bg" aria-hidden="true">
      <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
        <path d={paths.fill} fill={fill} stroke="none" />
        {hatch && (
          <path
            className="rough-hatch"
            d={paths.fill}
            fill={`url(#${hatch})`}
            opacity={hatchOpacity}
            stroke="none"
          />
        )}
        <path
          d={paths.fill}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          className="rough-bg__second"
          d={paths.second}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth * 0.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
    </span>
  );
};
