import React from 'react';
import { soundManager } from '../logic/sound';
import { RoughBg } from './RoughBg';

interface VictoryModalProps {
  playerName: string;
  score: number;
  totalTimeSeconds: number;
  onProceedToRanking: () => void;
}

/** Selo desenhado à mão: estrela de lápis com visto no centro. */
const VictorySeal: React.FC = () => (
  <svg width="104" height="104" viewBox="0 0 104 104" fill="none" aria-hidden="true" style={{ display: 'block', margin: '0 auto 6px' }}>
    <path
      d="M 52 6 L 63 33 L 92 30 L 72 52 L 90 76 L 61 72 L 52 99 L 42 72 L 13 78 L 32 53 L 14 28 L 42 33 Z"
      fill="#fbe58a"
      stroke="#6b4f10"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M 52 6 L 63 33 L 92 30 L 72 52 L 90 76 L 61 72 L 52 99 L 42 72 L 13 78 L 32 53 L 14 28 L 42 33 Z"
      fill="url(#hatch-yellow)"
      opacity="0.55"
    />
    <path pathLength="1" className="check-draw" d="M 30 54 L 46 70 L 76 34" stroke="#2f5f3a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const VictoryModal: React.FC<VictoryModalProps> = ({ playerName, score, totalTimeSeconds, onProceedToRanking }) => {
  const mins = Math.floor(totalTimeSeconds / 60);
  const secs = totalTimeSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  return (
    <div className="paper-scrim">
      <div className="paper-modal" role="dialog" aria-label="Vitória completa">
        <RoughBg seed="victory" fill="#faf3dc" stroke="#6b4f10" hatch="hatch-yellow" hatchOpacity={0.1} strokeWidth={3} amp={2.4} />
        <span className="tape tape--l" style={{ top: -10, left: '50%', marginLeft: -31 }} />
        <div className="rough-content">
          <VictorySeal />
          <h2 className="paper-modal__title">Vitória completa!</h2>
          <p className="paper-modal__text">
            Parabéns, <strong style={{ color: 'var(--pencil-blue)' }}>{playerName}</strong>! Você decifrou todas as 15 fases de circuitos lógicos!
          </p>
          <div className="paper-modal__stats">
            <div>
              <span>pontuação final</span>
              <b>{score.toLocaleString()}</b>
            </div>
            <div>
              <span>tempo total</span>
              <b>{timeFormatted}</b>
            </div>
          </div>
          <button
            type="button"
            className="hand-btn"
            style={{ ['--r' as string]: '-1.5deg', width: '100%' }}
            onClick={() => {
              soundManager.playSuccess();
              onProceedToRanking();
            }}
          >
            <RoughBg seed="victory-btn" fill="#e4efd3" stroke="#2f5f3a" hatch="hatch-green" hatchOpacity={0.4} strokeWidth={3} amp={2.2} />
            <span className="rough-content" style={{ color: '#1f4a2a' }}>Ver minha posição no ranking →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface DefeatModalProps {
  playerName: string;
  reason: 'hearts' | 'time';
  lastPhaseId: string;
  score: number;
  onProceedToRanking: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({ playerName, reason, lastPhaseId, score, onProceedToRanking }) => {
  return (
    <div className="paper-scrim">
      <div className="paper-modal paper-modal--defeat" role="dialog" aria-label="Fim de partida">
        <RoughBg seed="defeat" fill="#f3ece0" stroke="#4b515b" hatch="hatch-graphite" hatchOpacity={0.08} strokeWidth={3} amp={2.4} />
        <span className="tape tape--r" style={{ top: -10, left: '50%', marginLeft: -31 }} />
        <div className="rough-content">
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true" style={{ display: 'block', margin: '0 auto 6px' }}>
            <path d="M 42 6 C 63 5 79 21 78 42 C 77 63 61 79 41 78 C 20 77 5 62 6 41 C 7 22 22 7 42 6" stroke="#c0392f" strokeWidth="3" opacity="0.8" />
            <path pathLength="1" className="scribble-draw" d="M 24 24 L 60 60" stroke="#c0392f" strokeWidth="6" strokeLinecap="round" />
            <path pathLength="1" className="scribble-draw" style={{ animationDelay: '0.3s' }} d="M 60 23 L 25 61" stroke="#c0392f" strokeWidth="6" strokeLinecap="round" />
          </svg>
          <h2 className="paper-modal__title">Fim de partida</h2>
          <p className="paper-modal__text">
            Que pena, <strong style={{ color: 'var(--pencil-blue)' }}>{playerName}</strong>!{' '}
            {reason === 'hearts'
              ? 'Seus corações se esgotaram antes de completar o circuito.'
              : 'O cronômetro da fase atingiu o tempo limite de 5 minutos.'}
          </p>
          <div className="paper-modal__stats">
            <div>
              <span>fase alcançada</span>
              <b>{lastPhaseId}</b>
            </div>
            <div>
              <span>pontos acumulados</span>
              <b>{score.toLocaleString()}</b>
            </div>
          </div>
          <button
            type="button"
            className="hand-btn"
            style={{ ['--r' as string]: '1.5deg', width: '100%' }}
            onClick={() => {
              soundManager.playPaperTap();
              onProceedToRanking();
            }}
          >
            <RoughBg seed="defeat-btn" fill="#ece4d4" stroke="#2a2e35" hatch="hatch-graphite" hatchOpacity={0.3} strokeWidth={3} amp={2.2} />
            <span className="rough-content">Salvar e ir ao ranking →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
