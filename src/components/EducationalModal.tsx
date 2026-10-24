import React from 'react';
import { LogicGateType } from '../logic/types';
import { GATE_CATALOG } from '../logic/gates';
import { soundManager } from '../logic/sound';

interface EducationalModalProps {
  gateType: LogicGateType;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({ gateType, onClose }) => {
  const gateInfo = GATE_CATALOG[gateType];
  if (!gateInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Sticky Note Styled Modal Container */}
      <div className="relative max-w-md w-full bg-[#fef9c3] border border-amber-300 rounded-sm p-6 shadow-2xl transform rotate-1 select-none">
        {/* Masking tape on top */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-white/75 border border-amber-200 shadow-xs -rotate-2 pointer-events-none rounded-xs" />

        {/* Note Header */}
        <div className="border-b border-amber-300/80 pb-2 mb-3">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold font-mono-code">
            NOVA PORTA INTRODUZIDA!
          </span>
          <h2 className="font-caveat font-bold text-3xl text-amber-950 mt-0.5">
            Porta Lógica: {gateInfo.namePt}
          </h2>
        </div>

        {/* Description */}
        <p className="font-hand text-lg text-slate-800 leading-relaxed mb-4">
          {gateInfo.descriptionPt}
        </p>

        {/* Truth Table */}
        <div className="bg-white/80 border border-amber-300/80 rounded-sm p-3 mb-5">
          <div className="text-xs font-bold text-amber-900 font-mono-code mb-2 uppercase tracking-wide">
            Tabela-Verdade (0 = Aberto / 1 = Fechado)
          </div>
          <table className="w-full text-center font-mono-code text-sm">
            <thead>
              <tr className="border-b border-amber-200 text-amber-900 font-bold">
                {gateInfo.inputsCount === 1 ? (
                  <th className="py-1">Entrada</th>
                ) : (
                  <>
                    <th className="py-1">Entrada A</th>
                    <th className="py-1">Entrada B</th>
                  </>
                )}
                <th className="py-1 text-emerald-800 font-extrabold">Saída</th>
              </tr>
            </thead>
            <tbody>
              {gateInfo.truthTable.map((row, idx) => (
                <tr key={idx} className="border-b border-amber-100 last:border-0 hover:bg-amber-50/50">
                  {row.inputs.map((val, i) => (
                    <td key={i} className="py-1 text-slate-700">
                      {val}
                    </td>
                  ))}
                  <td className={`py-1 font-bold ${row.output === 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {row.output} {row.output === 1 ? '💡 (Acesa)' : '⭕ (Apagada)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPaperTap();
            onClose();
          }}
          className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-900 active:scale-[0.98] text-white font-caveat font-bold text-2xl rounded-sm shadow-md transition-all cursor-pointer"
        >
          Entendido, vamos ao circuito!
        </button>
      </div>
    </div>
  );
};
