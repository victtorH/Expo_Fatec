import React from 'react';
import { RankingEntry } from '../logic/types';
import { soundManager } from '../logic/sound';
import { HandIcon } from './HandIcons';
import { RoughBg } from './RoughBg';

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
    <div className="desk select-none">
      <div className="sheet-wrap">
        <div className="sheet-shell">
          <div className="sheet" style={{ minHeight: 'calc(100vh - 36px)', justifyContent: 'space-between' }}>
            <div className="sheet-holes" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPaperTap();
                  onGoHome();
                }}
                className="margin-link"
              >
                <HandIcon name="home" size={20} strokeWidth={2} />
                Voltar à Capa
              </button>

              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)' }}>
                <HandIcon name="trophy" size={32} strokeWidth={2.4} fill="#f0b92a" />
                Mural dos Campeões
              </h1>

              <div style={{ width: 80 }} />
            </div>

            {/* Ranking Board */}
            <div style={{ margin: 'auto 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 'min(760px, 100%)', padding: '32px 28px' }}>
                <RoughBg seed="ranking-card" fill="#fffdfa" stroke="#2a2e35" strokeWidth={2.6} amp={2.2} />
                <span className="tape tape--l" style={{ top: -11, left: 40 }} />
                <span className="tape tape--r" style={{ top: -11, right: 40 }} />

                <div className="rough-content">
                  {/* Recente banner */}
                  {currentRunScore !== undefined && (
                    <div style={{ position: 'relative', padding: '14px 20px', marginBottom: 20, textAlign: 'center' }}>
                      <RoughBg seed="recent-score" fill="#fdf8e2" stroke="#6b4f10" strokeWidth={1.8} amp={1.6} />
                      <div className="rough-content">
                        <span style={{ fontFamily: 'var(--font-note)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-soft)' }}>
                          Sua partida mais recente
                        </span>
                        <div style={{ fontFamily: 'var(--font-title)', fontSize: 38, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginTop: 2 }}>
                          {currentRunScore.toLocaleString()} pontos
                        </div>
                        {entries.length > 0 && (
                          <div style={{ fontFamily: 'var(--font-note)', fontSize: 14, color: 'var(--ink-soft)', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <HandIcon name="calendar" size={16} strokeWidth={1.8} />
                            <span>Término: <strong style={{ color: 'var(--ink)' }}>{entries[0].completedAt}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tabela de campeões */}
                  <div style={{ overflowX: 'auto' }}>
                    <table className="truth-table" style={{ fontSize: 18, textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                          <th style={{ width: 50, textAlign: 'center' }}>Pos.</th>
                          <th>Jogador</th>
                          <th style={{ textAlign: 'center' }}>Fases</th>
                          <th style={{ textAlign: 'right' }}>Pontuação</th>
                          <th style={{ textAlign: 'right' }}>Data / Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ padding: '24px 0', textAlign: 'center', color: 'var(--ink-soft)' }}>
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
                                style={{
                                  backgroundColor: isCurrentPlayer ? 'rgba(59, 105, 173, 0.08)' : index === 0 ? 'rgba(240, 185, 42, 0.12)' : 'transparent',
                                  fontWeight: isCurrentPlayer || index === 0 ? 700 : 400,
                                }}
                              >
                                <td style={{ textAlign: 'center', fontFamily: 'var(--font-title)', fontSize: 22 }}>
                                  {index === 0 ? '🥇 1º' : index === 1 ? '🥈 2º' : index === 2 ? '🥉 3º' : `${index + 1}º`}
                                </td>
                                <td>
                                  <span style={{ color: 'var(--ink)' }}>{entry.playerName}</span>
                                  {isCurrentPlayer && (
                                    <span style={{ marginLeft: 8, fontSize: 13, fontFamily: 'var(--font-title)', color: 'var(--pencil-blue)' }}>
                                      (você)
                                    </span>
                                  )}
                                  {entry.outcome === 'Vitoria' && (
                                    <span style={{ marginLeft: 6, fontSize: 14 }} title="Completou todas as 15 fases!">
                                      🏆
                                    </span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {entry.phasesCompleted} / 15
                                </td>
                                <td style={{ textAlign: 'right', fontFamily: 'var(--font-title)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
                                  {entry.score.toLocaleString()}
                                </td>
                                <td style={{ textAlign: 'right', fontSize: 14, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                                  {entry.completedAt}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                    <button
                      type="button"
                      className="hand-btn"
                      style={{ ['--r' as string]: '-1.5deg' }}
                      onClick={() => {
                        soundManager.playSuccess();
                        onPlayAgain();
                      }}
                    >
                      <RoughBg seed="again-btn" fill="#e4efd3" stroke="#2f5f3a" hatch="hatch-green" hatchOpacity={0.35} strokeWidth={2.8} amp={2.2} />
                      <span className="rough-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#1f4a2a' }}>
                        <HandIcon name="play" size={22} strokeWidth={2.6} fill="#2f5f3a" />
                        Jogar Novamente
                      </span>
                    </button>

                    <button
                      type="button"
                      className="hand-btn hand-btn--small"
                      style={{ ['--r' as string]: '1deg' }}
                      onClick={() => {
                        soundManager.playPaperTap();
                        onGoHome();
                      }}
                    >
                      <RoughBg seed="home-btn" fill="#f7f0de" stroke="#2a2e35" strokeWidth={2} amp={1.8} />
                      <span className="rough-content" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <HandIcon name="home" size={18} strokeWidth={2} />
                        Voltar à Capa
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
