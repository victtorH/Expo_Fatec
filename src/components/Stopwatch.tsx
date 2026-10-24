import React, { useMemo } from 'react';
import { circlePath, jitterPath } from './handDrawn';

interface StopwatchProps {
  elapsedSeconds: number; // 0 a 300
  limitSeconds?: number;
}

/**
 * Cronômetro desenhado à mão. O mostrador enche (lápis de cor) conforme o
 * tempo passa; perto do limite o contorno dobra, treme e aparece um alerta
 * manuscrito — sem depender só da cor.
 */
export const Stopwatch: React.FC<StopwatchProps> = ({ elapsedSeconds, limitSeconds = 300 }) => {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const digits = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const remaining = Math.max(0, limitSeconds - elapsedSeconds);
  const critical = remaining <= 60;

  const cx = 42;
  const cy = 56;
  const r = 31;

  const face1 = useMemo(() => jitterPath(circlePath(cx, cy, r), 'sw-a', 0.9), []);
  const face2 = useMemo(() => jitterPath(circlePath(cx, cy, r + 2.6), 'sw-b', 1.2), []);
  const crown = useMemo(() => jitterPath('M 36 17 L 36 9 L 48 9 L 48 17', 'sw-c', 0.5), []);
  const ticks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const long = i % 3 === 0;
        const r1 = r - (long ? 8 : 5);
        const r2 = r - 2;
        return jitterPath(
          `M ${cx + r1 * Math.sin(a)} ${cy - r1 * Math.cos(a)} L ${cx + r2 * Math.sin(a)} ${cy - r2 * Math.cos(a)}`,
          `tick-${i}`,
          0.4
        );
      }),
    []
  );

  const frac = Math.min(1, elapsedSeconds / limitSeconds);
  const ang = frac * Math.PI * 2;
  const wedge =
    frac <= 0
      ? ''
      : frac >= 1
      ? circlePath(cx, cy, r - 1)
      : `M ${cx} ${cy} L ${cx} ${cy - (r - 1)} A ${r - 1} ${r - 1} 0 ${frac > 0.5 ? 1 : 0} 1 ${cx + (r - 1) * Math.sin(ang)} ${
          cy - (r - 1) * Math.cos(ang)
        } Z`;

  return (
    <div className={`stopwatch ${critical ? 'stopwatch--critical' : ''}`} role="timer" aria-label={`Tempo da fase: ${digits} de 05:00`}>
      <svg className="stopwatch__face" width="84" height="96" viewBox="0 0 84 96" fill="none" aria-hidden="true">
        {/* argola e botão */}
        <path d={crown} stroke="#2a2e35" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 31 9 L 53 9" stroke="#2a2e35" strokeWidth="3" strokeLinecap="round" />
        <path d="M 62 19 L 68 13" stroke="#2a2e35" strokeWidth="3" strokeLinecap="round" />
        {/* mostrador */}
        <path d={face1} fill="#fbf6e6" />
        {wedge && (
          <path d={wedge} fill={critical ? 'url(#hatch-red)' : 'url(#hatch-yellow)'} opacity={critical ? 0.8 : 0.6} />
        )}
        <path d={face1} stroke="#2a2e35" strokeWidth={critical ? 3 : 2.4} strokeLinejoin="round" />
        <path d={face2} stroke={critical ? '#c0392f' : '#2a2e35'} strokeWidth={critical ? 2 : 1.1} opacity={critical ? 0.95 : 0.5} strokeLinejoin="round" />
        {ticks.map((t, i) => (
          <path key={i} d={t} stroke="#2a2e35" strokeWidth={i % 3 === 0 ? 2 : 1.2} strokeLinecap="round" />
        ))}
        {/* ponteiro de segundos */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${elapsedSeconds * 6}deg)`,
            transition: 'transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1)',
          }}
        >
          <path d={`M ${cx} ${cy + 5} L ${cx} ${cy - 24}`} stroke="#2a2e35" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <circle cx={cx} cy={cy} r="3" fill="#2a2e35" />
      </svg>

      <div>
        <div className="stopwatch__digits" aria-hidden="true">
          {digits.split('').map((ch, i) =>
            ch === ':' ? (
              <span key={i} className="colon">:</span>
            ) : (
              <span key={i} className="d">{ch}</span>
            )
          )}
        </div>
        <div className="stopwatch__label">tempo · limite 05:00</div>
        {critical && <span className="stopwatch__warn">falta pouco!!</span>}
      </div>
    </div>
  );
};
