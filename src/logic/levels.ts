import { LevelConfig } from './types';

export const ALL_LEVELS: LevelConfig[] = [
  // ==================== NÍVEL A: CIRCUITOS BÁSICOS ====================
  {
    id: 'A1',
    tier: 'A',
    tierPhase: 1,
    order: 1,
    title: 'O Primeiro Clipe',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'Para a corrente elétrica fluir da pilha até a lâmpada, o circuito precisa de um caminho fechado e contínuo. Feche o clipe A!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      hasFishInBulb: true,
      customNote: 'um clipe = uma chave',
      clips: [
        { id: 'A', label: 'A', x: 420, y: 140, initialClosed: false },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 156 140 L 416 140' },
        { id: 'w2', from: 'clip_A_out', to: 'bulb_in', path: 'M 488 140 L 680 140 L 744 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 764 162 L 764 260 L 156 260 L 156 180' },
      ],
    },
  },
  {
    id: 'A2',
    tier: 'A',
    tierPhase: 2,
    order: 2,
    title: 'Caminhos em Paralelo (Pixel Art)',
    mission: 'turn_off',
    missionText: 'Apagar a lâmpada pixelada',
    hint: 'Em paralelo, a corrente consegue fluir por qualquer clipe que estiver conectado. Para apagar a lâmpada pixelada, abra TODOS os clipes!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      isPixelBulb: true,
      customNote: 'dois caminhos em paralelo • Lâmpada Pixel 8-Bit',
      clips: [
        { id: 'A', label: 'A', x: 380, y: 100, initialClosed: true },
        { id: 'B', label: 'B', x: 380, y: 180, initialClosed: true },
      ],
      wires: [
        { id: 'w_branch', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 260 140 L 260 100 L 370 100' },
        { id: 'w_branch_b', from: 'battery_pos', to: 'clip_B_in', path: 'M 260 140 L 260 180 L 370 180' },
        { id: 'w_merge_a', from: 'clip_A_out', to: 'bulb_in', path: 'M 450 100 L 560 100 L 560 140 L 730 140' },
        { id: 'w_merge_b', from: 'clip_B_out', to: 'bulb_in', path: 'M 450 180 L 560 180 L 560 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
      gates: [
        // Represented functionally as an OR of the two parallel paths
        { id: 'parallel_or', type: 'OR', x: 560, y: 140, label: 'Paralelo' },
      ],
    },
  },
  {
    id: 'A3',
    tier: 'A',
    tierPhase: 3,
    order: 3,
    title: 'Caminhos em Série',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'Em série, a energia precisa passar pelo clipe A E pelo clipe B. Se um deles estiver aberto, a corrente é interrompida. Feche ambos!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      customNote: 'dois clipes em série (efeito E)',
      clips: [
        { id: 'A', label: 'A', x: 320, y: 140, initialClosed: true },
        { id: 'B', label: 'B', x: 500, y: 140, initialClosed: false },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 310 140' },
        { id: 'w2', from: 'clip_A_out', to: 'clip_B_in', path: 'M 390 140 L 490 140' },
        { id: 'w3', from: 'clip_B_out', to: 'bulb_in', path: 'M 570 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
      gates: [
        { id: 'series_and', type: 'AND', x: 500, y: 140, label: 'Série' },
      ],
    },
  },

  // ==================== NÍVEL B: INTRODUÇÃO DE PORTAS LÓGICAS ====================
  {
    id: 'B1',
    tier: 'B',
    tierPhase: 1,
    order: 4,
    title: 'Porta AND (E)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta AND só libera energia (1) quando TODAS as suas entradas forem 1. Verifique se ambos os clipes estão fechados!',
    introducedGate: 'AND',
    educationalText: 'A porta AND (E) precisa que todas as entradas estejam ativadas (1) para produzir saída 1.',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: true },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: false },
      ],
      gates: [
        { id: 'g1', type: 'AND', x: 500, y: 140, label: 'AND' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'B2',
    tier: 'B',
    tierPhase: 2,
    order: 5,
    title: 'Porta OR (OU)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'Na porta OR (OU), basta que UMA das entradas seja 1 para a saída ficar acesa. Feche ao menos um dos clipes!',
    introducedGate: 'OR',
    educationalText: 'A porta OR (OU) produz saída 1 se pelo menos uma das suas entradas for 1. Ela só desliga se todas forem 0.',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: false },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: false },
      ],
      gates: [
        { id: 'g1', type: 'OR', x: 500, y: 140, label: 'OR' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'B3',
    tier: 'B',
    tierPhase: 3,
    order: 6,
    title: 'Porta NOT (Inversora)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta NOT inverte o sinal: 0 vira 1, e 1 vira 0. Para a lâmpada receber 1, o clipe precisa estar ABERTO (0)!',
    introducedGate: 'NOT',
    educationalText: 'A porta NOT inverte o sinal recebido: entrada 1 produz 0, e entrada 0 produz 1.',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 300, y: 140, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'NOT', x: 500, y: 140, label: 'NOT' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 290 140' },
        { id: 'w2', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 370 140 L 480 140' },
        { id: 'w3', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },

  // ==================== NÍVEL C: NOVAS PORTAS & COMBINAÇÕES ====================
  {
    id: 'C1',
    tier: 'C',
    tierPhase: 1,
    order: 7,
    title: 'Porta NAND (NÃO-E)',
    mission: 'turn_off',
    missionText: 'Apagar a lâmpada',
    hint: 'A porta NAND só desliga (0) quando AMBAS as entradas forem 1. Para apagar a lâmpada, feche os dois clipes!',
    introducedGate: 'NAND',
    educationalText: 'A porta NAND é o inverso do AND: ela só produz 0 quando TODAS as entradas forem 1.',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: true },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: false },
      ],
      gates: [
        { id: 'g1', type: 'NAND', x: 500, y: 140, label: 'NAND' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'C2',
    tier: 'C',
    tierPhase: 2,
    order: 8,
    title: 'Porta NOR (NÃO-OU)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta NOR só produz 1 se TODAS as entradas forem 0. Abra ambos os clipes A e B!',
    introducedGate: 'NOR',
    educationalText: 'A porta NOR é o inverso do OR: ela só produz 1 se todas as entradas forem 0 (desconectadas).',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: false },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'NOR', x: 500, y: 140, label: 'NOR' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'C3',
    tier: 'C',
    tierPhase: 3,
    order: 9,
    title: 'Combinação OR + AND',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta AND final precisa que o clipe C esteja fechado (1) E que a porta OR anterior receba ao menos um clipe fechado (A ou B).',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 230, y: 70, initialClosed: false },
        { id: 'B', label: 'B', x: 230, y: 135, initialClosed: false },
        { id: 'C', label: 'C', x: 230, y: 205, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'OR', x: 420, y: 100, label: 'OR' },
        { id: 'g2', type: 'AND', x: 570, y: 145, label: 'AND' },
      ],
      wires: [
        { id: 'w_feed', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 180 140 L 180 70 L 220 70' },
        { id: 'w_feed_b', from: 'battery_pos', to: 'clip_B_in', path: 'M 180 140 L 180 135 L 220 135' },
        { id: 'w_feed_c', from: 'battery_pos', to: 'clip_C_in', path: 'M 180 140 L 180 205 L 220 205' },
        { id: 'w_a_or', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 300 70 L 370 70 L 370 85 L 400 85' },
        { id: 'w_b_or', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 300 135 L 370 135 L 370 115 L 400 115' },
        { id: 'w_or_and', from: 'gate_g1_out', to: 'gate_g2_in0', path: 'M 465 100 L 510 100 L 510 130 L 550 130' },
        { id: 'w_c_and', from: 'clip_C_out', to: 'gate_g2_in1', path: 'M 300 205 L 510 205 L 510 160 L 550 160' },
        { id: 'w_out', from: 'gate_g2_out', to: 'bulb_in', path: 'M 615 145 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },

  // ==================== NÍVEL D: PORTAS EXCLUSIVAS & COMPLEXIDADE ====================
  {
    id: 'D1',
    tier: 'D',
    tierPhase: 1,
    order: 10,
    title: 'Porta XOR (OU Exclusivo)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta XOR só ativa quando os estados são DIFERENTES: exatamente um clipe fechado e um aberto!',
    introducedGate: 'XOR',
    educationalText: 'A porta XOR (OU Exclusivo) produz 1 se as duas entradas tiverem valores diferentes. Se ambas forem 0 ou ambas forem 1, a saída é 0.',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: true },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'XOR', x: 500, y: 140, label: 'XOR' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'D2',
    tier: 'D',
    tierPhase: 2,
    order: 11,
    title: 'Porta XNOR (NÃO-OU Exclusivo)',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A porta XNOR ativa quando as entradas são IGUAIS: deixe ambos os clipes fechados ou ambos abertos!',
    introducedGate: 'XNOR',
    educationalText: 'A porta XNOR é o inverso do XOR: ela produz 1 quando as entradas são iguais (0 e 0, ou 1 e 1).',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 280, y: 95, initialClosed: false },
        { id: 'B', label: 'B', x: 280, y: 185, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'XNOR', x: 500, y: 140, label: 'XNOR' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 220 140 L 220 95 L 270 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 220 140 L 220 185 L 270 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 350 95 L 430 95 L 430 120 L 480 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 350 185 L 430 185 L 430 160 L 480 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'bulb_in', path: 'M 545 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'D3',
    tier: 'D',
    tierPhase: 3,
    order: 12,
    title: 'XOR com Inversão',
    mission: 'turn_off',
    missionText: 'Apagar a lâmpada',
    hint: 'A porta NOT inverte a saída do XOR. Para apagar a lâmpada (0), a saída do XOR precisa ser 1 (ou seja, A e B diferentes).',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 260, y: 95, initialClosed: true },
        { id: 'B', label: 'B', x: 260, y: 185, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'XOR', x: 420, y: 140, label: 'XOR' },
        { id: 'g2', type: 'NOT', x: 570, y: 140, label: 'NOT' },
      ],
      wires: [
        { id: 'w1', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 210 140 L 210 95 L 250 95' },
        { id: 'w2', from: 'battery_pos', to: 'clip_B_in', path: 'M 210 140 L 210 185 L 250 185' },
        { id: 'w3', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 330 95 L 380 95 L 380 120 L 400 120' },
        { id: 'w4', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 330 185 L 380 185 L 380 160 L 400 160' },
        { id: 'w5', from: 'gate_g1_out', to: 'gate_g2_in0', path: 'M 465 140 L 550 140' },
        { id: 'w6', from: 'gate_g2_out', to: 'bulb_in', path: 'M 615 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },

  // ==================== NÍVEL E: DESAFIOS AVANÇADOS ====================
  {
    id: 'E1',
    tier: 'E',
    tierPhase: 1,
    order: 13,
    title: 'Desafio E1: 3 Chaves e Portas Cruzadas',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'A lâmpada precisa de 1 na saída da porta OR final. Basta que o caminho superior (NAND) OU o inferior (clipe C) produza 1!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 230, y: 70, initialClosed: true },
        { id: 'B', label: 'B', x: 230, y: 135, initialClosed: true },
        { id: 'C', label: 'C', x: 230, y: 205, initialClosed: false },
      ],
      gates: [
        { id: 'g1', type: 'NAND', x: 420, y: 100, label: 'NAND' },
        { id: 'g2', type: 'OR', x: 570, y: 145, label: 'OR' },
      ],
      wires: [
        { id: 'w_feed_a', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 180 140 L 180 70 L 220 70' },
        { id: 'w_feed_b', from: 'battery_pos', to: 'clip_B_in', path: 'M 180 140 L 180 135 L 220 135' },
        { id: 'w_feed_c', from: 'battery_pos', to: 'clip_C_in', path: 'M 180 140 L 180 205 L 220 205' },
        { id: 'w_a_nand', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 300 70 L 370 70 L 370 85 L 400 85' },
        { id: 'w_b_nand', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 300 135 L 370 135 L 370 115 L 400 115' },
        { id: 'w_nand_or', from: 'gate_g1_out', to: 'gate_g2_in0', path: 'M 465 100 L 510 100 L 510 130 L 550 130' },
        { id: 'w_c_or', from: 'clip_C_out', to: 'gate_g2_in1', path: 'M 300 205 L 510 205 L 510 160 L 550 160' },
        { id: 'w_out', from: 'gate_g2_out', to: 'bulb_in', path: 'M 615 145 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'E2',
    tier: 'E',
    tierPhase: 2,
    order: 14,
    title: 'Desafio E2: A Rede Lógica de 4 Entradas',
    mission: 'turn_off',
    missionText: 'Apagar a lâmpada',
    hint: 'Para a porta AND final resultar em 0 (apagar a lâmpada), basta que QUALQUER uma das duas portas intermediárias envie 0!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      clips: [
        { id: 'A', label: 'A', x: 220, y: 60, initialClosed: true },
        { id: 'B', label: 'B', x: 220, y: 110, initialClosed: false },
        { id: 'C', label: 'C', x: 220, y: 170, initialClosed: true },
        { id: 'D', label: 'D', x: 220, y: 220, initialClosed: true },
      ],
      gates: [
        { id: 'g1', type: 'XOR', x: 390, y: 85, label: 'XOR' },
        { id: 'g2', type: 'AND', x: 390, y: 195, label: 'AND' },
        { id: 'g3', type: 'AND', x: 570, y: 140, label: 'AND' },
      ],
      wires: [
        { id: 'w_a', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 180 140 L 180 60 L 210 60' },
        { id: 'w_b', from: 'battery_pos', to: 'clip_B_in', path: 'M 180 140 L 180 110 L 210 110' },
        { id: 'w_c', from: 'battery_pos', to: 'clip_C_in', path: 'M 180 140 L 180 170 L 210 170' },
        { id: 'w_d', from: 'battery_pos', to: 'clip_D_in', path: 'M 180 140 L 180 220 L 210 220' },
        { id: 'w_a_xor', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 290 60 L 340 60 L 340 75 L 370 75' },
        { id: 'w_b_xor', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 290 110 L 340 110 L 340 95 L 370 95' },
        { id: 'w_c_and', from: 'clip_C_out', to: 'gate_g2_in0', path: 'M 290 170 L 340 170 L 340 185 L 370 185' },
        { id: 'w_d_and', from: 'clip_D_out', to: 'gate_g2_in1', path: 'M 290 220 L 340 220 L 340 205 L 370 205' },
        { id: 'w_g1_final', from: 'gate_g1_out', to: 'gate_g3_in0', path: 'M 435 85 L 500 85 L 500 125 L 550 125' },
        { id: 'w_g2_final', from: 'gate_g2_out', to: 'gate_g3_in1', path: 'M 435 195 L 500 195 L 500 155 L 550 155' },
        { id: 'w_out', from: 'gate_g3_out', to: 'bulb_in', path: 'M 615 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
  {
    id: 'E3',
    tier: 'E',
    tierPhase: 3,
    order: 15,
    title: 'Desafio Final E3: O Grande Circuito',
    mission: 'turn_on',
    missionText: 'Acender a lâmpada',
    hint: 'Desafio final! A porta XNOR final precisa que suas duas entradas sejam IGUAIS. Analise como os clipes afetam o XOR e o NOR!',
    circuit: {
      battery: { x: 80, y: 140, voltage: '9V' },
      bulb: { x: 740, y: 140 },
      customNote: 'A grande prova final de lógica de papel!',
      clips: [
        { id: 'A', label: 'A', x: 220, y: 60, initialClosed: false },
        { id: 'B', label: 'B', x: 220, y: 110, initialClosed: false },
        { id: 'C', label: 'C', x: 220, y: 170, initialClosed: true },
        { id: 'D', label: 'D', x: 220, y: 220, initialClosed: false },
      ],
      gates: [
        { id: 'g1', type: 'XOR', x: 390, y: 85, label: 'XOR' },
        { id: 'g2', type: 'NOR', x: 390, y: 195, label: 'NOR' },
        { id: 'g3', type: 'XNOR', x: 570, y: 140, label: 'XNOR' },
      ],
      wires: [
        { id: 'w_a', from: 'battery_pos', to: 'clip_A_in', path: 'M 160 140 L 180 140 L 180 60 L 210 60' },
        { id: 'w_b', from: 'battery_pos', to: 'clip_B_in', path: 'M 180 140 L 180 110 L 210 110' },
        { id: 'w_c', from: 'battery_pos', to: 'clip_C_in', path: 'M 180 140 L 180 170 L 210 170' },
        { id: 'w_d', from: 'battery_pos', to: 'clip_D_in', path: 'M 180 140 L 180 220 L 210 220' },
        { id: 'w_a_xor', from: 'clip_A_out', to: 'gate_g1_in0', path: 'M 290 60 L 340 60 L 340 75 L 370 75' },
        { id: 'w_b_xor', from: 'clip_B_out', to: 'gate_g1_in1', path: 'M 290 110 L 340 110 L 340 95 L 370 95' },
        { id: 'w_c_nor', from: 'clip_C_out', to: 'gate_g2_in0', path: 'M 290 170 L 340 170 L 340 185 L 370 185' },
        { id: 'w_d_nor', from: 'clip_D_out', to: 'gate_g2_in1', path: 'M 290 220 L 340 220 L 340 205 L 370 205' },
        { id: 'w_g1_final', from: 'gate_g1_out', to: 'gate_g3_in0', path: 'M 435 85 L 500 85 L 500 125 L 550 125' },
        { id: 'w_g2_final', from: 'gate_g2_out', to: 'gate_g3_in1', path: 'M 435 195 L 500 195 L 500 155 L 550 155' },
        { id: 'w_out', from: 'gate_g3_out', to: 'bulb_in', path: 'M 615 140 L 730 140' },
        { id: 'w_ret', from: 'bulb_return', to: 'battery_neg', path: 'M 740 280 L 160 280 L 160 180' },
      ],
    },
  },
];

/**
 * Returns level configuration by level id (e.g. 'A1', 'E3')
 */
export function getLevelById(id: string): LevelConfig {
  const level = ALL_LEVELS.find(l => l.id === id);
  if (!level) {
    throw new Error(`Fase não encontrada: ${id}`);
  }
  return level;
}

/**
 * Helper to get the next level in progression (A1 -> A2 ... -> E3)
 */
export function getNextLevel(currentId: string): LevelConfig | null {
  const currentIndex = ALL_LEVELS.findIndex(l => l.id === currentId);
  if (currentIndex === -1 || currentIndex === ALL_LEVELS.length - 1) {
    return null; // Completed E3
  }
  return ALL_LEVELS[currentIndex + 1];
}
