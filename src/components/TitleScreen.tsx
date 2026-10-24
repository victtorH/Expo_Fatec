import React, { useState } from 'react';
import { Play, Trophy, Volume2, VolumeX, User, Sparkles } from 'lucide-react';
import { soundManager } from '../logic/sound';

interface TitleScreenProps {
  playerName: string;
  onChangePlayerName: (name: string) => void;
  onStartGame: () => void;
  onOpenRanking: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  playerName,
  onChangePlayerName,
  onStartGame,
  onOpenRanking,
  isMuted,
  onToggleMute,
}) => {
  const [nameError, setNameError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    setNameError(false);
    soundManager.playSuccess();
    onStartGame();
  };

  return (
    <div className="relative min-h-screen w-full notebook-ruled-bg flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-x-hidden">
      {/* Top Header / Audio Toggle */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-hand text-sm font-bold text-slate-600 bg-white/70 px-3 py-1 rounded-sm border border-slate-300 shadow-xs">
            Desafio Educacional de Circuitos
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenRanking}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-hand font-bold text-base rounded-sm border border-amber-300 shadow-xs transition-all cursor-pointer"
            aria-label="Abrir Ranking"
          >
            <Trophy className="w-4 h-4 text-amber-700" />
            Ranking
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 bg-white/80 hover:bg-white text-slate-700 rounded-sm border border-slate-300 shadow-xs transition-all cursor-pointer"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Main Title Centerpiece */}
      <div className="my-auto text-center max-w-2xl px-4 flex flex-col items-center">
        {/* Decorative Tape Strip */}
        <div className="w-48 h-8 bg-white/70 border border-amber-200/60 shadow-xs -rotate-2 -mb-4 z-10 pointer-events-none rounded-xs" />

        {/* Paper Card with Title and Name Registration */}
        <div className="bg-white/95 border-2 border-slate-800 rounded-md p-7 sm:p-9 shadow-xl sketch-border relative transform rotate-0.5 w-full max-w-xl">
          {/* Hand-drawn inline SVG Title Lockup */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">📎</span>
            <h1 className="font-caveat font-extrabold text-5xl sm:text-6xl text-slate-900 tracking-tight">
              Lógica de Papel
            </h1>
            <span className="text-4xl">💡</span>
          </div>

          <p className="font-hand text-lg sm:text-xl text-slate-700 max-w-md mx-auto mb-5 leading-relaxed">
            Conecte clipes como chaves elétricas, domine as portas lógicas e cumpra a missão da lâmpada ao longo de 15 fases!
          </p>

          {/* Form to Register Player Name before playing */}
          <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center">
            <div className="w-full max-w-sm text-left mb-3">
              <label
                htmlFor="player-name-input"
                className="block font-hand font-bold text-base text-slate-800 mb-1 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-blue-600" />
                Nome do Jogador / Apelido no Ranking:
              </label>

              <div className="relative">
                <input
                  id="player-name-input"
                  type="text"
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => {
                    onChangePlayerName(e.target.value);
                    if (e.target.value.trim()) setNameError(false);
                  }}
                  placeholder="Escreva seu nome aqui..."
                  className={`w-full px-3.5 py-2.5 bg-amber-50/70 border-2 rounded-sm font-caveat font-bold text-2xl text-slate-900 placeholder:text-slate-400 placeholder:font-hand placeholder:text-lg focus:outline-none focus:bg-white transition-all shadow-inner ${
                    nameError
                      ? 'border-red-500 ring-2 ring-red-200'
                      : 'border-slate-400 focus:border-blue-600'
                  }`}
                  autoComplete="off"
                />
              </div>

              {nameError && (
                <span className="text-xs font-hand font-bold text-red-600 mt-1 block">
                  Por favor, digite seu nome ou apelido para salvar sua pontuação no ranking!
                </span>
              )}
            </div>

            {/* Start CTA Button */}
            <button
              type="submit"
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-caveat font-bold text-3xl sm:text-4xl rounded-sm shadow-lg border-2 border-emerald-900/40 transition-all cursor-pointer w-full max-w-sm mt-1"
              aria-label="Registrar nome e Iniciar Partida"
            >
              <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
              Iniciar Partida
            </button>
          </form>

          {/* Quick Controls Hint */}
          <div className="pt-3 border-t border-slate-300 text-slate-600 font-hand text-sm sm:text-base flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              🖱️ <strong>Clique no clipe:</strong> Conectar / Desconectar
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ✅ <strong>Botão Concluir:</strong> Validar circuito
            </span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="w-full max-w-4xl text-center text-slate-500 font-hand text-sm py-4">
        15 Fases Progressivas (A1 a E3) • Portas AND, OR, NOT, NAND, NOR, XOR, XNOR • Registro no Mural dos Campeões
      </div>
    </div>
  );
};
