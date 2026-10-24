import React, { useMemo } from 'react';
import { jitterPath, makeRng } from './handDrawn';

export type BulbDamageState = 'intact' | 'cracked' | 'broken';

interface LightbulbSvgProps {
  x: number;
  y: number;
  isOn: boolean;
  damageState?: BulbDamageState;
  hasFishInBulb?: boolean;
  isPixelBulb?: boolean;
  isTvBulb?: boolean;
}

// Ilustrações fornecidas para as fases especiais (mantidas como estão).
const FISH_NORMAL_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023182755_b0056b66.png';
const FISH_ELECTROCUTED_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023183041_5ee1b4b9.png';
const FISH_BROKEN_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023183234_6f0a206d.png';

const PIXEL_BULB_OFF_SRC = '/assets/aistudio/Pixel-A_8f925637';
const PIXEL_BULB_ON_SRC = '/assets/aistudio/Pixel-B_9890e7d1';
const PIXEL_BULB_BROKEN_SRC = '/assets/aistudio/Pixel-C_8ffc14b0';

// Televisão pixel art personalizada:
// Ligada: 1ª em anexo, Desligada: 2ª em anexo, Quebrando (2 corações): 4ª em anexo (Blue Screen), Quebrada: 3ª em anexo (Rachada)
const TV_ON_SRC = '/assets/tv/tv_on.png';
const TV_OFF_SRC = '/assets/tv/tv_off.png';
const TV_CRACKED_SRC = '/assets/tv/tv_cracked.png';
const TV_BROKEN_SRC = '/assets/tv/tv_broken.png';

const GLASS_D =
  'M 24 -46 C 44 -46 56 -30 56 -10 C 56 6 44 20 38 32 L 10 32 C 4 20 -8 6 -8 -10 C -8 -30 4 -46 24 -46 Z';
const CRACK_D = 'M 22 -45 L 26 -32 L 15 -20 L 25 -6 L 12 8 L 22 22 L 16 32';
const SOCKET_D = 'M 6 32 L 42 32 L 42 58 L 6 58 Z';

const INK = '#2a2e35';
const PAPER = '#f7f0de';
const hand = (size: number, weight = 700): React.CSSProperties => ({
  fontFamily: 'var(--font-title)',
  fontSize: size,
  fontWeight: weight,
});

/** Riscos de lápis irradiando da lâmpada (curtos e irregulares, sem brilho neon). */
const PencilRays: React.FC<{ cx: number; cy: number; r1: number; r2: number; cracked?: boolean }> = ({ cx, cy, r1, r2, cracked }) => {
  const rays = useMemo(() => {
    const rng = makeRng(`rays-${cx}-${cy}`);
    return [-90, -52, -128, -14, -166, 24, 156].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const j = (rng() - 0.5) * 6;
      const a1 = r1 + j;
      const a2 = r2 + (rng() - 0.5) * 8;
      const wob = (rng() - 0.5) * 3;
      const x1 = cx + a1 * Math.cos(a);
      const y1 = cy + a1 * Math.sin(a);
      const x2 = cx + a2 * Math.cos(a);
      const y2 = cy + a2 * Math.sin(a);
      const mx = (x1 + x2) / 2 - Math.sin(a) * wob;
      const my = (y1 + y2) / 2 + Math.cos(a) * wob;
      return { d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, delay: i * 40 };
    });
  }, [cx, cy, r1, r2]);
  return (
    <g stroke="#d9830f" strokeWidth="3" strokeLinecap="round" fill="none" opacity={cracked ? 0.6 : 0.9}>
      {rays.map((r, i) => (
        <path key={i} d={r.d} pathLength={1} className="bulb-ray" style={{ animationDelay: `${r.delay}ms` }} />
      ))}
    </g>
  );
};

/** Raio elétrico desenhado (substitui os emojis de ⚡). */
const Zap: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path
    d="M 0 0 L -6 10 L 1 10 L -5 22"
    transform={`translate(${x} ${y}) scale(${s})`}
    fill="none"
    stroke="#d9830f"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Shards: React.FC = () => (
  <g fill={PAPER} stroke={INK} strokeWidth="2" strokeLinejoin="round">
    <path d="M 18 -42 L 30 -44 L 24 -32 Z" />
    <path d="M 46 -12 L 58 -22 L 54 -8 Z" />
    <path d="M 52 14 L 64 8 L 59 22 Z" />
    <path d="M -2 -14 L -14 -22 L -8 -6 Z" />
    <path d="M -10 16 L -20 26 L -8 28 Z" />
  </g>
);

export const LightbulbSvg: React.FC<LightbulbSvgProps> = ({
  x,
  y,
  isOn,
  damageState = 'intact',
  hasFishInBulb = false,
  isPixelBulb = false,
  isTvBulb = false,
}) => {
  const isCracked = damageState === 'cracked';
  const isBroken = damageState === 'broken';

  // Lâmpada/TV quebrada não irradia luz normalmente.
  const effectivelyOn = isOn && !isBroken;

  const fishImageSrc = isBroken ? FISH_BROKEN_SRC : isOn ? FISH_ELECTROCUTED_SRC : FISH_NORMAL_SRC;
  const pixelBulbImageSrc = isBroken ? PIXEL_BULB_BROKEN_SRC : isOn ? PIXEL_BULB_ON_SRC : PIXEL_BULB_OFF_SRC;

  // Imagens da TV conforme especificado pelo usuário:
  // - Ligada: 1ª em anexo (TV ligada)
  // - Desligada: 2ª em anexo (TV desligada)
  // - Quebrando (dois corações): 4ª em anexo (Blue Screen com :()
  // - Quebrada (perdeu): 3ª em anexo (Tela rachada)
  const tvImageSrc = isBroken
    ? TV_BROKEN_SRC
    : isCracked
    ? TV_CRACKED_SRC
    : isOn
    ? TV_ON_SRC
    : TV_OFF_SRC;

  const glassA = useMemo(() => jitterPath(GLASS_D, 'glass-a', 0.9), []);
  const glassB = useMemo(() => jitterPath(GLASS_D, 'glass-b', 1.7), []);
  const crack = useMemo(() => jitterPath(CRACK_D, 'crack', 0.6), []);
  const socketA = useMemo(() => jitterPath(SOCKET_D, 'sock-a', 0.8), []);
  const socketB = useMemo(() => jitterPath(SOCKET_D, 'sock-b', 1.4), []);
  const ringA = useMemo(() => jitterPath('M 2 40 C 2 37.5 4 36 6 36 C 8.5 36 10 37.5 10 40 C 10 42.5 8.5 44 6 44 C 4 44 2 42.5 2 40 Z', 'ringA', 0.3), []);
  const ringB = useMemo(() => jitterPath('M 20 62 C 20 59.5 22 58 24 58 C 26.5 58 28 59.5 28 62 C 28 64.5 26.5 66 24 66 C 22 66 20 64.5 20 62 Z', 'ringB', 0.3), []);

  // Hachura de lápis amarelo que "colore" o vidro quando acende.
  const fillStrokes = useMemo(
    () => Array.from({ length: 17 }, (_, i) => {
      const s = -78 + i * 6.8;
      return `M -12 ${s} L 62 ${s + 34}`;
    }),
    []
  );

  const contacts = (
    <>
      <path d={ringA} fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <path d={ringB} fill={PAPER} stroke={INK} strokeWidth="2.2" />
    </>
  );

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none">
      {/* ================= FASE ESPECIAL: TELEVISÃO RETRO PIXEL ================= */}
      {isTvBulb ? (
        <g id="tv-bulb-group">
          {effectivelyOn && (
            <g id="tv-glow-aura">
              <ellipse cx="24" cy="0" rx="60" ry="46" fill="#fef08a" opacity="0.4" filter="blur(6px)" />
              <g fill="#eab308" opacity="0.85">
                <rect x="22" y="-62" width="4" height="10" />
                <rect x="58" y="-48" width="8" height="4" />
                <rect x="68" y="-8" width="10" height="4" />
                <rect x="60" y="24" width="8" height="4" />
                <rect x="-14" y="-48" width="8" height="4" />
                <rect x="-24" y="-8" width="10" height="4" />
                <rect x="-16" y="24" width="8" height="4" />
              </g>
              <text x="56" y="-44" fill="#a35a06" style={hand(18)} transform="rotate(5 56 -44)">
                LIGADA! 📺
              </text>
            </g>
          )}

          <image
            href={tvImageSrc}
            x={-71}
            y={-85}
            width={190}
            height={190}
            preserveAspectRatio="xMidYMid meet"
            style={{ imageRendering: 'pixelated' }}
          />

          {isCracked && !isBroken && (
            <g id="tv-cracked-note">
              <text x="54" y="-22" fill="#2563eb" style={hand(19)} transform="rotate(6 54 -22)">
                TELA AZUL! :(
              </text>
            </g>
          )}

          {isBroken && (
            <g id="tv-broken-note">
              <text x="55" y="-18" fill="#c0392f" style={hand(21)} transform="rotate(8 55 -18)">
                PANE TOTAL! 💥
              </text>
              <text x="35" y="92" textAnchor="middle" fill="#4b515b" style={hand(17, 500)}>
                a televisão quebrou!
              </text>
            </g>
          )}

          {contacts}
        </g>
      ) : hasFishInBulb ? (
        <g id="aquarium-bulb-fish-group">
          {effectivelyOn && <PencilRays cx={24} cy={0} r1={68} r2={84} cracked={isCracked} />}

          <image href={fishImageSrc} x={-71} y={-85} width={190} height={190} preserveAspectRatio="xMidYMid meet" />

          {!isOn && !isBroken && (
            <g id="fish-calm-effects" fill="none" stroke="#3b69ad" strokeWidth="1.5" opacity="0.7">
              <circle cx="14" cy="-2" r="2.5" />
              <circle cx="28" cy="-12" r="3" />
              <circle cx="20" cy="-26" r="1.8" />
              <text x="46" y="-46" fill="#3b69ad" stroke="none" style={hand(17)} transform="rotate(3 46 -46)">glu glu~</text>
            </g>
          )}

          {isOn && !isBroken && (
            <g id="fish-electrocuted-effects">
              <Zap x={48} y={-24} s={1.1} />
              <Zap x={-18} y={-4} s={0.9} />
              <text x="52" y="-40" fill="#a35a06" style={hand(19)} transform="rotate(6 52 -40)">BZZZT!</text>
            </g>
          )}

          {isCracked && !isBroken && (
            <g id="aquarium-crack-overlay" fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
              <path d={crack} strokeWidth="2.4" />
              <path d="M 26 -32 L 38 -28 L 48 -18" strokeWidth="1.8" />
              <path d="M 15 -20 L 4 -16 L -4 -6" strokeWidth="1.8" />
              <text x="50" y="-25" fill="#a35a06" stroke="none" style={hand(18)} transform="rotate(6 50 -25)">CRAC!</text>
            </g>
          )}

          {isBroken && (
            <g id="fish-fallen-out-effects">
              <Shards />
              <text x="64" y="-10" fill="#c0392f" style={hand(21)} transform="rotate(6 64 -10)">SPLASH!</text>
              <text x="35" y="92" textAnchor="middle" fill="#4b515b" style={hand(17, 500)}>
                o peixe caiu na poça d'água!
              </text>
            </g>
          )}

          {contacts}
        </g>
      ) : isPixelBulb ? (
        /* ================= FASE ESPECIAL: LÂMPADA PIXEL 8-BIT ================= */
        <g id="pixel-bulb-group">
          {effectivelyOn && (
            <g id="pixel-glow-aura">
              <g fill="#e29a1c" opacity="0.9">
                <rect x="22" y="-72" width="5" height="12" />
                <rect x="22" y="-56" width="5" height="6" />
                <rect x="52" y="-52" width="10" height="4" />
                <rect x="62" y="-56" width="10" height="4" />
                <rect x="68" y="-12" width="14" height="5" />
                <rect x="84" y="-12" width="6" height="5" />
                <rect x="60" y="24" width="10" height="4" />
                <rect x="70" y="28" width="10" height="4" />
                <rect x="-14" y="-52" width="10" height="4" />
                <rect x="-24" y="-56" width="10" height="4" />
                <rect x="-34" y="-12" width="14" height="5" />
                <rect x="-42" y="-12" width="6" height="5" />
                <rect x="-22" y="24" width="10" height="4" />
                <rect x="-32" y="28" width="10" height="4" />
              </g>
            </g>
          )}

          <image href={pixelBulbImageSrc} x={-71} y={-85} width={190} height={190} preserveAspectRatio="xMidYMid meet" style={{ imageRendering: 'pixelated' }} />

          {isCracked && !isBroken && (
            <g id="pixel-crack-overlay">
              <g fill={INK}>
                <rect x="22" y="-40" width="4" height="8" />
                <rect x="26" y="-32" width="6" height="4" />
                <rect x="18" y="-28" width="8" height="4" />
                <rect x="14" y="-24" width="4" height="8" />
                <rect x="18" y="-16" width="6" height="4" />
                <rect x="24" y="-12" width="4" height="10" />
                <rect x="28" y="-2" width="6" height="4" />
                <rect x="34" y="2" width="6" height="4" />
                <rect x="18" y="2" width="6" height="4" />
                <rect x="12" y="6" width="6" height="4" />
                <rect x="20" y="14" width="4" height="8" />
                <rect x="16" y="22" width="4" height="8" />
              </g>
              <text x="52" y="-25" fill="#a35a06" style={hand(18)} transform="rotate(6 52 -25)">CRAC!</text>
            </g>
          )}

          {isBroken && (
            <g id="pixel-broken-overlay">
              <g fill={INK} opacity="0.9">
                <rect x="8" y="-55" width="8" height="8" />
                <rect x="42" y="-60" width="10" height="6" />
                <rect x="62" y="-35" width="8" height="12" />
                <rect x="-18" y="-20" width="8" height="10" />
                <rect x="58" y="10" width="6" height="8" />
                <rect x="-12" y="18" width="8" height="6" />
              </g>
              <text x="55" y="-18" fill="#c0392f" style={hand(21)} transform="rotate(10 55 -18)">CRASH!</text>
              <text x="35" y="92" textAnchor="middle" fill="#4b515b" style={hand(17, 500)}>lâmpada pixelada quebrada!</text>
            </g>
          )}

          {contacts}
        </g>
      ) : (
        /* ================= LÂMPADA PADRÃO DESENHADA À MÃO ================= */
        <g id="standard-vector-bulb">
          {effectivelyOn && <PencilRays cx={24} cy={-10} r1={62} r2={80} cracked={isCracked} />}

          {!isBroken ? (
            <g>
              <clipPath id="bulb-glass-clip">
                <path d={glassA} />
              </clipPath>

              <path d={glassA} fill={effectivelyOn ? '#fdf1b8' : '#f4eedd'} />

              {/* Colorido a lápis (amarelo) ao acender — hachura que se desenha */}
              {effectivelyOn && (
                <g clipPath="url(#bulb-glass-clip)" stroke="#f0b92a" strokeWidth="3.4" strokeLinecap="round" opacity="0.8">
                  {fillStrokes.map((d, i) => (
                    <path key={i} d={d} pathLength={1} className="bulb-fill-draw" style={{ animationDelay: `${i * 22}ms` }} />
                  ))}
                </g>
              )}

              {/* leve sombreado de grafite quando apagada */}
              {!effectivelyOn && (
                <g clipPath="url(#bulb-glass-clip)" stroke="#4b5058" strokeWidth="1.2" opacity="0.22" strokeLinecap="round">
                  <path d="M 36 -30 L 50 -14" />
                  <path d="M 34 -22 L 52 -4" />
                  <path d="M 36 -12 L 50 2" />
                  <path d="M 38 -2 L 48 8" />
                </g>
              )}

              <path d={glassA} fill="none" stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />
              <path d={glassB} fill="none" stroke={INK} strokeWidth="1" opacity="0.5" strokeLinejoin="round" />

              {/* reflexo */}
              <path d="M 4 -32 C 14 -40 30 -40 38 -34" fill="none" stroke={effectivelyOn ? '#ffffff' : '#9aa0a8'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

              {/* filamento */}
              <path
                d="M 17 32 L 18 2 L 24 -8 L 30 2 L 31 32"
                fill="none"
                stroke={effectivelyOn ? '#9a4a06' : '#4b515b'}
                strokeWidth={effectivelyOn ? 3.2 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {effectivelyOn && <circle cx="24" cy="-8" r="3.6" fill="#f0a020" stroke="#9a4a06" strokeWidth="1.2" />}

              {isCracked && (
                <g id="lamp-crack-lines" fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
                  <path d={crack} strokeWidth="2.6" />
                  <path d="M 26 -32 L 38 -28 L 48 -18" strokeWidth="1.8" />
                  <path d="M 15 -20 L 4 -16 L -4 -6" strokeWidth="1.8" />
                  <path d="M 25 -6 L 36 -2 L 44 10" strokeWidth="1.8" />
                  <path d="M 12 8 L 2 12 L -5 22" strokeWidth="1.6" />
                  <text x="52" y="-34" fill="#a35a06" stroke="none" style={hand(19)} transform="rotate(6 52 -34)">CRAC!</text>
                </g>
              )}
            </g>
          ) : (
            <g id="lamp-shattered-group">
              <path d="M 10 32 L 6 22 L 14 26 L 12 10 L 19 18 L 23 6 L 27 19 L 33 8 L 35 22 L 40 16 L 38 32 Z" fill="#e8e0cc" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
              <path d="M 14 26 L 19 18 L 23 28 L 27 19" fill="none" stroke="#8b919a" strokeWidth="1.6" />
              <path d="M 17 32 L 18 16 L 12 6" fill="none" stroke="#4b515b" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 31 32 L 30 18 L 37 10" fill="none" stroke="#4b515b" strokeWidth="2.2" strokeLinecap="round" />
              <Shards />
              <path d="M 23 6 C 20 -2 28 -8 24 -16 C 20 -24 28 -32 22 -40" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.75" />
              <text x="44" y="-28" fill="#c0392f" style={hand(22)} transform="rotate(10 44 -28)">QUEBROU!</text>
            </g>
          )}

          {/* base de metal (rosca) */}
          <path d={socketA} fill="#e6dec9" />
          <g stroke="#4b515b" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
            <path d="M 8 38 L 40 38" />
            <path d="M 8 45 L 40 45" />
            <path d="M 8 52 L 40 52" />
            <path d="M 13 34 L 22 56" />
            <path d="M 24 34 L 33 56" />
          </g>
          <path d={socketA} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
          <path d={socketB} fill="none" stroke={INK} strokeWidth="1" opacity="0.5" />
          <path d="M 16 58 C 16 65 32 65 32 58 Z" fill="#4b515b" stroke={INK} strokeWidth="2" />
          {contacts}
        </g>
      )}
    </g>
  );
};
