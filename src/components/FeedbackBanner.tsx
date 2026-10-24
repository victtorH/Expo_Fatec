import React from 'react';
import { HandIcon } from './HandIcons';
import { RoughBg } from './RoughBg';

interface FeedbackBannerProps {
  type: 'error' | 'success' | 'info';
  message: string;
  details?: string;
  onDismiss?: () => void;
}

/**
 * Feedback como anotação a lápis num bilhete colado sobre a folha.
 * - Erro: rabisco vermelho + X.
 * - Sucesso (passou de fase): visto desenhado + celebração verde.
 * - Info (redefinição dos clipes): anotação simples, tranquila e discreta a lápis grafite.
 */
export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ type, message, details, onDismiss }) => {
  const isError = type === 'error';
  const isInfo = type === 'info';

  const fill = isError ? '#fbeee4' : isInfo ? '#faf8f2' : '#eef5dc';
  const stroke = isError ? '#8d2a22' : isInfo ? '#788290' : '#2f5f3a';
  const hatch = isError ? 'hatch-red' : isInfo ? undefined : 'hatch-green';

  return (
    <div className="scrawl-wrap">
      <div
        className={`scrawl ${isError ? 'scrawl--error' : isInfo ? 'scrawl--info' : 'scrawl--success'}`}
        role="status"
        aria-live="polite"
      >
        <RoughBg
          seed={`${type}-${message}`}
          fill={fill}
          stroke={stroke}
          hatch={hatch}
          hatchOpacity={0.12}
          strokeWidth={isInfo ? 1.8 : 2.2}
          amp={isInfo ? 1.4 : 2}
        />
        <span className="tape tape--l" style={{ top: -9, left: 18, opacity: isInfo ? 0.7 : 1 }} />

        <span className="scrawl__icon rough-content" aria-hidden="true" style={{ top: isInfo ? 12 : 10 }}>
          {isError ? (
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#c0392f" strokeWidth="3.2" strokeLinecap="round">
              <path pathLength="1" className="scribble-draw" d="M 8 8 L 30 30" />
              <path pathLength="1" className="scribble-draw" style={{ animationDelay: '0.3s' }} d="M 30 7 L 9 31" />
              <path d="M 19 3 C 31 2 36 12 35 21 C 34 31 25 36 16 35 C 7 34 2 26 3 17" strokeWidth="1.6" opacity="0.6" />
            </svg>
          ) : isInfo ? (
            <div style={{ color: '#545d6a', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}>
              <HandIcon name="reset" size={22} strokeWidth={2.4} />
            </div>
          ) : (
            <svg width="40" height="38" viewBox="0 0 40 38" fill="none" stroke="#3f7d4a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path pathLength="1" className="check-draw" d="M 5 20 L 15 31 L 35 6" />
              <path d="M 33 22 L 33 28 M 30 25 L 36 25" strokeWidth="1.8" opacity="0.7" />
            </svg>
          )}
        </span>

        <div className="rough-content" style={{ paddingLeft: isInfo ? 4 : 0 }}>
          <div className="scrawl__title">{message}</div>
          {/* Sublinhado apenas para sucesso ou erro; a nota de redefinição é sutil e tranquila */}
          {!isInfo && (
            <svg width="240" height="10" viewBox="0 0 240 10" fill="none" aria-hidden="true" style={{ display: 'block', marginTop: 1 }}>
              <path
                pathLength="1"
                className="scribble-draw"
                d="M 2 6 C 30 1 50 9 80 4 S 130 8 160 3 S 215 8 238 4"
                stroke={isError ? '#c0392f' : '#3f7d4a'}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          )}
          {details && <p className="scrawl__details">{details}</p>}
        </div>

        {onDismiss && (
          <button type="button" className="scrawl__dismiss rough-content" onClick={onDismiss} aria-label="Fechar mensagem">
            <HandIcon name="close" size={18} strokeWidth={2.4} />
          </button>
        )}
      </div>
    </div>
  );
};
