import React from 'react';
import { LogicGateType } from '../logic/types';
import { GATE_CATALOG } from '../logic/gates';
import { soundManager } from '../logic/sound';
import { RoughBg } from './RoughBg';
import { LogicGateSvg } from './LogicGateSvg';

interface EducationalModalProps {
  gateType: LogicGateType;
  onClose: () => void;
}

/** Post-it azul educativo com o símbolo desenhado e a tabela-verdade. */
export const EducationalModal: React.FC<EducationalModalProps> = ({ gateType, onClose }) => {
  const gateInfo = GATE_CATALOG[gateType];
  if (!gateInfo) return null;

  const close = () => {
    soundManager.playPaperTap();
    onClose();
  };

  return (
    <div className="paper-scrim" onClick={close}>
      <div
        className="postit-modal postit-modal--read postit postit--blue"
        role="dialog"
        aria-label={`Guia da porta ${gateInfo.namePt}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="tape tape--l" style={{ top: -10, left: '50%', marginLeft: -31 }} />

        <div className="postit-modal__kicker">nova porta no caderno!</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h2 className="postit-modal__title">Porta Lógica: {gateInfo.namePt}</h2>
          <svg width="96" height="64" viewBox="-44 -34 100 68" aria-hidden="true" style={{ flex: 'none' }}>
            <LogicGateSvg id="guide" type={gateType} x={0} y={0} label="" />
          </svg>
        </div>

        <p className="postit-modal__text">{gateInfo.descriptionPt}</p>

        <div className="rough-host" style={{ padding: '12px 14px', marginBottom: 18 }}>
          <RoughBg seed={`tt-${gateType}`} fill="#f7fbfd" stroke="#1f3b52" strokeWidth={2} amp={1.5} />
          <div className="rough-content">
            <table className="truth-table">
              <caption style={{ captionSide: 'top', fontFamily: 'var(--font-note)', fontSize: 14, marginBottom: 4, textAlign: 'left' }}>
                Tabela-verdade (0 = aberto · 1 = fechado)
              </caption>
              <thead>
                <tr>
                  {gateInfo.inputsCount === 1 ? (
                    <th>Entrada</th>
                  ) : (
                    <>
                      <th>Entrada A</th>
                      <th>Entrada B</th>
                    </>
                  )}
                  <th>Saída</th>
                </tr>
              </thead>
              <tbody>
                {gateInfo.truthTable.map((row, idx) => (
                  <tr key={idx}>
                    {row.inputs.map((val, i) => (
                      <td key={i}>{val}</td>
                    ))}
                    <td className={row.output === 1 ? 'out-1' : ''}>
                      {row.output} {row.output === 1 ? '— acesa ☀' : '— apagada ○'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button type="button" className="hand-btn" style={{ ['--r' as string]: '-1.2deg', fontSize: 26, width: '100%' }} onClick={close}>
          <RoughBg seed={`edu-${gateType}`} fill="#e4f1f8" stroke="#1f3b52" hatch="hatch-blue" hatchOpacity={0.25} strokeWidth={2.6} amp={2} />
          <span className="rough-content">Entendido, vamos ao circuito!</span>
        </button>
      </div>
    </div>
  );
};
