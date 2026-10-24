import React, { useMemo } from 'react';
import { soundManager } from '../logic/sound';
import { jitterPath } from './handDrawn';

interface PaperclipSwitchProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isClosed: boolean;
  onToggle: (id: string) => void;
  powered?: boolean;
}

// Geometria do clipe (pivô em 0,0; ponta direita encosta no terminal em x=68).
const CLIP_D =
  'M 2 0 L 58 0 C 68 0 68 -12 58 -12 L 10 -12 C 2 -12 2 6 12 6 L 52 6 C 58 6 58 -2 52 -2 L 16 -2';

/**
 * Clipe desenhado à mão que funciona como chave.
 *  - Fechado: o arame deita sobre os dois contatos e completa o caminho.
 *  - Aberto: o clipe se levanta no pivô e deixa uma interrupção visível.
 * O estado visual vem direto de `isClosed` (o mesmo usado pelo avaliador lógico).
 */
export const PaperclipSwitch: React.FC<PaperclipSwitchProps> = ({
  id,
  label,
  x,
  y,
  isClosed,
  onToggle,
  powered = false,
}) => {
  const toggle = () => {
    soundManager.playClipToggle(!isClosed);
    onToggle(id);
  };

  const wireA = useMemo(() => jitterPath(CLIP_D, `clip-a-${id}`, 0.7), [id]);
  const wireB = useMemo(() => jitterPath(CLIP_D, `clip-b-${id}`, 1.1), [id]);
  const lead1 = useMemo(() => jitterPath('M -11 0 L 0 0', `lead1-${id}`, 0.4), [id]);
  const lead2 = useMemo(() => jitterPath('M 68 0 L 74 0', `lead2-${id}`, 0.4), [id]);
  const ringL = useMemo(() => jitterPath('M -5 0 C -5 -3 -3 -5 0 -5 C 3 -5 5 -3 5 0 C 5 3 3 5 0 5 C -3 5 -5 3 -5 0 Z', `ringL-${id}`, 0.5), [id]);
  const ringR = useMemo(() => jitterPath('M 63 0 C 63 -3 65 -5 68 -5 C 71 -5 73 -3 73 0 C 73 3 71 5 68 5 C 65 5 63 3 63 0 Z', `ringR-${id}`, 0.5), [id]);

  const rightLive = isClosed && powered;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="clip"
      data-closed={isClosed ? 'true' : 'false'}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isClosed}
      aria-label={`Clipe ${label}: ${isClosed ? 'fechado, valor 1, caminho conectado' : 'aberto, valor 0, caminho interrompido'}. Clique para alterar.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {/* Área de clique generosa (touch/desktop), maior que o desenho */}
      <rect x="-26" y="-46" width="126" height="98" fill="transparent" />

      {/* Anel de foco desenhado (só aparece com teclado) */}
      <path
        className="clip-focus"
        d="M -22 -30 C 20 -42 60 -42 92 -28 C 104 -14 104 16 90 36 C 60 46 20 46 -18 34 C -32 16 -32 -14 -22 -30 Z"
        fill="none"
        stroke="#3b69ad"
        strokeWidth="2.2"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />

      {/* Terminais de contato (aros de tinta) */}
      <path d={lead1} stroke="#2a2e35" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={lead2} stroke="#2a2e35" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={ringL} fill="#f7f0de" stroke="#2a2e35" strokeWidth="2.2" />
      {powered && <path d={ringL} fill="url(#hatch-blue)" stroke="none" />}
      <path d={ringR} fill="#f7f0de" stroke="#2a2e35" strokeWidth="2.2" />
      {rightLive && <path d={ringR} fill="url(#hatch-blue)" stroke="none" />}

      {/* Riscos de contato: só quando o clipe fecha o caminho com energia */}
      {rightLive && (
        <g stroke="#3b69ad" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M 77 -8 L 82 -13" />
          <path d="M 80 0 L 86 0" />
          <path d="M 77 8 L 82 13" />
        </g>
      )}

      {/* Clipe: arame de metal (contorno de grafite + brilho de lápis azul-prata) */}
      <g className="clip-arm">
        <path d={wireB} fill="none" stroke="rgba(42,46,53,0.25)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.2, 2.2)" />
        <path d={wireA} fill="none" stroke="#2a2e35" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={wireB} fill="none" stroke="#c7d3e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 6 -9.5 L 40 -9.5" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
        {/* pino do pivô */}
        <circle cx="0" cy="0" r="3.4" fill="#e9e3d2" stroke="#2a2e35" strokeWidth="1.8" />
      </g>

      {/* Etiqueta manuscrita + valor binário */}
      <text
        x="34"
        y="36"
        textAnchor="middle"
        fill="#3b69ad"
        style={{ fontFamily: 'var(--font-title)', fontSize: 28, fontWeight: 700 }}
      >
        {label}
        <tspan fill="#4b515b" dx="6" style={{ fontFamily: 'var(--font-note)', fontSize: 17, fontWeight: 400 }}>
          = {isClosed ? 1 : 0}
        </tspan>
      </text>

      <title>{`Clipe ${label}: ${isClosed ? 'Fechado (1)' : 'Aberto (0)'} — clique para alterar`}</title>
    </g>
  );
};
