import React, { useState } from 'react';
import { soundManager } from '../logic/sound';
import { HandIcon } from './HandIcons';
import { RoughBg } from './RoughBg';

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
    <div className="desk select-none">
      <div className="sheet-wrap">
        <div className="sheet-shell">
          <div className="sheet" style={{ minHeight: 'calc(100vh - 36px)', justifyContent: 'space-between' }}>
            <div className="sheet-holes" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            {/* Top Bar / Margin Notes */}
            <div className="corner-notes">
              <button
                type="button"
                onClick={onOpenRanking}
                className="margin-link"
                aria-label="Abrir Mural dos Campeões"
              >
                <HandIcon name="trophy" size={20} strokeWidth={2} />
                Mural dos Campeões
              </button>

              <button
                type="button"
                onClick={onToggleMute}
                className="margin-link"
                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              >
                <HandIcon name={isMuted ? 'speakerMuted' : 'speaker'} size={20} strokeWidth={2} />
                som {isMuted ? 'desligado' : 'ligado'}
              </button>
            </div>

            {/* Sub-header tag */}
            <div style={{ marginTop: 8 }}>
              <span className="phase-tag__kicker" style={{ borderBottom: '2px dashed var(--pencil-blue)', paddingBottom: 2 }}>
                Caderno de Lógica Digital • Circuitos & Portas
              </span>
            </div>

            {/* Main Centerpiece */}
            <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 'min(580px, 100%)', padding: '36px 32px 30px' }}>
                <RoughBg seed="title-card" fill="#fffdfa" stroke="#2a2e35" strokeWidth={2.8} amp={2.4} />
                <span className="tape tape--l" style={{ top: -11, left: 32 }} />
                <span className="tape tape--r" style={{ top: -11, right: 32 }} />

                <div className="rough-content">
                  {/* Title */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                    <span style={{ fontSize: '38px' }}>📎</span>
                    <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(46px, 6vw, 64px)', fontWeight: 700, color: 'var(--ink)', margin: 0, lineHeight: 1 }}>
                      Lógica de Papel
                    </h1>
                    <span style={{ fontSize: '38px' }}>💡</span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-read)', fontSize: '18px', color: 'var(--ink-soft)', margin: '14px auto 24px', maxWidth: '440px', lineHeight: 1.4 }}>
                    Conecte clipes como chaves manuais, feche caminhos elétricos e domine as portas lógicas para resolver as 15 fases do caderno!
                  </p>

                  {/* Player Name Form */}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 'min(380px, 100%)', textAlign: 'left' }}>
                      <label
                        htmlFor="player-name-input"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-note)', fontSize: '16px', color: 'var(--ink-soft)' }}
                      >
                        <HandIcon name="pencil" size={17} strokeWidth={2} />
                        Seu nome ou apelido para o ranking:
                      </label>

                      <div style={{ position: 'relative', marginTop: 4 }}>
                        <input
                          id="player-name-input"
                          type="text"
                          maxLength={20}
                          value={playerName}
                          onChange={(e) => {
                            onChangePlayerName(e.target.value);
                            if (e.target.value.trim()) setNameError(false);
                          }}
                          placeholder="escreva seu nome aqui..."
                          className="hand-input"
                          autoComplete="off"
                        />
                      </div>

                      {nameError && (
                        <span style={{ fontFamily: 'var(--font-title)', fontSize: '18px', color: 'var(--pencil-red)', marginTop: 4, display: 'block' }}>
                          * Por favor, anote seu nome antes de iniciar!
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="hand-btn"
                      style={{ ['--r' as string]: '-1.8deg', fontSize: '34px', padding: '12px 38px', marginTop: 10 }}
                    >
                      <RoughBg seed="start-btn" fill="#e4efd3" stroke="#2f5f3a" hatch="hatch-green" hatchOpacity={0.35} strokeWidth={3} amp={2.2} />
                      <span className="rough-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, color: '#1f4a2a' }}>
                        <HandIcon name="play" size={26} strokeWidth={3} fill="#2f5f3a" />
                        Iniciar Partida
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
