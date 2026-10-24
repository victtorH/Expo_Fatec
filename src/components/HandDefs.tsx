import React from 'react';

/**
 * Definições SVG globais compartilhadas pelas ilustrações:
 *  - hachuras de lápis de cor (amarelo, vermelho, verde, azul, grafite)
 *  - filtro de grão de grafite (traço com pequenas falhas, como lápis no papel)
 *
 * O SVG fica fora do fluxo (0x0, sem display:none, para que as referências
 * url(#id) funcionem em todos os navegadores).
 */
export const HandDefs: React.FC = () => (
  <svg
    width="0"
    height="0"
    aria-hidden="true"
    focusable="false"
    style={{ position: 'absolute', pointerEvents: 'none' }}
  >
    <defs>
      {(
        [
          ['hatch-yellow', '#f0b92a', 0.95],
          ['hatch-red', '#c9453b', 0.9],
          ['hatch-green', '#4a8a52', 0.85],
          ['hatch-blue', '#3f72b8', 0.85],
          ['hatch-graphite', '#4b5058', 0.55],
        ] as const
      ).map(([id, color, op]) => (
        <pattern
          key={id}
          id={id}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(48)"
        >
          <line x1="0" y1="0" x2="0" y2="5" stroke={color} strokeWidth="1.5" opacity={op} />
        </pattern>
      ))}

      {/* Grão de grafite: máscara de ruído que "falha" levemente o traço. */}
      <filter
        id="pencil-grain"
        filterUnits="userSpaceOnUse"
        x="-100"
        y="-100"
        width="1400"
        height="800"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  2.9 0 0 0 -0.55"
          result="grain"
        />
        <feComposite in="SourceGraphic" in2="grain" operator="in" />
      </filter>
    </defs>
  </svg>
);
