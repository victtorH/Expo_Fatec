import React from 'react';
import { Heart, Timer, RefreshCw, CheckCircle2, HelpCircle, BookOpen } from 'lucide-react';
import { soundManager } from '../logic/sound';

interface StickyNoteHUDProps {
  phaseId: string;
  phaseOrder: number;
  hearts: number; // 0.0 to 3.0+
  elapsedSeconds: number; // 0 to 300
  attemptsCount: number;
  hasMadeError: boolean;
  onConcluir: () => void;
  onRedefinir: () => void;
  onOpenHint: () => void;
  onOpenEducational?: () => void;
  isEducationalAvailable?: boolean;
}

export const StickyNoteHUD: React.FC<StickyNoteHUDProps> = ({
  phaseId,
  phaseOrder,
  hearts,
  elapsedSeconds,
  attemptsCount,
  hasMadeError,
  onConcluir,
  onRedefinir,
  onOpenHint,
  onOpenEducational,
  isEducationalAvailable,
}) => {
  // Format elapsed time MM:SS
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Time remaining until 5:00 limit
  const remaining = Math.max(0, 300 - elapsedSeconds);
  const isTimeCritical = remaining <= 60;

  // Render hearts (fixed to 3 hearts; supports half hearts 0.5)
  const renderHearts = () => {
    const heartElements = [];
    const maxHearts = 3;

    for (let i = 1; i <= maxHearts; i++) {
      if (hearts >= i) {
        // Full heart
        heartElements.push(
          <span key={i} className="text-red-500 text-2xl drop-shadow-sm select-none" title="1 Coração">
            ❤️
          </span>
        );
      } else if (hearts >= i - 0.5) {
        // Half heart
        heartElements.push(
          <span key={i} className="relative inline-block text-2xl drop-shadow-sm select-none" title="0.5 Coração">
            <span className="text-gray-300">🤍</span>
            <span className="absolute top-0 left-0 w-1/2 overflow-hidden text-red-500">❤️</span>
          </span>
        );
      } else {
        // Empty heart
        heartElements.push(
          <span key={i} className="text-gray-300 text-2xl drop-shadow-sm select-none opacity-60" title="Coração perdido">
            🤍
          </span>
        );
      }
    }
    return heartElements;
  };

  return (
    <div className="relative inline-block filter drop-shadow-md select-none transform -rotate-1 hover:rotate-0 transition-transform duration-200">
      {/* Masking tape on top-left and top-right */}
      <div className="absolute -top-3 -left-3 w-12 h-6 bg-white/70 border border-amber-200/50 shadow-xs -rotate-12 z-20 pointer-events-none rounded-xs" />
      <div className="absolute -top-3 -right-3 w-12 h-6 bg-white/70 border border-amber-200/50 shadow-xs rotate-12 z-20 pointer-events-none rounded-xs" />

      {/* Pink Sticky Note Body */}
      <div className="bg-[#fce7f3] border border-pink-200/80 rounded-sm p-4 w-72 sm:w-80 shadow-inner">
        {/* Header: Phase badge & Hearts */}
        <div className="flex items-center justify-between border-b border-pink-300/60 pb-2 mb-2">
          <div className="flex flex-col">
            <span className="font-caveat font-bold text-2xl text-pink-900 tracking-wide">
              Fase {phaseId} <span className="text-lg font-normal text-pink-700">({phaseOrder}/15)</span>
            </span>
            <span className="font-hand text-xs text-pink-700/80 -mt-1">
              Tentativas: {attemptsCount}
            </span>
          </div>

          {/* Hearts Display */}
          <div className="flex items-center gap-0.5" aria-label={`Corações: ${hearts} de 3`}>
            {renderHearts()}
          </div>
        </div>

        {/* Timer readout (00:00 / 05:00 max) */}
        <div className="flex items-center justify-between mb-3 text-pink-950 font-hand text-base">
          <div className="flex items-center gap-1.5">
            <Timer className={`w-4 h-4 ${isTimeCritical ? 'text-red-600 animate-pulse' : 'text-pink-700'}`} />
            <span className="text-xs uppercase tracking-wider text-pink-800 font-bold">Tempo:</span>
          </div>
          <div className="flex items-center gap-1 font-mono-code font-bold text-lg tabular-nums">
            <span className={isTimeCritical ? 'text-red-600 font-extrabold animate-pulse' : 'text-slate-800'}>
              {timeFormatted}
            </span>
            <span className="text-xs text-pink-600 font-normal">/ 05:00</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col gap-2">
          {/* Main Action: CONCLUIR (Validate circuit) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPaperTap();
              onConcluir();
            }}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-caveat font-bold text-2xl rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-800/40"
            aria-label="Concluir e validar o circuito"
          >
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            Concluir
          </button>

          {/* Secondary Action: REDEFINIR (Reset circuit to initial states) */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPaperTap();
              onRedefinir();
            }}
            className="w-full py-1.5 px-3 bg-white/90 hover:bg-white active:scale-[0.98] text-slate-800 font-hand font-bold text-base rounded-sm shadow-xs border border-pink-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Redefinir circuito para configuração inicial"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            Redefinir
          </button>
          <span className="text-[11px] text-pink-800/80 font-hand text-center italic -mt-1 leading-tight">
            Reposiciona os clipes, mas não devolve tempo ou corações.
          </span>
        </div>

        {/* Auxiliary educational & hint actions */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-pink-300/50">
          {/* Educational Post-it review */}
          {isEducationalAvailable && (
            <button
              type="button"
              onClick={onOpenEducational}
              className="text-xs font-hand font-bold text-pink-900 hover:text-pink-950 flex items-center gap-1 underline underline-offset-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Guia da Porta
            </button>
          )}

          {/* Hint button: enabled after error */}
          {hasMadeError && (
            <button
              type="button"
              onClick={onOpenHint}
              className="text-xs font-hand font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-sm border border-amber-300 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              Ver Dica da Fase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
