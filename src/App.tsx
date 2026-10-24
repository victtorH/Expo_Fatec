import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelConfig, RankingEntry } from './logic/types';
import { ALL_LEVELS, getLevelById, getNextLevel } from './logic/levels';
import { evaluateCircuit } from './logic/evaluator';
import {
  calculatePhaseScore,
  sortRankingEntries,
  formatCompletionDateTime,
  upsertRankingEntry,
} from './logic/scoring';
import { soundManager } from './logic/sound';

import { TitleScreen } from './components/TitleScreen';
import { CircuitCanvas } from './components/CircuitCanvas';
import { StickyNoteHUD } from './components/StickyNoteHUD';
import { EducationalModal } from './components/EducationalModal';
import { HintModal } from './components/HintModal';
import { FeedbackBanner } from './components/FeedbackBanner';
import { RankingScreen } from './components/RankingScreen';
import { VictoryModal, DefeatModal } from './components/GameOutcomeModals';
import { Volume2, VolumeX, LogOut, Info } from 'lucide-react';

const INITIAL_RANKING_SEEDS: RankingEntry[] = [
  {
    id: 'rec-1',
    playerName: 'Ada Lovelace',
    score: 38400,
    phasesCompleted: 15,
    totalTimeSeconds: 290,
    completedAt: formatCompletionDateTime(Date.now() - 3600000 * 3),
    timestamp: Date.now() - 3600000 * 3,
    outcome: 'Vitoria',
    lastPhase: 'E3',
  },
  {
    id: 'rec-2',
    playerName: 'Alan Turing',
    score: 32600,
    phasesCompleted: 15,
    totalTimeSeconds: 340,
    completedAt: formatCompletionDateTime(Date.now() - 86400000 - 3600000 * 2),
    timestamp: Date.now() - 86400000 - 3600000 * 2,
    outcome: 'Vitoria',
    lastPhase: 'E3',
  },
  {
    id: 'rec-3',
    playerName: 'Claude Shannon',
    score: 28500,
    phasesCompleted: 14,
    totalTimeSeconds: 420,
    completedAt: formatCompletionDateTime(Date.now() - 172800000 - 3600000 * 5),
    timestamp: Date.now() - 172800000 - 3600000 * 5,
    outcome: 'Derrota',
    lastPhase: 'E2',
  },
];

export function App() {
  // Game lifecycle state
  const [gameState, setGameState] = useState<GameState>('TelaInicial');

  // Progression state
  const [currentLevelId, setCurrentLevelId] = useState<string>('A1');
  const currentLevel: LevelConfig = getLevelById(currentLevelId);

  // Player registration state
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('logica_de_papel_player_name') || '';
    } catch {
      return '';
    }
  });

  const handlePlayerNameChange = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('logica_de_papel_player_name', name);
    } catch {
      // ignore
    }
  };

  // Player resources
  const [hearts, setHearts] = useState<number>(3.0);
  const [phaseSeconds, setPhaseSeconds] = useState<number>(0);
  const [totalGameSeconds, setTotalGameSeconds] = useState<number>(0);
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);

  // Phase-specific tracking
  const [clipStates, setClipStates] = useState<Record<string, boolean>>({});
  const [phaseErrorsCount, setPhaseErrorsCount] = useState<number>(0);
  const [phaseAttemptsCount, setPhaseAttemptsCount] = useState<number>(0);
  const [hasMadeErrorInPhase, setHasMadeErrorInPhase] = useState<boolean>(false);

  // Feedback and Modals
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
    details?: string;
  } | null>(null);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showEducationalModal, setShowEducationalModal] = useState<boolean>(false);
  const [defeatReason, setDefeatReason] = useState<'hearts' | 'time' | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Keep track of which gates have been explained
  const [seenGates, setSeenGates] = useState<Set<string>>(new Set());

  // Sound settings
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Ranking records
  const [rankingEntries, setRankingEntries] = useState<RankingEntry[]>(() => {
    try {
      const saved = localStorage.getItem('logica_de_papel_ranking');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_RANKING_SEEDS;
  });

  // Check URL params (?autostart=1, ?level=A2)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const levelParam = params.get('level');
    if (levelParam && ALL_LEVELS.some((l) => l.id === levelParam)) {
      setCurrentLevelId(levelParam);
      const lvl = getLevelById(levelParam);
      initLevel(lvl);
    }
    if (params.get('autostart') === '1') {
      startNewGame();
    }
  }, []);

  // Sync initial clips when level changes
  const initLevel = useCallback((level: LevelConfig) => {
    const initialStates: Record<string, boolean> = {};
    level.circuit.clips.forEach((clip) => {
      initialStates[clip.id] = clip.initialClosed;
    });
    setClipStates(initialStates);
    setPhaseSeconds(0);
    setPhaseErrorsCount(0);
    setPhaseAttemptsCount(0);
    setHasMadeErrorInPhase(false);
    setFeedback(null);

    // Show educational post-it if this level introduces a new logic gate
    if (level.introducedGate && !seenGates.has(level.introducedGate)) {
      setShowEducationalModal(true);
      setSeenGates((prev) => new Set(prev).add(level.introducedGate!));
    }
  }, [seenGates]);

  const handleJumpToLevel = useCallback((levelId: string) => {
    setCurrentLevelId(levelId);
    const targetLevel = getLevelById(levelId);
    initLevel(targetLevel);
  }, [initLevel]);

  // Start a new game run
  const startNewGame = useCallback(() => {
    setCurrentLevelId('A1');
    setHearts(3.0);
    setAccumulatedScore(0);
    setTotalGameSeconds(0);
    setDefeatReason(null);
    setShowVictoryModal(false);

    const levelA1 = getLevelById('A1');
    initLevel(levelA1);
    setGameState('FaseEmAndamento');
  }, [initLevel]);

  // Phase Timer interval
  useEffect(() => {
    if (gameState !== 'FaseEmAndamento') return;

    const timer = setInterval(() => {
      setPhaseSeconds((prev) => {
        const next = prev + 1;
        // Check 300s (5 minutes) defeat limit
        if (next >= 300) {
          handleDefeat('time');
          return 300;
        }
        return next;
      });
      setTotalGameSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Real-time evaluation of current circuit (for wire glows and bulb state)
  const evaluationResult = evaluateCircuit(currentLevel, clipStates);

  // Toggle switch clipe
  const handleToggleClip = (clipId: string) => {
    if (gameState !== 'FaseEmAndamento') return;
    setClipStates((prev) => ({
      ...prev,
      [clipId]: !prev[clipId],
    }));
  };

  // REDEFINIR action (RF-014, RF-015):
  // Restores initial clip states of this phase.
  // Does NOT reset timer, does NOT restore hearts, does NOT wipe error history.
  const handleRedefinir = () => {
    const initialStates: Record<string, boolean> = {};
    currentLevel.circuit.clips.forEach((clip) => {
      initialStates[clip.id] = clip.initialClosed;
    });
    setClipStates(initialStates);
    setFeedback({
      type: 'success',
      message: 'Circuito redefinido',
      details: 'Os clipes voltaram à posição inicial da fase.',
    });
  };

  // Defeat handler
  const handleDefeat = (reason: 'hearts' | 'time') => {
    soundManager.playError();
    setDefeatReason(reason);
    setGameState('PartidaPerdida');

    // Record result in ranking with the registered player name and authentic completion date/time
    const activePlayerName = playerName.trim() || 'Jogador';
    const now = new Date();
    const newEntry: RankingEntry = {
      id: `run-${now.getTime()}`,
      playerName: activePlayerName,
      score: accumulatedScore,
      phasesCompleted: currentLevel.order - 1,
      totalTimeSeconds: totalGameSeconds,
      completedAt: formatCompletionDateTime(now),
      timestamp: now.getTime(),
      outcome: 'Derrota',
      lastPhase: currentLevel.id,
    };
    saveRankingEntry(newEntry);
  };

  // Save entry to ranking without creating duplicates for the same player name
  const saveRankingEntry = (entry: RankingEntry) => {
    setRankingEntries((prev) => {
      const result = upsertRankingEntry(prev, entry);
      try {
        localStorage.setItem('logica_de_papel_ranking', JSON.stringify(result.entries));
      } catch {
        // storage fallback
      }
      return result.entries;
    });
  };

  // CONCLUIR action (RF-008, RF-009, RF-010):
  // Formal evaluation only on clicking Concluir.
  const handleConcluir = () => {
    if (gameState !== 'FaseEmAndamento') return;

    setPhaseAttemptsCount((prev) => prev + 1);
    const evalRes = evaluateCircuit(currentLevel, clipStates);

    if (evalRes.isMissionSatisfied) {
      // SUCCESS!
      soundManager.playSuccess();
      const isFirstTry = phaseErrorsCount === 0;

      // Calculate score for this phase
      const phaseScoreCalc = calculatePhaseScore(phaseSeconds, isFirstTry);
      const newAccumulated = accumulatedScore + phaseScoreCalc.totalPhaseScore;
      setAccumulatedScore(newAccumulated);

      // First-try reward (RF-019):
      // Only recovers +0.5 heart if first try was successful AND hearts are not complete (< 3.0).
      // If already at 3 hearts, keeps exactly 3.0.
      let recoveredHeart = false;
      if (isFirstTry) {
        if (hearts < 3.0) {
          setHearts((prev) => Math.min(3.0, prev + 0.5));
          recoveredHeart = true;
        }
        setPhaseSeconds((prev) => Math.max(0, prev - 5));
      }

      // Check if E3 was completed -> VICTORY
      const nextLevel = getNextLevel(currentLevel.id);
      if (!nextLevel) {
        // Completed E3!
        const activePlayerName = playerName.trim() || 'Jogador';
        const now = new Date();
        const victoryEntry: RankingEntry = {
          id: `victory-${now.getTime()}`,
          playerName: activePlayerName,
          score: newAccumulated,
          phasesCompleted: 15,
          totalTimeSeconds: totalGameSeconds,
          completedAt: formatCompletionDateTime(now),
          timestamp: now.getTime(),
          outcome: 'Vitoria',
          lastPhase: 'E3',
        };
        saveRankingEntry(victoryEntry);
        setShowVictoryModal(true);
        setGameState('FaseConcluida');
      } else {
        // Show brief success feedback and transition to next level
        setFeedback({
          type: 'success',
          message: `Fase ${currentLevel.id} concluída!`,
          details: isFirstTry
            ? `Bônus de 1ª tentativa aplicado: +${phaseScoreCalc.totalPhaseScore.toLocaleString()} pontos (-5s no tempo${
                recoveredHeart ? ' e +0.5 coração recuperado' : ''
              })!`
            : `+${phaseScoreCalc.totalPhaseScore.toLocaleString()} pontos obtidos!`,
        });

        setTimeout(() => {
          setCurrentLevelId(nextLevel.id);
          initLevel(nextLevel);
        }, 1200);
      }
    } else {
      // INCORRECT SOLUTION (RF-010, RF-011, RF-018)
      const newErrors = phaseErrorsCount + 1;
      setPhaseErrorsCount(newErrors);
      setHasMadeErrorInPhase(true);

      // Sound and visual feedback based on user requirement:
      // Caso erre 2 vezes a lâmpada racha; caso 3 ela quebra
      if (newErrors === 2) {
        soundManager.playGlassCrack();
      } else if (newErrors >= 3) {
        soundManager.playGlassBreak();
      } else {
        soundManager.playError();
      }

      // Penalties: +10s to current timer, -1 heart
      const updatedTimer = Math.min(300, phaseSeconds + 10);
      setPhaseSeconds(updatedTimer);

      const updatedHearts = hearts - 1.0;
      setHearts(updatedHearts);

      let damageWarning = '';
      if (newErrors === 2) {
        damageWarning = ' ⚠️ Atenção: A lâmpada rachou!';
      } else if (newErrors >= 3) {
        damageWarning = ' 💥 A lâmpada quebrou com a sobrecarga!';
      }

      setFeedback({
        type: 'error',
        message:
          newErrors >= 3
            ? 'A lâmpada quebrou!'
            : newErrors === 2
            ? 'A lâmpada rachou!'
            : 'Solução incorreta para a missão!',
        details: `A lâmpada deveria ficar ${
          currentLevel.mission === 'turn_on' ? 'ACESA' : 'APAGADA'
        }. Penalidade: +10s no tempo e -1 coração.${damageWarning} Dica liberada!`,
      });

      // Check terminal conditions
      if (updatedHearts <= 0) {
        handleDefeat('hearts');
      } else if (updatedTimer >= 300) {
        handleDefeat('time');
      }
    }
  };

  // Abandon run (RF-025: discards score)
  const handleAbandonRun = () => {
    soundManager.playPaperTap();
    setGameState('TelaInicial');
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  // ==================== RENDER STATES ====================

  if (gameState === 'TelaInicial') {
    return (
      <TitleScreen
        playerName={playerName}
        onChangePlayerName={handlePlayerNameChange}
        onStartGame={startNewGame}
        onOpenRanking={() => setGameState('Ranking')}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (gameState === 'Ranking') {
    return (
      <RankingScreen
        entries={rankingEntries}
        currentRunScore={accumulatedScore > 0 ? accumulatedScore : undefined}
        currentRunTimeSeconds={totalGameSeconds > 0 ? totalGameSeconds : undefined}
        currentPlayerName={playerName.trim() || undefined}
        onPlayAgain={startNewGame}
        onGoHome={() => setGameState('TelaInicial')}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full notebook-ruled-bg flex flex-col justify-between p-4 sm:p-6 overflow-x-hidden select-none">
      {/* Top Bar: Mission & Status Cluster */}
      <header className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Left: Phase Title & Mission Lockup */}
        <div className="flex items-center gap-3">
          <div className="bg-white/90 border border-slate-300 px-3 py-1.5 rounded-sm shadow-xs flex items-center gap-2">
            <span className="font-caveat font-extrabold text-2xl text-slate-900">
              Fase {currentLevel.id}:
            </span>
            <span className="font-hand font-bold text-lg text-slate-700">
              {currentLevel.title}
            </span>
            {/* Quick Phase Selector */}
            <select
              value={currentLevelId}
              onChange={(e) => handleJumpToLevel(e.target.value)}
              className="ml-1 text-xs font-hand font-bold bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 cursor-pointer"
              title="Pular para outra fase"
            >
              {ALL_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.id} - {lvl.title} {lvl.circuit.isPixelBulb ? '👾' : lvl.circuit.hasFishInBulb ? '🐟' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mission Badge */}
          <div
            className={`px-3 py-1 rounded-sm border shadow-xs flex items-center gap-2 font-hand text-base font-bold ${
              currentLevel.mission === 'turn_on'
                ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                : 'bg-slate-200/90 border-slate-400 text-slate-900'
            }`}
          >
            <span className="text-xl">
              {currentLevel.mission === 'turn_on' ? '💡' : '⭕'}
            </span>
            <span>Missão: {currentLevel.missionText}</span>
          </div>
        </div>

        {/* Right: Player Name, Score, Audio & Abandon Action */}
        <div className="flex items-center gap-3">
          {/* Player badge */}
          <div className="bg-white/90 border border-slate-300 px-2.5 py-1 rounded-sm shadow-xs font-hand text-sm text-slate-700 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">👤</span>
            <span className="font-bold text-slate-800">{playerName.trim() || 'Jogador'}</span>
          </div>

          {/* Score display */}
          <div className="bg-white/90 border border-slate-300 px-3 py-1 rounded-sm shadow-xs font-hand text-sm text-slate-700 flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-xs">Pontos:</span>
            <span className="font-mono-code font-bold text-base text-slate-900 tabular-nums">
              {accumulatedScore.toLocaleString()}
            </span>
          </div>

          {/* Audio Mute Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-sm border border-slate-300 shadow-xs cursor-pointer"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Abandon Game Button */}
          <button
            type="button"
            onClick={handleAbandonRun}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-hand font-bold text-slate-500 hover:text-red-700 bg-white/60 hover:bg-red-50 rounded-sm border border-slate-200 transition-colors cursor-pointer"
            title="Abandonar partida (descarta os pontos atuais)"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      {/* Optional Feedback Alert Banner */}
      {feedback && (
        <FeedbackBanner
          type={feedback.type}
          message={feedback.message}
          details={feedback.details}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Main Playfield: SVG Circuit Canvas */}
      <main className="w-full max-w-5xl mx-auto my-auto flex flex-col items-center justify-center relative">
        <CircuitCanvas
          level={currentLevel}
          clipStates={clipStates}
          onToggleClip={handleToggleClip}
          bulbIsOn={evaluationResult.bulbState}
          wirePowered={evaluationResult.wirePowered}
          damageState={
            phaseErrorsCount >= 3 ? 'broken' : phaseErrorsCount === 2 ? 'cracked' : 'intact'
          }
        />
      </main>

      {/* Bottom Sticky Note Controls HUD */}
      <footer className="w-full max-w-5xl mx-auto flex items-end justify-between pt-2 z-10">
        <StickyNoteHUD
          phaseId={currentLevel.id}
          phaseOrder={currentLevel.order}
          hearts={hearts}
          elapsedSeconds={phaseSeconds}
          attemptsCount={phaseAttemptsCount}
          hasMadeError={hasMadeErrorInPhase}
          onConcluir={handleConcluir}
          onRedefinir={handleRedefinir}
          onOpenHint={() => setShowHintModal(true)}
          onOpenEducational={() => setShowEducationalModal(true)}
          isEducationalAvailable={Boolean(currentLevel.introducedGate)}
        />

        {/* Small subtle help line */}
        <div className="hidden sm:block text-right font-hand text-xs text-slate-500/80 pr-2">
          <span>Clique nos clipes para abrir/fechar o caminho</span>
          <br />
          <span>Pressione &ldquo;Concluir&rdquo; no post-it rosa para testar</span>
        </div>
      </footer>

      {/* Educational Logic Gate Modal */}
      {showEducationalModal && currentLevel.introducedGate && (
        <EducationalModal
          gateType={currentLevel.introducedGate}
          onClose={() => setShowEducationalModal(false)}
        />
      )}

      {/* Exclusive Phase Hint Modal */}
      {showHintModal && (
        <HintModal
          phaseId={currentLevel.id}
          hint={currentLevel.hint}
          onClose={() => setShowHintModal(false)}
        />
      )}

      {/* Victory Celebration Modal */}
      {showVictoryModal && (
        <VictoryModal
          playerName={playerName.trim() || 'Jogador'}
          score={accumulatedScore}
          totalTimeSeconds={totalGameSeconds}
          onProceedToRanking={() => setGameState('Ranking')}
        />
      )}

      {/* Defeat Game Over Modal */}
      {defeatReason && (
        <DefeatModal
          playerName={playerName.trim() || 'Jogador'}
          reason={defeatReason}
          lastPhaseId={currentLevel.id}
          score={accumulatedScore}
          onProceedToRanking={() => setGameState('Ranking')}
        />
      )}
    </div>
  );
}

export default App;
