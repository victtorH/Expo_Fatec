import React, { useMemo } from 'react';
import { LevelConfig } from '../logic/types';
import { BatterySvg } from './BatterySvg';
import { LightbulbSvg, BulbDamageState } from './LightbulbSvg';
import { PaperclipSwitch } from './PaperclipSwitch';
import { LogicGateSvg } from './LogicGateSvg';
import { Pt, findJunctions, parsePolylinePath, wirePath } from './handDrawn';

interface CircuitCanvasProps {
  level: LevelConfig;
  clipStates: Record<string, boolean>;
  onToggleClip: (id: string) => void;
  bulbIsOn: boolean;
  wirePowered: Record<string, boolean>;
  damageState?: BulbDamageState;
}

interface DrawnWire {
  id: string;
  pts: Pt[];
  powered: boolean;
  sharp: Set<number>;
  chevrons: boolean;
}

const INK = '#2a2e35';

/** Setinha de lápis que indica o sentido da corrente num fio energizado. */
const Chevron: React.FC<{ a: Pt; b: Pt }> = ({ a, b }) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (
    <path
      d="M -5 -5 L 2 0 L -5 5"
      transform={`translate(${mx} ${my}) rotate(${ang})`}
      fill="none"
      stroke="#27508f"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  level,
  clipStates,
  onToggleClip,
  bulbIsOn,
  wirePowered,
  damageState = 'intact',
}) => {
  const { circuit } = level;
  const bulbBroken = damageState === 'broken';

  const geometry = useMemo(() => {
    const parsed = circuit.wires.map((w) => ({ wire: w, pts: parsePolylinePath(w.path ?? '') }));
    const junctions = findJunctions(circuit.wires.map((w) => w.path ?? ''));
    const isJunction = (p: Pt) => junctions.some((j) => Math.round(j.x) === Math.round(p.x) && Math.round(j.y) === Math.round(p.y));
    return { parsed, junctions, isJunction };
  }, [circuit.wires]);

  // Pinos reais de entrada de cada porta = ponto final do fio que chega nela.
  const gatePins = (gateId: string, gy: number): number[] | undefined => {
    const ins = ['_in0', '_in1', '_in']
      .map((suf) => circuit.wires.find((w) => w.to === `gate_${gateId}${suf}`))
      .filter((w): w is NonNullable<typeof w> => Boolean(w));
    const ys = ins
      .map((w) => parsePolylinePath(w.path ?? '').slice(-1)[0])
      .filter(Boolean)
      .map((p) => p.y - gy);
    return ys.length ? ys : undefined;
  };

  // Energia visual de cada fio (usa apenas o resultado do avaliador).
  // O fio de retorno da lâmpada acompanha o estado real da lâmpada.
  const drawn: DrawnWire[] = [];
  geometry.parsed.forEach(({ wire, pts }) => {
    if (pts.length < 2) return;
    const powered = wire.from === 'bulb_return' ? bulbIsOn : wirePowered[wire.id] ?? false;
    const sharp = new Set<number>();
    pts.forEach((p, i) => {
      if (geometry.isJunction(p)) sharp.add(i);
    });
    drawn.push({ id: wire.id, pts, powered, sharp, chevrons: true });

    // Pequenos trechos que ligam o fio ao terminal desenhado da lâmpada
    if (wire.to === 'bulb_in') {
      const last = pts[pts.length - 1];
      const term = { x: circuit.bulb.x + 6, y: circuit.bulb.y };
      if (Math.hypot(term.x - last.x, term.y - last.y) > 1.5) {
        drawn.push({ id: `${wire.id}-lead`, pts: [last, term], powered, sharp: new Set(), chevrons: false });
      }
    }
    if (wire.from === 'bulb_return') {
      const first = pts[0];
      const term = { x: circuit.bulb.x + 24, y: circuit.bulb.y + 22 };
      if (Math.hypot(term.x - first.x, term.y - first.y) > 1.5) {
        drawn.push({
          id: `${wire.id}-lead`,
          pts: [term, { x: term.x, y: first.y }, first],
          powered,
          sharp: new Set(),
          chevrons: false,
        });
      }
    }
  });

  // Portas "decorativas" (sem fios ligados, ex.: Série/Paralelo nas fases A2/A3)
  // viram anotações escritas à mão para não sobrepor os clipes.
  const isWired = (gateId: string) =>
    circuit.wires.some((w) => w.to.startsWith(`gate_${gateId}_in`) || w.from === `gate_${gateId}_out`);

  // Posição da anotação livre (nota do circuito)
  const noteY = useMemo(() => {
    let lowest = 0;
    circuit.clips.forEach((c) => (lowest = Math.max(lowest, c.y + 40)));
    circuit.gates?.forEach((g) => isWired(g.id) && (lowest = Math.max(lowest, g.y + 52)));
    let maxWireY = 0;
    geometry.parsed.forEach(({ pts }) => pts.forEach((p) => (maxWireY = Math.max(maxWireY, p.y))));
    return Math.round((lowest + maxWireY - 6) / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 900 312" className="circuit-svg" role="group" aria-label={`Circuito da fase ${level.id}`}>
        {/* 1. Fios: grafite em duas passadas; energizados ganham lápis azul + setinhas */}
        <g key={level.id} id="wires-layer" filter="url(#pencil-grain)">
          {drawn.map((w) => {
            const base = wirePath(w.pts, `${level.id}-${w.id}`, { amp: 1.4, radius: 9, sharp: w.sharp });
            const second = wirePath(w.pts, `${level.id}-${w.id}-2`, { amp: 2.1, radius: 9, sharp: w.sharp, endSlack: 0.9 });
            return (
              <g key={w.id}>
                {w.powered && (
                  <path d={base} fill="none" stroke="#4a7fc4" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                )}
                <path
                  d={base}
                  pathLength={1}
                  className="ink-draw"
                  fill="none"
                  stroke={INK}
                  strokeWidth={w.powered ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={w.powered ? 0.95 : 0.7}
                />
                <path
                  d={second}
                  fill="none"
                  stroke={INK}
                  strokeWidth={w.powered ? 1.4 : 0.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={w.powered ? 0.6 : 0.4}
                />
                {w.powered &&
                  w.chevrons &&
                  w.pts.slice(0, -1).map((p, i) => {
                    const q = w.pts[i + 1];
                    return Math.hypot(q.x - p.x, q.y - p.y) >= 90 ? <Chevron key={i} a={p} b={q} /> : null;
                  })}
              </g>
            );
          })}

          {/* pontos de junção em tinta */}
          {geometry.junctions.map((j, i) => (
            <circle key={i} cx={j.x} cy={j.y} r="4.6" fill={INK} />
          ))}
        </g>

        {/* 2. Pilha */}
        <BatterySvg x={circuit.battery.x} y={circuit.battery.y - 18} voltage={circuit.battery.voltage || '9V'} />

        {/* 3. Portas lógicas */}
        <g filter="url(#pencil-grain)">
          {circuit.gates?.map((gate) => {
            if (!isWired(gate.id)) return null;
            const outWire = circuit.wires.find((w) => w.from === `gate_${gate.id}_out`);
            return (
              <LogicGateSvg
                key={gate.id}
                id={gate.id}
                type={gate.type}
                x={gate.x}
                y={gate.y}
                label={gate.label}
                outputPowered={outWire ? wirePowered[outWire.id] ?? false : false}
                inputPins={gatePins(gate.id, gate.y)}
              />
            );
          })}
        </g>
        {circuit.gates?.map((gate) =>
          isWired(gate.id) ? null : (
            <text
              key={gate.id}
              x={gate.x + 34}
              y={gate.y - 52}
              textAnchor="middle"
              fill="#3b69ad"
              style={{ fontFamily: 'var(--font-title)', fontSize: 24, fontWeight: 700 }}
              transform={`rotate(-3 ${gate.x + 34} ${gate.y - 52})`}
            >
              {gate.label}
            </text>
          )
        )}

        {/* 4. Clipes */}
        {circuit.clips.map((clip) => {
          const isClosed = clipStates[clip.id] ?? clip.initialClosed;
          const feeding = circuit.wires.find((w) => w.to === `clip_${clip.id}_in`);
          const isPowered = feeding ? wirePowered[feeding.id] ?? true : true;
          return (
            <PaperclipSwitch
              key={clip.id}
              id={clip.id}
              label={clip.label}
              x={clip.x}
              y={clip.y}
              isClosed={isClosed}
              onToggle={onToggleClip}
              powered={isPowered}
            />
          );
        })}

        {/* 5. Lâmpada ou TV */}
        <LightbulbSvg
          x={circuit.bulb.x}
          y={circuit.bulb.y - 40}
          isOn={bulbIsOn}
          damageState={damageState}
          hasFishInBulb={circuit.hasFishInBulb}
          isPixelBulb={circuit.isPixelBulb}
          isTvBulb={circuit.isTvBulb}
        />

        {/* 6. Anotação manuscrita no papel */}
        {circuit.customNote && (
          <g transform={`rotate(-1.2 470 ${noteY})`}>
            <text
              x="470"
              y={noteY}
              textAnchor="middle"
              fill="#4b515b"
              style={{ fontFamily: 'var(--font-title)', fontSize: 25, fontWeight: 500 }}
            >
              {circuit.customNote}
            </text>
            <path
              d={`M ${470 - 60} ${noteY + 7} C ${470 - 20} ${noteY + 3} ${470 + 20} ${noteY + 10} ${470 + 60} ${noteY + 5}`}
              fill="none"
              stroke="#3b69ad"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        )}
      </svg>
      <span className="sr-only" aria-live="polite">
        {bulbBroken ? 'A lâmpada quebrou.' : bulbIsOn ? 'A lâmpada está acesa.' : 'A lâmpada está apagada.'}
      </span>
    </div>
  );
};
