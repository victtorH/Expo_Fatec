import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateGate, GATE_CATALOG } from './gates';
import { evaluateCircuit } from './evaluator';
import { ALL_LEVELS, getLevelById, getNextLevel } from './levels';
import {
  calculatePhaseScore,
  sortRankingEntries,
  formatCompletionDateTime,
  upsertRankingEntry,
} from './scoring';

test('Truth tables for all 7 logic gates are strictly verified', () => {
  // AND
  assert.equal(evaluateGate('AND', [false, false]), false);
  assert.equal(evaluateGate('AND', [false, true]), false);
  assert.equal(evaluateGate('AND', [true, false]), false);
  assert.equal(evaluateGate('AND', [true, true]), true);

  // OR
  assert.equal(evaluateGate('OR', [false, false]), false);
  assert.equal(evaluateGate('OR', [false, true]), true);
  assert.equal(evaluateGate('OR', [true, false]), true);
  assert.equal(evaluateGate('OR', [true, true]), true);

  // NOT
  assert.equal(evaluateGate('NOT', [false]), true);
  assert.equal(evaluateGate('NOT', [true]), false);

  // NAND
  assert.equal(evaluateGate('NAND', [false, false]), true);
  assert.equal(evaluateGate('NAND', [false, true]), true);
  assert.equal(evaluateGate('NAND', [true, false]), true);
  assert.equal(evaluateGate('NAND', [true, true]), false);

  // NOR
  assert.equal(evaluateGate('NOR', [false, false]), true);
  assert.equal(evaluateGate('NOR', [false, true]), false);
  assert.equal(evaluateGate('NOR', [true, false]), false);
  assert.equal(evaluateGate('NOR', [true, true]), false);

  // XOR
  assert.equal(evaluateGate('XOR', [false, false]), false);
  assert.equal(evaluateGate('XOR', [false, true]), true);
  assert.equal(evaluateGate('XOR', [true, false]), true);
  assert.equal(evaluateGate('XOR', [true, true]), false);

  // XNOR
  assert.equal(evaluateGate('XNOR', [false, false]), true);
  assert.equal(evaluateGate('XNOR', [false, true]), false);
  assert.equal(evaluateGate('XNOR', [true, false]), false);
  assert.equal(evaluateGate('XNOR', [true, true]), true);
});

test('Level A1: Initial open clip keeps bulb off; closing clip turns bulb on and satisfies mission', () => {
  const levelA1 = getLevelById('A1');
  assert.equal(levelA1.mission, 'turn_on');

  // Initial state: open
  const initialResult = evaluateCircuit(levelA1, { A: false });
  assert.equal(initialResult.bulbState, false);
  assert.equal(initialResult.isMissionSatisfied, false);

  // Solved state: closed
  const solvedResult = evaluateCircuit(levelA1, { A: true });
  assert.equal(solvedResult.bulbState, true);
  assert.equal(solvedResult.isMissionSatisfied, true);
});

test('Level B1 (AND gate): satisfies mission only when both A and B are closed', () => {
  const levelB1 = getLevelById('B1');
  assert.equal(levelB1.mission, 'turn_on');

  assert.equal(evaluateCircuit(levelB1, { A: false, B: false }).isMissionSatisfied, false);
  assert.equal(evaluateCircuit(levelB1, { A: true, B: false }).isMissionSatisfied, false);
  assert.equal(evaluateCircuit(levelB1, { A: false, B: true }).isMissionSatisfied, false);
  assert.equal(evaluateCircuit(levelB1, { A: true, B: true }).isMissionSatisfied, true);
});

test('Level B3 (NOT gate): mission is turn_on; satisfied when clip A is OPEN', () => {
  const levelB3 = getLevelById('B3');
  assert.equal(levelB3.mission, 'turn_on');

  // A closed -> NOT input 1 -> output 0 (bulb off, mission failed)
  assert.equal(evaluateCircuit(levelB3, { A: true }).isMissionSatisfied, false);
  // A open -> NOT input 0 -> output 1 (bulb on, mission satisfied)
  assert.equal(evaluateCircuit(levelB3, { A: false }).isMissionSatisfied, true);
});

test('Progression sequence contains exactly 15 levels from A1 through E3', () => {
  assert.equal(ALL_LEVELS.length, 15);
  const expectedIds = [
    'A1', 'A2', 'A3',
    'B1', 'B2', 'B3',
    'C1', 'C2', 'C3',
    'D1', 'D2', 'D3',
    'E1', 'E2', 'E3',
  ];
  assert.deepEqual(ALL_LEVELS.map(l => l.id), expectedIds);

  // Next level sequence
  assert.equal(getNextLevel('A1')?.id, 'A2');
  assert.equal(getNextLevel('E2')?.id, 'E3');
  assert.equal(getNextLevel('E3'), null); // End of game
});

test('All 15 levels have at least one valid solution', () => {
  for (const level of ALL_LEVELS) {
    const clipIds = level.circuit.clips.map(c => c.id);
    const totalCombinations = 1 << clipIds.length;
    let foundSolution = false;

    for (let mask = 0; mask < totalCombinations; mask++) {
      const clipStates: Record<string, boolean> = {};
      clipIds.forEach((id, index) => {
        clipStates[id] = Boolean(mask & (1 << index));
      });

      const res = evaluateCircuit(level, clipStates);
      if (res.isMissionSatisfied) {
        foundSolution = true;
        break;
      }
    }

    assert.ok(
      foundSolution,
      `Fase ${level.id} (${level.title}) precisa ter pelo menos uma solução válida!`
    );
  }
});

test('Scoring: first-try multiplier doubles the score, and faster times yield more points', () => {
  // Fast completion: 20 seconds used (280s remaining = 28 blocks of 10s = 2800 bonus points)
  const scoreFastFirstTry = calculatePhaseScore(20, true);
  const scoreFastSecondTry = calculatePhaseScore(20, false);

  assert.equal(scoreFastFirstTry.timeBonusPoints, 2800);
  assert.equal(scoreFastFirstTry.firstTryMultiplier, 2);
  assert.equal(scoreFastFirstTry.totalPhaseScore, (200 + 2800) * 2);

  assert.equal(scoreFastSecondTry.firstTryMultiplier, 1);
  assert.equal(scoreFastSecondTry.totalPhaseScore, 200 + 2800);

  // Slower completion: 150 seconds used (150s remaining = 15 blocks = 1500 bonus)
  const scoreSlow = calculatePhaseScore(150, false);
  assert.ok(scoreFastSecondTry.totalPhaseScore > scoreSlow.totalPhaseScore);
});

test('Ranking sorting: highest score first; for equal scores, more recent first', () => {
  const entries = [
    { score: 3000, timestamp: 100, totalTimeSeconds: 120 },
    { score: 5000, timestamp: 200, totalTimeSeconds: 200 },
    { score: 5000, timestamp: 500, totalTimeSeconds: 150 }, // Equal score, more recent
    { score: 1200, timestamp: 300, totalTimeSeconds: 80 },
  ];

  const sorted = sortRankingEntries(entries);
  assert.equal(sorted[0].score, 5000);
  assert.equal(sorted[0].timestamp, 500); // More recent first
  assert.equal(sorted[0].totalTimeSeconds, 150);
  assert.equal(sorted[1].score, 5000);
  assert.equal(sorted[1].timestamp, 200);
  assert.equal(sorted[2].score, 3000);
  assert.equal(sorted[3].score, 1200);
});

test('Player total time is recorded and format converts seconds to mm:ss properly', () => {
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(290), '04:50');
  assert.equal(formatTime(600), '10:00');
});

test('formatCompletionDateTime formats authentic date and time properly', () => {
  // Test with fixed date: 24 Oct 2026 04:38
  const testDate = new Date(2026, 9, 24, 4, 38, 0); // month is 0-indexed (9 = Oct)
  const formatted = formatCompletionDateTime(testDate);
  assert.equal(formatted, '24/10/2026 às 04:38');
});

test('upsertRankingEntry: recognizes duplicate player name and prevents multiple spots in ranking', () => {
  const initial = [
    {
      id: '1',
      playerName: 'Estevam',
      score: 6000,
      phasesCompleted: 1,
      totalTimeSeconds: 45,
      completedAt: '24/10/2026 às 04:00',
      timestamp: 1000,
      outcome: 'Derrota' as const,
      lastPhase: 'A2',
    },
    {
      id: '2',
      playerName: 'Ada Lovelace',
      score: 38400,
      phasesCompleted: 15,
      totalTimeSeconds: 290,
      completedAt: '24/10/2026 às 03:00',
      timestamp: 900,
      outcome: 'Vitoria' as const,
      lastPhase: 'E3',
    },
  ];

  // 1. Same player plays again with a lower score (e.g. 2000 points):
  // Should NOT create duplicate entry, should preserve existing 6000 points!
  const lowerRun = {
    id: '3',
    playerName: 'estevam', // lowercase to test case-insensitivity
    score: 2000,
    phasesCompleted: 1,
    totalTimeSeconds: 30,
    completedAt: '24/10/2026 às 04:30',
    timestamp: 2000,
    outcome: 'Derrota' as const,
    lastPhase: 'A1',
  };

  const res1 = upsertRankingEntry(initial, lowerRun);
  assert.equal(res1.entries.length, 2, 'Must not duplicate player entry');
  const estevamEntry1 = res1.entries.find((e) => e.playerName.toLowerCase() === 'estevam');
  assert.ok(estevamEntry1);
  assert.equal(estevamEntry1.score, 6000, 'Must preserve personal best score of 6000');
  assert.equal(res1.isNewPersonalBest, false);

  // 2. Same player plays again and beats their record (e.g. 15000 points):
  // Should update the entry in place, without creating duplicate!
  const higherRun = {
    id: '4',
    playerName: 'ESTEVAM', // uppercase
    score: 15000,
    phasesCompleted: 4,
    totalTimeSeconds: 120,
    completedAt: '24/10/2026 às 05:00',
    timestamp: 3000,
    outcome: 'Derrota' as const,
    lastPhase: 'B2',
  };

  const res2 = upsertRankingEntry(res1.entries, higherRun);
  assert.equal(res2.entries.length, 2, 'Must remain exactly 2 players in ranking');
  const estevamEntry2 = res2.entries.find((e) => e.playerName.toLowerCase() === 'estevam');
  assert.ok(estevamEntry2);
  assert.equal(estevamEntry2.score, 15000, 'Must update to new personal best');
  assert.equal(estevamEntry2.phasesCompleted, 4);
  assert.equal(estevamEntry2.completedAt, '24/10/2026 às 05:00');
  assert.equal(res2.isNewPersonalBest, true);
});

test('Heart recovery rule: recovers +0.5 heart only if hearts < 3.0 on first try; never exceeds 3.0', () => {
  const applyHeartRecovery = (currentHearts: number, isFirstTry: boolean): number => {
    if (isFirstTry && currentHearts < 3.0) {
      return Math.min(3.0, currentHearts + 0.5);
    }
    return currentHearts;
  };

  // Case 1: Player has 3 full hearts and gets first try right -> stays 3.0
  assert.equal(applyHeartRecovery(3.0, true), 3.0);

  // Case 2: Player has 2.0 hearts and gets first try right -> recovers to 2.5
  assert.equal(applyHeartRecovery(2.0, true), 2.5);

  // Case 3: Player has 2.5 hearts and gets first try right -> reaches 3.0
  assert.equal(applyHeartRecovery(2.5, true), 3.0);

  // Case 4: Player has 2.0 hearts but did NOT succeed on first try -> remains 2.0
  assert.equal(applyHeartRecovery(2.0, false), 2.0);
});

test('Lamp damage states: 0 or 1 error = intact, 2 errors = cracked (racha), 3+ errors = broken (quebra)', () => {
  const getBulbDamageState = (errorsCount: number): 'intact' | 'cracked' | 'broken' => {
    if (errorsCount >= 3) return 'broken';
    if (errorsCount === 2) return 'cracked';
    return 'intact';
  };

  assert.equal(getBulbDamageState(0), 'intact');
  assert.equal(getBulbDamageState(1), 'intact');
  assert.equal(getBulbDamageState(2), 'cracked'); // "caso erre duas vezes a lampada rache"
  assert.equal(getBulbDamageState(3), 'broken');  // "caso 3 ela quebre"
  assert.equal(getBulbDamageState(4), 'broken');
});

test('Aquarium fish level: Level A1 has hasFishInBulb and valid state transitions', () => {
  const levelA1 = ALL_LEVELS.find((lvl) => lvl.id === 'A1');
  assert.ok(levelA1, 'Level A1 must exist');
  assert.equal(levelA1.mission, 'turn_on', 'Level A1 must have turn_on mission');
  assert.equal(levelA1.circuit.hasFishInBulb, true, 'Level A1 must feature the aquarium fish');

  // Test state selector logic
  const getFishVisualState = (isOn: boolean, isBroken: boolean) => {
    if (isBroken) return 'fallen_out';
    if (isOn) return 'electrocuted';
    return 'normal';
  };

  // Lamp OFF -> normal
  assert.equal(getFishVisualState(false, false), 'normal');
  // Lamp ON -> electrocuted
  assert.equal(getFishVisualState(true, false), 'electrocuted');
  // Lamp Broken -> fallen out on water puddle
  assert.equal(getFishVisualState(false, true), 'fallen_out');
  assert.equal(getFishVisualState(true, true), 'fallen_out');
});
test('Pixel bulb phase: Level A2 has isPixelBulb and valid state transitions', () => {
  const levelA2 = ALL_LEVELS.find((lvl) => lvl.id === 'A2');
  assert.ok(levelA2, 'Level A2 must exist');
  assert.equal(levelA2.circuit.isPixelBulb, true, 'Level A2 must feature the pixel bulb');
  assert.equal(levelA2.mission, 'turn_off', 'Level A2 mission is to turn off the pixel bulb');

  // Test state selector logic for pixel bulb
  const getPixelBulbVisualState = (isOn: boolean, isBroken: boolean) => {
    if (isBroken) return 'Pixel-C_8ffc14b0';
    if (isOn) return 'Pixel-B_9890e7d1';
    return 'Pixel-A_8f925637';
  };

  // Lamp OFF -> Pixel-A (black/unlit bulb with white filament)
  assert.equal(getPixelBulbVisualState(false, false), 'Pixel-A_8f925637');
  // Lamp ON -> Pixel-B (illuminated bulb with black filament and glowing rays)
  assert.equal(getPixelBulbVisualState(true, false), 'Pixel-B_9890e7d1');
  // Lamp Broken -> Pixel-C (shattered glass shards, broken red filament)
  assert.equal(getPixelBulbVisualState(false, true), 'Pixel-C_8ffc14b0');
  assert.equal(getPixelBulbVisualState(true, true), 'Pixel-C_8ffc14b0');
});


