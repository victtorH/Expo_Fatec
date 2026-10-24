import React from 'react';
import { Trophy, Play, Home, Award, Calendar } from 'lucide-react';
import { RankingEntry } from '../logic/types';
import { soundManager } from '../logic/sound';

interface RankingScreenProps {
  entries: RankingEntry[];
  currentRunScore?: number;
  currentRunTimeSeconds?: number;
  currentPlayerName?: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({
  entries,
  currentRunScore,
  currentPlayerName,
  onPlayAgain,
  onGoHome,
}) => {
  return (
    <div className="relative min-h-screen w-full notebook-ruled-bg flex flex-col items-center justify-between p-6 sm:p-10 select-none">
      {/* Top Header */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            soundManager.playPaperTap();
            onGoHome();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 font-hand font-bold text-base rounded-sm border border-slate-300 shadow-xs cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Tela Inicial
        </button>

        <h1 className="font-caveat font-extrabold text-4xl sm:text-5xl text-slate-900 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-300" />
          Mural dos Campeões
        </h1>

        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Main Ranking Table Card */}
      <div className="my-auto w-full max-w-3xl relative">
        {/* Taped top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-white/75 border border-amber-200 shadow-xs rotate-1 z-10 pointer-events-none rounded-xs" />

        <div className="bg-white/95 border-2 border-slate-800 rounded-md p-6 sm:p-8 shadow-xl sketch-border">
          {currentRunScore !== undefined && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-sm text-center">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-800">
                Resultado da Partida Recente
              </span>
              <div className="font-caveat font-extrabold text-4xl text-amber-950 mt-1">
                {currentRunScore.toLocaleString()} pontos
              </div>
              {entries.length > 0 && (
                <div className="font-hand text-base text-slate-700 mt-1 flex items-center justify-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>
                    Término da partida:{' '}
                    <strong className="font-mono-code font-bold text-slate-900">
                      {entries[0].completedAt}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ranking Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-hand text-lg">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-500 font-mono-code text-xs uppercase tracking-wider">
                  <th className="py-2 px-2 text-center">Pos.</th>
                  <th className="py-2 px-3">Jogador</th>
                  <th className="py-2 px-3 text-center">Fases</th>
                  <th className="py-2 px-3 text-right">Pontuação</th>
                  <th className="py-2 px-3 text-right">Data e Término</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-hand text-xl">
                      Nenhum registro ainda. Conclua uma partida para registrar sua pontuação!
                    </td>
                  </tr>
                ) : (
                  entries.slice(0, 10).map((entry, index) => {
                    const isCurrentPlayer = Boolean(
                      currentPlayerName &&
                      entry.playerName.toLowerCase() === currentPlayerName.toLowerCase()
                    );
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-slate-200/80 hover:bg-slate-50 transition-colors ${
                          isCurrentPlayer
                            ? 'bg-blue-50/80 font-bold border-l-4 border-l-blue-600'
                            : index === 0
                            ? 'bg-amber-50/60 font-bold'
                            : ''
                        }`}
                      >
                        {/* Position */}
                        <td className="py-2 px-2 text-center font-mono-code font-bold">
                          {index === 0 ? (
                            <span className="text-amber-500 text-xl">🥇</span>
                          ) : index === 1 ? (
                            <span className="text-slate-400 text-xl">🥈</span>
                          ) : index === 2 ? (
                            <span className="text-amber-700 text-xl">🥉</span>
                          ) : (
                            `#${index + 1}`
                          )}
                        </td>

                        {/* Player Name */}
                        <td className="py-2 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                          <span>{entry.playerName}</span>
                          {isCurrentPlayer && (
                            <span className="text-[11px] font-mono-code font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-xs">
                              Você
                            </span>
                          )}
                          {entry.outcome === 'Vitoria' && (
                            <span title="Completou todas as 15 fases!">
                              <Award className="w-4 h-4 text-emerald-600 inline" />
                            </span>
                          )}
                        </td>

                        {/* Phases Completed */}
                        <td className="py-2 px-3 text-center font-mono-code text-sm text-slate-600">
                          {entry.phasesCompleted} / 15
                        </td>

                        {/* Total Score */}
                        <td className="py-2 px-3 text-right font-mono-code font-bold text-slate-900 text-base">
                          {entry.score.toLocaleString()}
                        </td>

                        {/* Date and End Time */}
                        <td className="py-2 px-3 text-right font-mono-code text-xs text-slate-500 whitespace-nowrap">
                          {entry.completedAt}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundManager.playSuccess();
                onPlayAgain();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-caveat font-bold text-2xl rounded-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              Jogar Novamente
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playPaperTap();
                onGoHome();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-hand font-bold text-lg rounded-sm border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>

      {/* Footer Rule Note */}
      <div className="w-full max-w-2xl text-center text-slate-500 font-hand text-sm py-2">
        Critério de ordenação: maior pontuação primeiro; em caso de empate, resultado mais recente primeiro (RF-024).
      </div>
    </div>
  );
};
