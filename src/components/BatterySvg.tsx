import React, { useMemo } from 'react';
import { jitterPath } from './handDrawn';

interface BatterySvgProps {
  x: number;
  y: number;
  voltage?: string;
}

// Contorno externo retangular da pilha
const BOX = 'M 6 0 L 70 0 C 74 0 76 2 76 6 L 76 78 C 76 82 74 84 70 84 L 6 84 C 2 84 0 82 0 78 L 0 6 C 0 2 2 0 6 0 Z';

// Terminal superior central (tampa / polo da pilha)
const CAP_BOX = 'M 24 0 L 24 -8 C 24 -9.5 25.5 -10.5 27 -10.5 L 49 -10.5 C 50.5 -10.5 52 -9.5 52 -8 L 52 0 Z';

// Símbolo do raio central
const BOLT_PATH = 'M 32 30 L 44 30 L 35 41 L 45 41 L 37 53 L 40 43 L 31 43 Z';

/**
 * Pilha artesanal desenhada à mão fiel à referência ilustrada:
 * - Tampa de polo superior central desenhada a grafite
 * - Três faixas horizontais:
 *   1. Faixa superior: hachura a lápis grafite com símbolo '+' desenhado no canto direito
 *   2. Faixa central: preenchimento de lápis amarelo com raio de grafite hachurado no centro
 *   3. Faixa inferior: hachura a lápis grafite com símbolo '−' desenhado no canto direito
 * - Terminais de contato elétrico perfeitamente alinhados em (76, 18) e (76, 58)
 */
export const BatterySvg: React.FC<BatterySvgProps> = ({ x, y }) => {
  const box1 = useMemo(() => jitterPath(BOX, 'bat-outer-1', 0.9), []);
  const box2 = useMemo(() => jitterPath(BOX, 'bat-outer-2', 1.6), []);
  const cap1 = useMemo(() => jitterPath(CAP_BOX, 'bat-cap-1', 0.8), []);
  const cap2 = useMemo(() => jitterPath(CAP_BOX, 'bat-cap-2', 1.3), []);

  const div1_a = useMemo(() => jitterPath('M 0 25 L 76 25', 'bat-div1-a', 0.7), []);
  const div1_b = useMemo(() => jitterPath('M 0 25 L 76 25', 'bat-div1-b', 1.2), []);

  const div2_a = useMemo(() => jitterPath('M 0 59 L 76 59', 'bat-div2-a', 0.7), []);
  const div2_b = useMemo(() => jitterPath('M 0 59 L 76 59', 'bat-div2-b', 1.2), []);

  const boltA = useMemo(() => jitterPath(BOLT_PATH, 'bat-bolt-a', 0.6), []);
  const boltB = useMemo(() => jitterPath(BOLT_PATH, 'bat-bolt-b', 1.1), []);

  // Sinal '+' desenhado a lápis no canto superior direito
  const plusA = useMemo(() => jitterPath('M 62 13 L 70 13 M 66 9 L 66 17', 'bat-plus-a', 0.4), []);
  const plusB = useMemo(() => jitterPath('M 62 13 L 70 13 M 66 9 L 66 17', 'bat-plus-b', 0.8), []);

  // Sinal '−' desenhado a lápis no canto inferior direito
  const minusA = useMemo(() => jitterPath('M 62 67 L 70 67', 'bat-minus-a', 0.4), []);
  const minusB = useMemo(() => jitterPath('M 62 67 L 70 67', 'bat-minus-b', 0.8), []);

  // Contatos elétricos sutis para os fios do circuito
  const ringP = useMemo(() => jitterPath('M 72 18 C 72 15.5 74 14 76 14 C 78.5 14 80 15.5 80 18 C 80 20.5 78.5 22 76 22 C 74 22 72 20.5 72 18 Z', 'ring-p', 0.35), []);
  const ringN = useMemo(() => jitterPath('M 72 58 C 72 55.5 74 54 76 54 C 78.5 54 80 55.5 80 58 C 80 60.5 78.5 62 76 62 C 74 62 72 60.5 72 58 Z', 'ring-n', 0.35), []);

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none">
      {/* 0. Leve mancha de giz/lápis amarelo vazando organicamente das laterais como na ilustração */}
      <ellipse cx="38" cy="42" rx="42" ry="19" fill="#fde047" opacity="0.32" filter="blur(3px)" />

      {/* 1. Terminal Superior (Cap / Polo) com hachura grafite */}
      <path d={cap1} fill="#e5ded0" />
      <g stroke="#555d68" strokeWidth="1.2" opacity="0.6" strokeLinecap="round">
        <line x1="26" y1="-2" x2="33" y2="-9" />
        <line x1="31" y1="-1" x2="39" y2="-9" />
        <line x1="37" y1="-1" x2="45" y2="-9" />
        <line x1="43" y1="-1" x2="50" y2="-8" />
      </g>
      <path d={cap1} fill="none" stroke="#2a2e35" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={cap2} fill="none" stroke="#2a2e35" strokeWidth="1.1" opacity="0.5" strokeLinejoin="round" />

      {/* 2. Corpo Principal: Fundo de papel base */}
      <path d={box1} fill="#f7f1e1" />

      {/* 3. Faixa Superior (0 a 25): Hachura diagonal a lápis grafite */}
      <g clipPath="url(#bat-top-clip)">
        <clipPath id="bat-top-clip">
          <rect x="0" y="0" width="76" height="25" />
        </clipPath>
        <path d="M 0 0 L 76 0 L 76 25 L 0 25 Z" fill="#eae3d2" opacity="0.8" />
        <g stroke="#4f5661" strokeWidth="1.3" opacity="0.75" strokeLinecap="round">
          <line x1="-5" y1="5" x2="18" y2="-5" />
          <line x1="0" y1="18" x2="28" y2="-5" />
          <line x1="6" y1="28" x2="40" y2="-5" />
          <line x1="18" y1="28" x2="52" y2="-5" />
          <line x1="30" y1="28" x2="64" y2="-5" />
          <line x1="42" y1="28" x2="76" y2="-5" />
          <line x1="54" y1="28" x2="82" y2="4" />
          <line x1="66" y1="28" x2="84" y2="16" />
        </g>
      </g>

      {/* 4. Faixa Central (25 a 59): Amarelo a lápis de cor / giz com hachura amarela e raio */}
      <g clipPath="url(#bat-mid-clip)">
        <clipPath id="bat-mid-clip">
          <rect x="0" y="25" width="76" height="34" />
        </clipPath>
        {/* Base amarela vibrante com textura orgânica */}
        <rect x="0" y="25" width="76" height="34" fill="#fef08a" opacity="0.95" />
        {/* Traços diagonais a lápis amarelo / hachura */}
        <g stroke="#eab308" strokeWidth="2.2" opacity="0.85" strokeLinecap="round">
          <line x1="-8" y1="42" x2="16" y2="24" />
          <line x1="-2" y1="56" x2="28" y2="24" />
          <line x1="8" y1="64" x2="42" y2="24" />
          <line x1="20" y1="64" x2="54" y2="24" />
          <line x1="32" y1="64" x2="66" y2="24" />
          <line x1="44" y1="64" x2="78" y2="24" />
          <line x1="56" y1="64" x2="84" y2="34" />
          <line x1="68" y1="64" x2="86" y2="48" />
        </g>

        {/* Segundo passe de hachura amarela cruzada leve para dar textura de lápis de cor */}
        <g stroke="#ca8a04" strokeWidth="1.1" opacity="0.45" strokeLinecap="round">
          <line x1="2" y1="26" x2="38" y2="60" />
          <line x1="16" y1="26" x2="52" y2="60" />
          <line x1="30" y1="26" x2="66" y2="60" />
          <line x1="44" y1="26" x2="76" y2="56" />
        </g>
      </g>

      {/* 5. Faixa Inferior (59 a 84): Hachura diagonal a lápis grafite */}
      <g clipPath="url(#bat-bot-clip)">
        <clipPath id="bat-bot-clip">
          <rect x="0" y="59" width="76" height="26" />
        </clipPath>
        <path d="M 0 59 L 76 59 L 76 84 L 0 84 Z" fill="#eae3d2" opacity="0.8" />
        <g stroke="#4f5661" strokeWidth="1.3" opacity="0.75" strokeLinecap="round">
          <line x1="-5" y1="72" x2="18" y2="56" />
          <line x1="0" y1="84" x2="28" y2="56" />
          <line x1="12" y1="88" x2="40" y2="56" />
          <line x1="24" y1="88" x2="52" y2="56" />
          <line x1="36" y1="88" x2="64" y2="56" />
          <line x1="48" y1="88" x2="76" y2="56" />
          <line x1="60" y1="88" x2="84" y2="66" />
          <line x1="70" y1="88" x2="86" y2="76" />
        </g>
      </g>

      {/* 6. Linhas Divisórias Horizontais (duas passadas de grafite) */}
      <path d={div1_a} stroke="#2a2e35" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={div1_b} stroke="#2a2e35" strokeWidth="1.1" opacity="0.6" strokeLinecap="round" fill="none" />

      <path d={div2_a} stroke="#2a2e35" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={div2_b} stroke="#2a2e35" strokeWidth="1.1" opacity="0.6" strokeLinecap="round" fill="none" />

      {/* 7. Ícone do Raio no Centro da Faixa Amarela */}
      {/* Preenchimento grafite com hachura interna do raio */}
      <path d={boltA} fill="#374151" opacity="0.88" />
      <g clipPath="url(#bat-bolt-clip)">
        <clipPath id="bat-bolt-clip">
          <path d={boltA} />
        </clipPath>
        <g stroke="#1f2937" strokeWidth="1.6" opacity="0.9" strokeLinecap="round">
          <line x1="28" y1="36" x2="48" y2="36" />
          <line x1="28" y1="40" x2="48" y2="40" />
          <line x1="30" y1="44" x2="46" y2="44" />
          <line x1="32" y1="48" x2="44" y2="48" />
        </g>
      </g>
      {/* Contorno do raio em grafite */}
      <path d={boltA} fill="none" stroke="#111827" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d={boltB} fill="none" stroke="#111827" strokeWidth="1.2" opacity="0.6" strokeLinejoin="round" />

      {/* 8. Símbolo '+' desenhado a grafite no canto superior direito */}
      <path d={plusA} stroke="#1f2937" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d={plusB} stroke="#1f2937" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" fill="none" />

      {/* 9. Símbolo '−' desenhado a grafite no canto inferior direito */}
      <path d={minusA} stroke="#1f2937" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d={minusB} stroke="#1f2937" strokeWidth="1.4" opacity="0.6" strokeLinecap="round" fill="none" />

      {/* 10. Contorno Externo do Retângulo Principal (duas passadas de grafite) */}
      <path d={box1} fill="none" stroke="#2a2e35" strokeWidth="2.8" strokeLinejoin="round" />
      <path d={box2} fill="none" stroke="#2a2e35" strokeWidth="1.2" opacity="0.55" strokeLinejoin="round" />

      {/* 11. Anéis de contato elétrico nos terminais para conecção com os fios */}
      <path d={ringP} fill="#f7f1e1" stroke="#2a2e35" strokeWidth="2" />
      <path d={ringN} fill="#f7f1e1" stroke="#2a2e35" strokeWidth="2" />
    </g>
  );
};
