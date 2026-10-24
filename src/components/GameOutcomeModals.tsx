import React from 'react';
import { Trophy, AlertOctagon, ArrowRight } from 'lucide-react';
import { soundManager } from '../logic/sound';

interface VictoryModalProps {
  playerName: string;
  score: number;
  totalTimeSeconds: number;
  onProceedToRanking: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  playerName,
  score,
  totalTimeSeconds,
  onProceedToRanking,
}) => {
  const mins = Math.floor(totalTimeSeconds / 60);
  const secs = totalTimeSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="relative max-w-md w-full bg-amber-50 border-2 border-amber-400 rounded-md p-8 shadow-2xl sketch-border text-center">
        {/* Top Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-white/75 border border-amber-200 shadow-xs rotate-1 pointer-events-none rounded-xs" />

        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-inner">
            <Trophy className="w-9 h-9 text-amber-600 fill-amber-300" />
          </div>
        </div>

        <h2 className="font-caveat font-extrabold text-4xl sm:text-5xl text-amber-950 mb-1">
          Vitória Completa!
        </h2>
        <p className="font-hand text-xl text-slate-700 mb-6">
          Parabéns, <strong className="text-amber-900 font-bold">{playerName}</strong>! Você decifrou com maestria todas as 15 fases de circuitos lógicos!
        </p>

        <div className="bg-white/90 border border-amber-300 rounded-sm p-4 mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase font-mono-code font-bold text-slate-500">
              Pontuação Final
            </div>
            <div className="font-caveat font-extrabold text-3xl text-emerald-700">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-mono-code font-bold text-slate-500">
              Tempo Total
            </div>
            <div className="font-mono-code font-bold text-2xl text-slate-800">
              {timeFormatted}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playSuccess();
            onProceedToRanking();
          }}
          className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-caveat font-bold text-3xl rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Ver Sua Posição no Ranking
          <ArrowRight className="w-6 h-6" />
        </button>
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

export const DefeatModal: React.FC<DefeatModalProps> = ({
  playerName,
  reason,
  lastPhaseId,
  score,
  onProceedToRanking,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="relative max-w-md w-full bg-slate-100 border-2 border-red-300 rounded-md p-8 shadow-2xl sketch-border text-center">
        {/* Top Tape */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-white/75 border border-slate-300 shadow-xs -rotate-2 pointer-events-none rounded-xs" />

        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center shadow-inner">
            <AlertOctagon className="w-9 h-9 text-red-600" />
          </div>
        </div>

        <h2 className="font-caveat font-extrabold text-4xl text-slate-900 mb-1">
          Fim de Partida
        </h2>
        <p className="font-hand text-xl text-slate-700 mb-4">
          Que pena, <strong className="text-slate-900 font-bold">{playerName}</strong>!{' '}
          {reason === 'hearts'
            ? 'Seus corações se esgotaram antes de completar o circuito.'
            : 'O cronômetro da fase atingiu o tempo limite de 5 minutos.'}
        </p>

        <div className="bg-white border border-slate-300 rounded-sm p-4 mb-6">
          <div className="text-xs uppercase font-mono-code font-bold text-slate-500">
            Fase Alcançada: <strong className="text-slate-800">{lastPhaseId}</strong>
          </div>
          <div className="font-caveat font-extrabold text-3xl text-slate-900 mt-1">
            {score.toLocaleString()} pontos acumulados
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playPaperTap();
            onProceedToRanking();
          }}
          className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-caveat font-bold text-2xl rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Salvar e Ir para o Ranking
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
