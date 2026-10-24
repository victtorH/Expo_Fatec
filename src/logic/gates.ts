import { GateInfo, LogicGateType } from './types';

/**
 * Pure logic calculations for the 7 standard logic gates
 * defined in section 6.4 of the functional specification.
 */
export const evaluateGate = (type: LogicGateType, inputs: boolean[]): boolean => {
  const [a = false, b = false] = inputs;

  switch (type) {
    case 'AND':
      // A saída é 1 somente quando todas as entradas forem 1
      return inputs.length > 0 && inputs.every(Boolean);

    case 'OR':
      // A saída é 1 quando pelo menos uma entrada for 1
      return inputs.some(Boolean);

    case 'NOT':
      // Possui uma entrada e inverte seu valor
      return !a;

    case 'NAND':
      // NÃO-E: A saída só é 0 quando todas as entradas forem 1
      return !(inputs.length > 0 && inputs.every(Boolean));

    case 'NOR':
      // NÃO-OU: A saída é 1 somente quando todas as entradas forem 0
      return !inputs.some(Boolean);

    case 'XOR':
      // OU exclusivo: Saída 1 quando os valores são diferentes (para 2 entradas)
      return a !== b;

    case 'XNOR':
      // NÃO-OU exclusivo: Saída 1 quando os valores são iguais (para 2 entradas)
      return a === b;

    default:
      return false;
  }
};

export const GATE_CATALOG: Record<LogicGateType, GateInfo> = {
  AND: {
    type: 'AND',
    name: 'AND',
    namePt: 'E (AND)',
    descriptionPt: 'A lâmpada ou saída só conduz energia (1) se TODAS as entradas forem verdadeiras (1). Se uma estiver aberta, a saída é 0.',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 1 },
    ],
  },
  OR: {
    type: 'OR',
    name: 'OR',
    namePt: 'OU (OR)',
    descriptionPt: 'A saída é 1 se PELO MENOS UMA entrada for verdadeira (1). Só desliga se ambas forem 0.',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 1 },
    ],
  },
  NOT: {
    type: 'NOT',
    name: 'NOT',
    namePt: 'NÃO (NOT / Inversora)',
    descriptionPt: 'Inverte o sinal recebido: se a entrada for 0 (desconectada), a saída vira 1. Se for 1, vira 0!',
    inputsCount: 1,
    truthTable: [
      { inputs: [0], output: 1 },
      { inputs: [1], output: 0 },
    ],
  },
  NAND: {
    type: 'NAND',
    name: 'NAND',
    namePt: 'NÃO-E (NAND)',
    descriptionPt: 'Inverso da porta E: a saída só é 0 quando TODAS as entradas forem 1. Em qualquer outro caso, a saída é 1.',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  NOR: {
    type: 'NOR',
    name: 'NOR',
    namePt: 'NÃO-OU (NOR)',
    descriptionPt: 'Inverso da porta OU: a saída só é 1 se TODAS as entradas forem 0. Se qualquer clipe for fechado (1), desliga para 0.',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  XOR: {
    type: 'XOR',
    name: 'XOR',
    namePt: 'OU Exclusivo (XOR)',
    descriptionPt: 'A saída é 1 quando as duas entradas têm valores DIFERENTES (um aberto e um fechado). Se forem iguais, é 0.',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 0 },
      { inputs: [0, 1], output: 1 },
      { inputs: [1, 0], output: 1 },
      { inputs: [1, 1], output: 0 },
    ],
  },
  XNOR: {
    type: 'XNOR',
    name: 'XNOR',
    namePt: 'NÃO-OU Exclusivo (XNOR)',
    descriptionPt: 'Inverso do XOR: a saída é 1 quando as duas entradas têm valores IGUAIS (ambos abertos ou ambos fechados).',
    inputsCount: 2,
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: 0 },
      { inputs: [1, 0], output: 0 },
      { inputs: [1, 1], output: 1 },
    ],
  },
};
