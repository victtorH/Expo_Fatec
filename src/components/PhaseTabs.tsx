import React from 'react';
import { LevelConfig } from '../logic/types';
import { HandIcon } from './HandIcons';

interface PhaseTabsProps {
  levels: LevelConfig[];
  currentId: string;
  onSelect: (id: string) => void;
}

const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5];

/**
 * Progresso como abas/divisórias de caderno: A–E (3 fases cada).
 * A fase atual "sai" mais da folha; as concluídas ganham um visto a lápis.
 * Clicar numa aba usa o mesmo salto de fase que já existia no seletor.
 */
export const PhaseTabs: React.FC<PhaseTabsProps> = ({ levels, currentId, onSelect }) => {
  const current = levels.find((l) => l.id === currentId);
  return (
    <nav className="phase-tabs" aria-label="Progresso das 15 fases">
      {levels.map((lvl, i) => {
        const state = lvl.id === currentId ? 'current' : current && lvl.order < current.order ? 'done' : 'future';
        return (
          <button
            key={lvl.id}
            type="button"
            className={`phase-tab tab-${lvl.tier.toLowerCase()}`}
            data-state={state}
            style={{ ['--tilt' as string]: `${TILTS[i % TILTS.length]}deg` }}
            aria-current={state === 'current' ? 'step' : undefined}
            aria-label={`Fase ${lvl.id}, ${lvl.order} de 15${state === 'done' ? ', já passou' : state === 'current' ? ', fase atual' : ''}. Pular para esta fase.`}
            title={`Fase ${lvl.id} — ${lvl.title}`}
            onClick={() => onSelect(lvl.id)}
          >
            <span>{lvl.id}</span>
            {state === 'done' && <HandIcon name="check" size={13} strokeWidth={3} />}
          </button>
        );
      })}
    </nav>
  );
};
