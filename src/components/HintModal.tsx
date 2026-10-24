import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import { soundManager } from '../logic/sound';

interface HintModalProps {
  phaseId: string;
  hint: string;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ phaseId, hint, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative max-w-sm w-full bg-[#fef08a] border border-amber-300 rounded-sm p-5 shadow-2xl transform -rotate-1 select-none">
        {/* Masking tape on top-left and top-right */}
        <div className="absolute -top-3 left-4 w-14 h-6 bg-white/75 border border-amber-200 shadow-xs -rotate-6 pointer-events-none rounded-xs" />
        <div className="absolute -top-3 right-4 w-14 h-6 bg-white/75 border border-amber-200 shadow-xs rotate-6 pointer-events-none rounded-xs" />

        {/* Close Icon */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPaperTap();
            onClose();
          }}
          className="absolute top-2.5 right-2.5 p-1 text-amber-900/70 hover:text-amber-950 cursor-pointer"
          aria-label="Fechar dica"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-amber-300/80 pb-2 mb-3">
          <Lightbulb className="w-6 h-6 text-amber-700 fill-amber-300" />
          <h3 className="font-caveat font-bold text-2xl text-amber-950">
            Dica Exclusiva — Fase {phaseId}
          </h3>
        </div>

        {/* Hint text */}
        <p className="font-hand text-xl text-slate-800 leading-relaxed mb-4">
          &ldquo;{hint}&rdquo;
        </p>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPaperTap();
            onClose();
          }}
          className="w-full py-2 bg-amber-700 hover:bg-amber-800 active:scale-[0.98] text-white font-hand font-bold text-lg rounded-sm shadow-sm transition-all cursor-pointer"
        >
          Voltar ao Circuito
        </button>
      </div>
    </div>
  );
};
