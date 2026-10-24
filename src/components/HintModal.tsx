import React from 'react';
import { soundManager } from '../logic/sound';
import { HandIcon } from './HandIcons';
import { RoughBg } from './RoughBg';

interface HintModalProps {
  phaseId: string;
  hint: string;
  onClose: () => void;
}

/** Dica como post-it amarelo colado na folha (aparece "caindo" na página). */
export const HintModal: React.FC<HintModalProps> = ({ phaseId, hint, onClose }) => {
  const close = () => {
    soundManager.playPaperTap();
    onClose();
  };
  return (
    <div className="paper-scrim" onClick={close}>
      <div
        className="postit-modal postit"
        role="dialog"
        aria-label={`Dica exclusiva da fase ${phaseId}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="tape tape--l" style={{ top: -10, left: 22 }} />
        <span className="tape tape--r" style={{ top: -10, right: 22 }} />

        <button
          type="button"
          className="scrawl__dismiss"
          style={{ top: 8, right: 8 }}
          onClick={close}
          aria-label="Fechar dica"
        >
          <HandIcon name="close" size={20} strokeWidth={2.4} />
        </button>

        <div className="postit-modal__kicker">dica exclusiva</div>
        <h3 className="postit-modal__title">Fase {phaseId}</h3>
        <p className="postit-modal__text">&ldquo;{hint}&rdquo;</p>

        <button type="button" className="hand-btn hand-btn--small" style={{ ['--r' as string]: '-1.5deg' }} onClick={close}>
          <RoughBg seed={`dica-${phaseId}`} fill="#fff6c8" stroke="#6b4f10" strokeWidth={2.4} amp={1.8} />
          <span className="rough-content">Voltar ao circuito</span>
        </button>
      </div>
    </div>
  );
};
