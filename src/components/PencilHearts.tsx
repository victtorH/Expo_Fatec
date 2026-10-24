import React, { useMemo } from 'react';
import { jitterPath } from './handDrawn';

interface PencilHeartsProps {
  hearts: number; // 0.0 a 3.0 (aceita meio coração)
}

const HEART = 'M 16 28 C 6 20 1 14 2.5 8.5 C 4 3 11.5 1.5 16 8 C 20.5 1.5 28 3 29.5 8.5 C 31 14 26 20 16 28 Z';

const Heart: React.FC<{ index: number; fill: 'full' | 'half' | 'empty' }> = ({ index, fill }) => {
  const outline = useMemo(() => jitterPath(HEART, `heart-a-${index}`, 0.7), [index]);
  const second = useMemo(() => jitterPath(HEART, `heart-b-${index}`, 1.3), [index]);
  const clipId = `heart-half-${index}`;
  const title = fill === 'full' ? '1 coração' : fill === 'half' ? 'Meio coração' : 'Coração perdido';

  return (
    <span className="heart-slot" title={title}>
      <svg width="40" height="38" viewBox="-2 -2 36 34" fill="none" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x="-2" y="-2" width="18" height="40" />
          </clipPath>
        </defs>
        <path d={outline} fill={fill === 'empty' ? 'none' : '#fbe9e4'} />
        {fill === 'full' && <path d={outline} fill="url(#hatch-red)" />}
        {fill === 'half' && <path d={outline} fill="url(#hatch-red)" clipPath={`url(#${clipId})`} />}
        {fill === 'half' && <path d="M 16 8 L 16 27" stroke="#2a2e35" strokeWidth="1.4" strokeDasharray="2 2.5" opacity="0.7" />}
        <path
          d={outline}
          stroke="#2a2e35"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeDasharray={fill === 'empty' ? '3 3.4' : undefined}
          opacity={fill === 'empty' ? 0.55 : 1}
        />
        <path d={second} stroke="#2a2e35" strokeWidth="1" opacity={fill === 'empty' ? 0.25 : 0.5} />
        {fill === 'empty' && (
          <path d="M 12 12 L 20 20 M 20 12 L 12 20" stroke="#2a2e35" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
        )}
      </svg>
    </span>
  );
};

/** Corações feitos a lápis: cheio = hachura vermelha, meio = metade hachurada, vazio = tracejado com X. */
export const PencilHearts: React.FC<PencilHeartsProps> = ({ hearts }) => {
  const items: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 3; i++) {
    if (hearts >= i) items.push('full');
    else if (hearts >= i - 0.5) items.push('half');
    else items.push('empty');
  }
  return (
    <div className="pencil-hearts" aria-label={`Corações: ${hearts} de 3`} role="img">
      <div className="pencil-hearts__row">
        {items.map((f, i) => (
          <Heart key={i} index={i} fill={f} />
        ))}
      </div>
      <div className="pencil-hearts__label">corações · {hearts % 1 === 0 ? hearts : hearts.toFixed(1)}/3</div>
    </div>
  );
};
