/**
 * PROVISIONAL SCORING MODULE (MÓDULO PROVISÓRIO DE PONTUAÇÃO)
 *
 * Conforme a Seção 11.1 e 17.1 da documentação funcional:
 * - A documentação original especifica: "100 pontos por cada 10 segundos"
 *   e "concluir uma fase na primeira tentativa dobra o valor de pontuação correspondente".
 * - A fórmula completa é pendente de especificação técnica final pelo responsável pelo produto.
 * - Aqui, mantemos o cálculo 100% isolado, determinístico e facilmente alterável.
 */

import { RankingEntry } from './types';

export interface PhaseScoreCalculation {
  basePoints: number;
  timeBonusPoints: number;
  firstTryMultiplier: number;
  totalPhaseScore: number;
  timeUsedSeconds: number;
  timeRemainingSeconds: number;
  isFirstTry: boolean;
}

export const SCORING_CONFIG = {
  // Base points awarded for completing any phase successfully
  BASE_PHASE_POINTS: 200,

  // Points awarded per each full 10-second block of remaining time in the phase (300s max)
  POINTS_PER_TEN_SECONDS_REMAINING: 100,

  // Multiplier applied when completing on the very first "Concluir" attempt
  FIRST_TRY_MULTIPLIER: 2,

  // Penalty in score for each incorrect attempt (optional deduction)
  PENALTY_PER_ERROR_POINTS: 0,
};

/**
 * Calculates score for completing a phase.
 * @param timeUsedSeconds Seconds elapsed in the current phase (0 to 300)
 * @param isFirstTry Whether this was completed on the first attempt without prior errors
 */
export function calculatePhaseScore(
  timeUsedSeconds: number,
  isFirstTry: boolean
): PhaseScoreCalculation {
  const maxTime = 300;
  const timeRemaining = Math.max(0, maxTime - timeUsedSeconds);

  // 100 points for each full 10 seconds remaining
  const tenSecondBlocks = Math.floor(timeRemaining / 10);
  const timeBonusPoints = tenSecondBlocks * SCORING_CONFIG.POINTS_PER_TEN_SECONDS_REMAINING;

  const basePoints = SCORING_CONFIG.BASE_PHASE_POINTS;
  const rawScore = basePoints + timeBonusPoints;

  const multiplier = isFirstTry ? SCORING_CONFIG.FIRST_TRY_MULTIPLIER : 1;
  const totalPhaseScore = rawScore * multiplier;

  return {
    basePoints,
    timeBonusPoints,
    firstTryMultiplier: multiplier,
    totalPhaseScore,
    timeUsedSeconds,
    timeRemainingSeconds: timeRemaining,
    isFirstTry,
  };
}

/**
 * Sorts ranking entries according to strict functional rule RF-024:
 * 1. Highest score first (pontuação maior primeiro).
 * 2. In case of tie in score, the more recent result appears first (mais recente primeiro).
 */
export function sortRankingEntries<T extends { score: number; timestamp: number }>(
  entries: T[]
): T[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.timestamp - a.timestamp;
  });
}

/**
 * Formats a Date or timestamp into a realistic date & time string in Portuguese:
 * e.g. "24/10/2026 às 04:38"
 */
export function formatCompletionDateTime(dateInput: Date | number | string = new Date()): string {
  const date = typeof dateInput === 'object' && dateInput instanceof Date
    ? dateInput
    : new Date(dateInput);

  if (isNaN(date.getTime())) return String(dateInput);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

/**
 * Upserts a ranking entry by player name (case-insensitive).
 * Rules:
 * 1. Each player has only one entry in the ranking.
 * 2. If the player does not exist yet, add them.
 * 3. If the player already exists:
 *    - If newEntry.score > existing.score: update to the new personal best!
 *    - If newEntry.score === existing.score: update if faster (less totalTimeSeconds) or more recent.
 *    - If newEntry.score < existing.score: retain the player's higher existing score (personal best).
 * 4. Return the new list sorted according to sortRankingEntries.
 */
export function upsertRankingEntry(
  existingEntries: RankingEntry[],
  newEntry: RankingEntry
): { entries: RankingEntry[]; isNewPersonalBest: boolean; isExistingPlayer: boolean } {
  const normNewName = newEntry.playerName.trim().toLowerCase();
  const existingIndex = existingEntries.findIndex(
    (e) => e.playerName.trim().toLowerCase() === normNewName
  );

  if (existingIndex === -1) {
    // New player
    const updated = sortRankingEntries([newEntry, ...existingEntries]);
    return { entries: updated, isNewPersonalBest: true, isExistingPlayer: false };
  }

  const existing = existingEntries[existingIndex];

  // Decide if newEntry is better than existing
  if (newEntry.score > existing.score) {
    // New personal best record!
    const clone = [...existingEntries];
    clone[existingIndex] = {
      ...newEntry,
      id: existing.id,
    };
    return {
      entries: sortRankingEntries(clone),
      isNewPersonalBest: true,
      isExistingPlayer: true,
    };
  } else if (newEntry.score === existing.score) {
    // Same score: update if faster or more recent
    if (
      newEntry.totalTimeSeconds < existing.totalTimeSeconds ||
      newEntry.timestamp >= existing.timestamp
    ) {
      const clone = [...existingEntries];
      clone[existingIndex] = {
        ...newEntry,
        id: existing.id,
      };
      return {
        entries: sortRankingEntries(clone),
        isNewPersonalBest: false,
        isExistingPlayer: true,
      };
    }
    return {
      entries: sortRankingEntries(existingEntries),
      isNewPersonalBest: false,
      isExistingPlayer: true,
    };
  } else {
    // Existing score is higher than current run score: keep the existing record
    return {
      entries: sortRankingEntries(existingEntries),
      isNewPersonalBest: false,
      isExistingPlayer: true,
    };
  }
}


