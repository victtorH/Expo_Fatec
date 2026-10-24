import React from 'react';

export type BulbDamageState = 'intact' | 'cracked' | 'broken';

interface LightbulbSvgProps {
  x: number;
  y: number;
  isOn: boolean;
  damageState?: BulbDamageState;
  hasFishInBulb?: boolean;
  isPixelBulb?: boolean;
}

const FISH_NORMAL_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023182755_b0056b66.png';
const FISH_ELECTROCUTED_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023183041_5ee1b4b9.png';
const FISH_BROKEN_SRC = '/assets/aistudio/187_Sem_T_tulo_20261023183234_6f0a206d.png';

const PIXEL_BULB_OFF_SRC = '/assets/aistudio/Pixel-A_8f925637';
const PIXEL_BULB_ON_SRC = '/assets/aistudio/Pixel-B_9890e7d1';
const PIXEL_BULB_BROKEN_SRC = '/assets/aistudio/Pixel-C_8ffc14b0';

export const LightbulbSvg: React.FC<LightbulbSvgProps> = ({
  x,
  y,
  isOn,
  damageState = 'intact',
  hasFishInBulb = false,
  isPixelBulb = false,
}) => {
  const isCracked = damageState === 'cracked';
  const isBroken = damageState === 'broken';

  // A broken lamp cannot radiate steady normal light
  const effectivelyOn = isOn && !isBroken;

  // Aquarium fish image selection based on requested states:
  // - Lâmpada apagada: Peixe normal nadando na água
  // - Lâmpada ligada: Peixe eletrocutado
  // - Lâmpada quebrada: Peixe cai para fora na poça d'água
  const fishImageSrc = isBroken
    ? FISH_BROKEN_SRC
    : isOn
    ? FISH_ELECTROCUTED_SRC
    : FISH_NORMAL_SRC;

  // Pixel bulb image selection based on requested states:
  // - Lâmpada apagada (OFF): Pixel-A (lâmpada escura / interior preto com filamento branco)
  // - Lâmpada acesa (ON): Pixel-B (lâmpada clara / interior iluminado com filamento preto e halo)
  // - Lâmpada quebrada (BROKEN): Pixel-C (cacos de vidro pixelados voando e filamento partido vermelho)
  const pixelBulbImageSrc = isBroken
    ? PIXEL_BULB_BROKEN_SRC
    : isOn
    ? PIXEL_BULB_ON_SRC
    : PIXEL_BULB_OFF_SRC;

  return (
    <g transform={`translate(${x}, ${y})`} className="select-none pointer-events-none transition-all duration-300">
      {/* Radiant Glow Effect when ON and NOT broken (for standard and fish bulbs) */}
      {effectivelyOn && !isPixelBulb && (
        <>
          {/* Radial Warm Glow Disk */}
          <circle
            cx="24"
            cy="0"
            r={isCracked ? '55' : '65'}
            fill="url(#bulbGlowGradient)"
            opacity={isCracked ? '0.65' : '0.8'}
            className="animate-pulse"
          />

          {/* Radiating Light Rays */}
          <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity={isCracked ? '0.6' : '0.85'}>
            <line x1="24" y1="-62" x2="24" y2="-76" />
            <line x1="56" y1="-48" x2="68" y2="-58" />
            <line x1="72" y1="-15" x2="86" y2="-18" />
            <line x1="68" y1="20" x2="82" y2="28" />
            <line x1="-8" y1="-48" x2="-20" y2="-58" />
            <line x1="-24" y1="-15" x2="-38" y2="-18" />
            <line x1="-20" y1="20" x2="-34" y2="28" />
          </g>
        </>
      )}

      {/* Gradients */}
      <defs>
        <radialGradient id="bulbGlowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fde047" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ============================================================== */}
      {/* CASE A: AQUARIUM FISH LIGHTBULB (Fase Especial com Peixinho)  */}
      {/* ============================================================== */}
      {hasFishInBulb ? (
        <g id="aquarium-bulb-fish-group" className="transition-all duration-300">
          {/* The hand-drawn illustration provided by the user */}
          <image
            href={fishImageSrc}
            x={-71}
            y={-85}
            width={190}
            height={190}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Dynamic effects according to state */}
          {/* 1. When Lamp is OFF & Intact: Calm water bubbles */}
          {!isOn && !isBroken && (
            <g id="fish-calm-effects">
              <circle cx="14" cy="-2" r="2.5" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.6" className="animate-pulse" />
              <circle cx="28" cy="-12" r="3" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="20" cy="-26" r="1.8" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
              <text
                x="48"
                y="-45"
                fill="#0284c7"
                className="font-caveat font-bold select-none rotate-3"
                style={{ fontSize: '15px' }}
              >
                glu glu~ 🫧
              </text>
            </g>
          )}

          {/* 2. When Lamp is ON & Intact/Cracked: Shocked Sparks & Zaps */}
          {isOn && !isBroken && (
            <g id="fish-electrocuted-effects">
              {/* Electric sparks around the fish */}
              <text
                x="46"
                y="-8"
                className="animate-bounce select-none"
                style={{ fontSize: '18px' }}
              >
                ⚡
              </text>
              <text
                x="-15"
                y="10"
                className="animate-pulse select-none"
                style={{ fontSize: '16px' }}
              >
                ⚡
              </text>

              {/* Electric zap lines around the clip electrode */}
              <path
                d="M 20 -20 L 26 -10 L 16 0 L 26 10"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />

              {/* Comic sound text */}
              <text
                x="48"
                y="-40"
                fill="#b45309"
                className="font-caveat font-extrabold select-none rotate-6"
                style={{ fontSize: '16px' }}
              >
                *BZZZT!* ⚡
              </text>
            </g>
          )}

          {/* 3. When Lamp is CRACKED (2 errors): Crack lines overlay */}
          {isCracked && !isBroken && (
            <g id="aquarium-crack-overlay">
              <path
                d="M 22 -45 L 26 -32 L 15 -20 L 25 -6 L 12 8 L 22 22 L 16 32"
                fill="none"
                stroke="#0f172a"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 26 -32 L 38 -28 L 48 -18"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M 15 -20 L 4 -16 L -4 -6"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <text
                x="50"
                y="-25"
                fill="#b45309"
                className="font-caveat font-extrabold select-none rotate-6"
                style={{ fontSize: '15px' }}
              >
                *CRAC!*
              </text>
            </g>
          )}

          {/* 4. When Lamp is BROKEN (3 errors): Water spilled & fish fallen out */}
          {isBroken && (
            <g id="fish-fallen-out-effects">
              {/* Flying shattered glass shards */}
              <g fill="#f8fafc" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round">
                <path d="M 18 -42 L 30 -44 L 24 -32 Z" className="transform rotate-12" />
                <path d="M 52 -18 L 62 -26 L 58 -12 Z" />
                <path d="M -6 -14 L -16 -22 L -10 -6 Z" />
              </g>

              {/* Water splash sound & exclamation */}
              <text
                x="65"
                y="-10"
                fill="#dc2626"
                className="font-caveat font-extrabold select-none rotate-6"
                style={{ fontSize: '18px' }}
              >
                *SPLASH!*
              </text>

              {/* Hand-drawn explanatory caption on desk */}
              <text
                x="35"
                y="85"
                fill="#475569"
                className="font-caveat font-bold select-none italic text-center"
                style={{ fontSize: '14px' }}
              >
                O peixe caiu na poça d'água! 🐟💦
              </text>
            </g>
          )}

          {/* Connection Contact Points on Socket to bridge with the circuit wires */}
          <circle cx="6" cy="40" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
          <circle cx="24" cy="62" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
        </g>
      ) : isPixelBulb ? (
        /* ============================================================== */
        /* CASE B: PIXEL ART 8-BIT LIGHTBULB                              */
        /* ============================================================== */
        <g id="pixel-bulb-group" className="transition-all duration-300">
          {/* Radiant 8-bit Glow Effect when ON and NOT broken */}
          {effectivelyOn && (
            <g id="pixel-glow-aura">
              {/* Stepped Pixel Aura Circles */}
              <circle
                cx="24"
                cy="0"
                r={isCracked ? '55' : '68'}
                fill="url(#bulbGlowGradient)"
                opacity={isCracked ? '0.7' : '0.85'}
                className="animate-pulse"
              />
              {/* 8-bit Pixel Rays (stepped geometric pixel blocks) */}
              <g fill="#f59e0b" opacity="0.9">
                {/* Top rays */}
                <rect x="22" y="-72" width="5" height="12" />
                <rect x="22" y="-56" width="5" height="6" />
                {/* Top-right ray */}
                <rect x="52" y="-52" width="10" height="4" />
                <rect x="62" y="-56" width="10" height="4" />
                {/* Right ray */}
                <rect x="68" y="-12" width="14" height="5" />
                <rect x="84" y="-12" width="6" height="5" />
                {/* Bottom-right ray */}
                <rect x="60" y="24" width="10" height="4" />
                <rect x="70" y="28" width="10" height="4" />
                {/* Top-left ray */}
                <rect x="-14" y="-52" width="10" height="4" />
                <rect x="-24" y="-56" width="10" height="4" />
                {/* Left ray */}
                <rect x="-34" y="-12" width="14" height="5" />
                <rect x="-42" y="-12" width="6" height="5" />
                {/* Bottom-left ray */}
                <rect x="-22" y="24" width="10" height="4" />
                <rect x="-32" y="28" width="10" height="4" />
              </g>

              {/* Pixel Sparkles */}
              <g fill="#d97706" className="animate-bounce">
                <rect x="54" y="-28" width="6" height="6" />
                <rect x="-12" y="-36" width="5" height="5" />
                <rect x="46" y="8" width="5" height="5" />
              </g>

              {/* 8-Bit Pixel Lit Comic Badge */}
              <text
                x="56"
                y="-46"
                fill="#b45309"
                className="font-caveat font-extrabold select-none rotate-6"
                style={{ fontSize: '16px' }}
              >
                *8-BIT GLOW!* ✨
              </text>
            </g>
          )}

          {/* The Pixel Bulb Image Asset from User */}
          <image
            href={pixelBulbImageSrc}
            x={-71}
            y={-85}
            width={190}
            height={190}
            preserveAspectRatio="xMidYMid meet"
            style={{
              imageRendering: 'pixelated',
              filter: effectivelyOn
                ? 'drop-shadow(0 0 14px rgba(250, 204, 21, 0.8))'
                : 'none',
            }}
          />

          {/* Pixel Crack Overlay (When Cracked & Not Broken) */}
          {isCracked && !isBroken && (
            <g id="pixel-crack-overlay">
              {/* Stepped pixel crack lines */}
              <g fill="#0f172a">
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
              <text
                x="52"
                y="-25"
                fill="#b45309"
                className="font-caveat font-extrabold select-none rotate-6"
                style={{ fontSize: '16px' }}
              >
                *CRAC!* (Pixel)
              </text>
            </g>
          )}

          {/* Pixel Broken Shards & Effects (When Broken) */}
          {isBroken && (
            <g id="pixel-broken-overlay">
              {/* Extra floating pixel shards */}
              <g fill="#0f172a" opacity="0.9">
                <rect x="8" y="-55" width="8" height="8" />
                <rect x="42" y="-60" width="10" height="6" />
                <rect x="62" y="-35" width="8" height="12" />
                <rect x="-18" y="-20" width="8" height="10" />
                <rect x="58" y="10" width="6" height="8" />
                <rect x="-12" y="18" width="8" height="6" />
              </g>
              <g fill="#ef4444">
                <rect x="20" y="2" width="4" height="4" />
                <rect x="26" y="6" width="4" height="4" />
              </g>
              {/* Comic explosion text */}
              <text
                x="55"
                y="-18"
                fill="#dc2626"
                className="font-caveat font-extrabold select-none rotate-12"
                style={{ fontSize: '18px' }}
              >
                *CRASH!* 💥
              </text>
              <text
                x="35"
                y="85"
                fill="#475569"
                className="font-caveat font-bold select-none italic text-center"
                style={{ fontSize: '14px' }}
              >
                Lâmpada pixelada quebrada! 👾
              </text>
            </g>
          )}

          {/* Connection Contact Points on Socket to bridge with the circuit wires */}
          <circle cx="6" cy="40" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
          <circle cx="24" cy="62" r="4.5" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2" />
        </g>
      ) : (
        /* ============================================================== */
        /* CASE C: STANDARD VECTOR NOTEBOOK LIGHTBULB                     */
        /* ============================================================== */
        <g id="standard-vector-bulb">
          {/* Bulb Glass Body */}
          {!isBroken ? (
            <g>
              <path
                d="M 24 -46 
                   C 44 -46, 56 -30, 56 -10 
                   C 56 6, 44 20, 38 32 
                   L 10 32 
                   C 4 20, -8 6, -8 -10 
                   C -8 -30, 4 -46, 24 -46 Z"
                fill={effectivelyOn ? '#fef08a' : '#ffffff'}
                stroke="#1e293b"
                strokeWidth="2.8"
                strokeLinejoin="round"
                className="transition-colors duration-200"
              />

              {/* Glass reflection */}
              <path
                d="M 4 -32 C 14 -40, 30 -40, 38 -34"
                fill="none"
                stroke={effectivelyOn ? '#ffffff' : '#94a3b8'}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Filament */}
              <path
                d="M 17 32 L 18 2 L 24 -8 L 30 2 L 31 32"
                fill="none"
                stroke={effectivelyOn ? '#b45309' : '#475569'}
                strokeWidth={effectivelyOn ? '3' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {effectivelyOn && (
                <circle cx="24" cy="-8" r="4" fill="#fbbf24" filter="drop-shadow(0 0 4px #f59e0b)" />
              )}

              {/* Crack Overlay */}
              {isCracked && (
                <g id="lamp-crack-lines">
                  <path
                    d="M 22 -45 L 26 -32 L 15 -20 L 25 -6 L 12 8 L 22 22 L 16 32"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                  />
                  <path
                    d="M 22 -45 L 26 -32 L 15 -20 L 25 -6 L 12 8 L 22 22 L 16 32"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M 26 -32 L 38 -28 L 48 -18" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 15 -20 L 4 -16 L -4 -6" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 25 -6 L 36 -2 L 44 10" fill="none" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 12 8 L 2 12 L -5 22" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
                  <text x="50" y="-32" fill="#b45309" className="font-caveat font-extrabold text-base select-none rotate-6" style={{ fontSize: '15px' }}>
                    *CRAC!*
                  </text>
                </g>
              )}
            </g>
          ) : (
            <g id="lamp-shattered-group">
              <path
                d="M 10 32 L 6 22 L 14 26 L 12 10 L 19 18 L 23 6 L 27 19 L 33 8 L 35 22 L 40 16 L 38 32 Z"
                fill="#e2e8f0"
                stroke="#0f172a"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path d="M 14 26 L 19 18 L 23 28 L 27 19" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
              <path d="M 17 32 L 18 16 L 12 6" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 31 32 L 30 18 L 37 10" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />
              <g fill="#f8fafc" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round">
                <path d="M 18 -42 L 30 -44 L 24 -32 Z" className="transform rotate-12" />
                <path d="M 46 -12 L 58 -22 L 54 -8 Z" />
                <path d="M 52 14 L 64 8 L 59 22 Z" />
                <path d="M -2 -14 L -14 -22 L -8 -6 Z" />
                <path d="M -10 16 L -20 26 L -8 28 Z" />
                <path d="M 46 42 L 56 46 L 48 52 Z" />
                <path d="M -2 46 L -12 50 L -6 56 Z" />
                <path d="M 28 66 L 38 68 L 32 74 Z" />
              </g>
              <path
                d="M 23 6 C 20 -2, 28 -8, 24 -16 C 20 -24, 28 -32, 22 -40"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              <text x="42" y="-28" fill="#dc2626" className="font-caveat font-extrabold select-none rotate-12" style={{ fontSize: '18px' }}>
                *QUEBROU!*
              </text>
            </g>
          )}

          {/* Metal Socket Collar */}
          <rect x="6" y="32" width="36" height="26" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2.6" rx="2" />
          <g stroke="#334155" strokeWidth="1.6">
            <line x1="8" y1="36" x2="40" y2="36" />
            <line x1="8" y1="44" x2="40" y2="44" />
            <line x1="8" y1="52" x2="40" y2="52" />
            <line x1="12" y1="33" x2="22" y2="56" />
            <line x1="22" y1="33" x2="32" y2="56" />
          </g>
          <path d="M 16 58 C 16 64, 32 64, 32 58 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          <circle cx="6" cy="40" r="4" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
          <circle cx="24" cy="62" r="4" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
        </g>
      )}
    </g>
  );
};
