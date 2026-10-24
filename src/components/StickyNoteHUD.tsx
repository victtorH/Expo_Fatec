import React from 'react';
import { soundManager } from '../logic/sound';
import { RoughBg } from './RoughBg';
import { HandIcon } from './HandIcons';

interface StickyNoteHUDProps {
  phaseId: string;
  attemptsCount: number;
  hasMadeError: boolean;
  onConcluir: () => void;
  onRedefinir: () => void;
  onOpenHint: () => void;
  onOpenEducational?: () => void;
  isEducationalAvailable?: boolean;
}

/**
 * Ações da fase, apresentadas como parte da folha:
 *  - Concluir  -> carimbo verde desenhado
 *  - Redefinir -> anotação com setinha circular e sublinhado ondulado
 *  - Dica      -> post-it que "cai" na página depois de um erro
 *  - Guia      -> bilhete azul colado
 * A lógica (callbacks) permanece a mesma do jogo.
 */
export const StickyNoteHUD: React.FC<StickyNoteHUDProps> = ({
  phaseId,
  attemptsCount,
  hasMadeError,
  onConcluir,
  onRedefinir,
  onOpenHint,
  onOpenEducational,
  isEducationalAvailable,
}) => {
  return (
    <div className="actions">
      {isEducationalAvailable && (
        <button type="button" className="guide-note postit postit--blue" onClick={onOpenEducational}>
          <HandIcon name="book" size={20} strokeWidth={1.8} />
          Guia da Porta
        </button>
      )}

      {/* Dica: só existe depois de um erro (regra atual do jogo) */}
      {hasMadeError && (
        <button
          type="button"
          className="postit-btn postit"
          onClick={onOpenHint}
          aria-label={`Ver dica da fase ${phaseId}`}
        >
          dica?
          <small>fase {phaseId}</small>
        </button>
      )}

      <div>
        <button
          type="button"
          className="redo-note"
          onClick={() => {
            soundManager.playPaperTap();
            onRedefinir();
          }}
          aria-label="Redefinir circuito para configuração inicial"
        >
          <HandIcon name="reset" size={26} strokeWidth={2.4} />
          Redefinir
        </button>
        <span className="redo-sub">Reposiciona os clipes, mas não devolve tempo ou corações.</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="stamp-btn"
          onClick={() => {
            soundManager.playPaperTap();
            onConcluir();
          }}
          aria-label="Concluir e validar o circuito"
        >
          <RoughBg seed={`concluir-${phaseId}`} fill="#e4efd3" stroke="#2f5f3a" hatch="hatch-green" hatchOpacity={0.4} strokeWidth={3} amp={2.2} />
          <span className="rough-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <HandIcon name="check" size={30} strokeWidth={3.4} />
            Concluir
          </span>
        </button>
        <div className="attempts-note">tentativas nesta fase: {attemptsCount}</div>
      </div>
    </div>
  );
};
