import { evaluateGate } from './gates';
import { CircuitEvaluationResult, LevelConfig } from './types';

/**
 * Pure circuit evaluator.
 * Separates logical calculation from visual rendering as required by specification.
 */
export function evaluateCircuit(
  level: LevelConfig,
  clipStates: Record<string, boolean>
): CircuitEvaluationResult {
  const { circuit, mission } = level;

  // Track signal at each point
  // Sources: battery_pos is always 1 (true)
  const wireValues: Record<string, boolean> = {};
  const clipOutputs: Record<string, boolean> = {};
  const gateOutputs: Record<string, boolean> = {};

  // 1. Evaluate clips: Each clip is fed directly or indirectly from battery
  // In our level designs, clips receive power from battery or preceding gates.
  // By default, if a clip is closed (true), it conducts its input.
  // If it's the primary switch directly connected to battery, its input is true (1).
  for (const clip of circuit.clips) {
    const isClosed = clipStates[clip.id] ?? clip.initialClosed;
    clipOutputs[clip.id] = isClosed;
  }

  // 2. Evaluate gates in topological order (if gates exist)
  if (circuit.gates && circuit.gates.length > 0) {
    // Multi-pass or ordered evaluation for gates
    const gates = [...circuit.gates];
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const gate of gates) {
        // Find inputs connected to this gate
        // Wires targeting `gate_${gate.id}_in0`, `gate_${gate.id}_in1`, etc.
        const inputValues: boolean[] = [];

        // For gates, find which clips or previous gates connect to its inputs
        const in0Wire = circuit.wires.find(
          w => w.to === `gate_${gate.id}_in0` || w.to === `gate_${gate.id}_in`
        );
        const in1Wire = circuit.wires.find(w => w.to === `gate_${gate.id}_in1`);

        const resolveWireSource = (wire?: typeof circuit.wires[0]): boolean => {
          if (!wire) return false;
          if (wire.from === 'battery_pos') return true;
          if (wire.from.startsWith('clip_')) {
            const clipId = wire.from.replace('clip_', '').replace('_out', '');
            return clipOutputs[clipId] ?? false;
          }
          if (wire.from.startsWith('gate_')) {
            const gateId = wire.from.replace('gate_', '').replace('_out', '');
            return gateOutputs[gateId] ?? false;
          }
          return false;
        };

        if (gate.type === 'NOT') {
          const val = resolveWireSource(in0Wire);
          inputValues.push(val);
        } else {
          const val0 = resolveWireSource(in0Wire);
          const val1 = resolveWireSource(in1Wire);
          inputValues.push(val0, val1);
        }

        const newOutput = evaluateGate(gate.type, inputValues);
        if (gateOutputs[gate.id] !== newOutput) {
          gateOutputs[gate.id] = newOutput;
          changed = true;
        }
      }
    }
  }

  // 3. Evaluate bulb input
  // Find wire that connects to bulb_in
  const bulbWire = circuit.wires.find(w => w.to === 'bulb_in');
  let bulbState = false;

  if (bulbWire) {
    if (bulbWire.from === 'battery_pos') {
      bulbState = true;
    } else if (bulbWire.from.startsWith('clip_')) {
      const clipId = bulbWire.from.replace('clip_', '').replace('_out', '');
      bulbState = clipOutputs[clipId] ?? false;
    } else if (bulbWire.from.startsWith('gate_')) {
      const gateId = bulbWire.from.replace('gate_', '').replace('_out', '');
      bulbState = gateOutputs[gateId] ?? false;
    }
  } else {
    // If simple circuit without explicit bulbWire (fallback to first clip output)
    const firstClip = circuit.clips[0];
    if (firstClip) {
      bulbState = clipOutputs[firstClip.id] ?? false;
    }
  }

  // 4. Mark power state on each wire for visual glowing effects
  for (const wire of circuit.wires) {
    if (wire.from === 'battery_pos') {
      wireValues[wire.id] = true;
    } else if (wire.from.startsWith('clip_')) {
      const clipId = wire.from.replace('clip_', '').replace('_out', '');
      wireValues[wire.id] = clipOutputs[clipId] ?? false;
    } else if (wire.from.startsWith('gate_')) {
      const gateId = wire.from.replace('gate_', '').replace('_out', '');
      wireValues[wire.id] = gateOutputs[gateId] ?? false;
    } else {
      wireValues[wire.id] = false;
    }
  }

  // 5. Compare with mission
  // Acender a lâmpada -> target is 1 (true)
  // Apagar a lâmpada -> target is 0 (false)
  const isMissionSatisfied = mission === 'turn_on' ? bulbState === true : bulbState === false;

  return {
    bulbState,
    isMissionSatisfied,
    clipValues: clipOutputs,
    gateOutputs,
    wirePowered: wireValues,
  };
}
