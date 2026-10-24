export type LogicGateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export type MissionType = 'turn_on' | 'turn_off'; // 1 = acender, 0 = apagar

export interface GateInfo {
  type: LogicGateType;
  name: string;
  namePt: string;
  descriptionPt: string;
  truthTable: { inputs: number[]; output: number }[];
  inputsCount: number;
}

export interface CircuitNode {
  id: string;
  type: 'battery' | 'clip' | 'gate' | 'bulb' | 'junction';
  x: number;
  y: number;
  label?: string;
  gateType?: LogicGateType;
}

export interface CircuitWire {
  id: string;
  fromNodeId: string;
  fromPort?: string | number; // 'pos' | 'neg' | 0 | 1
  toNodeId: string;
  toPort?: string | number; // 0 | 1 | 'in'
  points?: { x: number; y: number }[];
}

export interface LevelConfig {
  id: string; // 'A1', 'A2', ..., 'E3'
  tier: 'A' | 'B' | 'C' | 'D' | 'E';
  tierPhase: 1 | 2 | 3;
  order: number; // 1 to 15
  title: string;
  mission: MissionType;
  missionText: string;
  hint: string;
  introducedGate?: LogicGateType;
  educationalText?: string;
  circuit: {
    clips: {
      id: string;
      label: string;
      x: number;
      y: number;
      initialClosed: boolean;
      angle?: number;
    }[];
    gates?: {
      id: string;
      type: LogicGateType;
      x: number;
      y: number;
      label?: string;
    }[];
    wires: {
      id: string;
      from: string; // 'battery_pos', 'clip_A_out', 'gate_1_out', etc.
      to: string;   // 'clip_A_in', 'gate_1_in0', 'bulb_in', etc.
      path?: string; // SVG path data 'M ... L ...'
    }[];
    battery: { x: number; y: number; voltage?: string };
    bulb: { x: number; y: number };
    customNote?: string;
    hasFishInBulb?: boolean;
    isPixelBulb?: boolean;
    isTvBulb?: boolean;
  };
}

export type GameState =
  | 'TelaInicial'
  | 'PartidaIniciada'
  | 'FaseEmAndamento'
  | 'ErroDeSolucao'
  | 'FaseConcluida'
  | 'PartidaPerdida'
  | 'PartidaAbandonada'
  | 'Ranking';

export interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  phasesCompleted: number;
  totalTimeSeconds: number;
  completedAt: string;
  timestamp: number;
  outcome: 'Vitoria' | 'Derrota';
  lastPhase: string;
}

export interface CircuitEvaluationResult {
  bulbState: boolean;
  isMissionSatisfied: boolean;
  clipValues: Record<string, boolean>; // id -> 0 or 1 (closed=1)
  gateOutputs: Record<string, boolean>; // gateId -> output
  wirePowered: Record<string, boolean>; // wire id -> powered
}
