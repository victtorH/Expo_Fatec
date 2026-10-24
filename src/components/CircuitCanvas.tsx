import React from 'react';
import { LevelConfig } from '../logic/types';
import { BatterySvg } from './BatterySvg';
import { LightbulbSvg, BulbDamageState } from './LightbulbSvg';
import { PaperclipSwitch } from './PaperclipSwitch';
import { LogicGateSvg } from './LogicGateSvg';

interface CircuitCanvasProps {
  level: LevelConfig;
  clipStates: Record<string, boolean>;
  onToggleClip: (id: string) => void;
  bulbIsOn: boolean;
  wirePowered: Record<string, boolean>;
  damageState?: BulbDamageState;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  level,
  clipStates,
  onToggleClip,
  bulbIsOn,
  wirePowered,
  damageState = 'intact',
}) => {
  const { circuit } = level;

  return (
    <div className="relative w-full overflow-hidden bg-transparent rounded-lg">
      <svg
        viewBox="0 0 900 380"
        className="w-full h-auto max-h-[65vh] select-none"
        style={{ minHeight: '320px' }}
      >
        <defs>
          {/* Subtle paper grain filter or wire texture */}
          <filter id="pencilStroke" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* 1. Circuit Wires */}
        <g id="wires-layer">
          {circuit.wires.map((wire) => {
            const isPowered = wirePowered[wire.id] ?? false;

            return (
              <g key={wire.id}>
                {/* Glow behind wire when energized */}
                {isPowered && (
                  <path
                    d={wire.path}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.35"
                    className="transition-all duration-200"
                  />
                )}

                {/* Hand-drawn charcoal wire */}
                <path
                  d={wire.path}
                  fill="none"
                  stroke={isPowered ? '#0284c7' : '#1e293b'}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-150"
                  filter="url(#pencilStroke)"
                />
              </g>
            );
          })}
        </g>

        {/* 2. Battery */}
        <BatterySvg
          x={circuit.battery.x}
          y={circuit.battery.y - 18}
          voltage={circuit.battery.voltage || '9V'}
        />

        {/* 3. Logic Gates */}
        {circuit.gates?.map((gate) => {
          return (
            <LogicGateSvg
              key={gate.id}
              id={gate.id}
              type={gate.type}
              x={gate.x}
              y={gate.y}
              label={gate.label}
              outputPowered={wirePowered[`w_${gate.id}_out`] ?? false}
            />
          );
        })}

        {/* 4. Paperclip Switches */}
        {circuit.clips.map((clip) => {
          const isClosed = clipStates[clip.id] ?? clip.initialClosed;
          const isPowered = wirePowered[`w_${clip.id}_in`] ?? true;

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

        {/* 5. Lightbulb */}
        <LightbulbSvg
          x={circuit.bulb.x}
          y={circuit.bulb.y - 40}
          isOn={bulbIsOn}
          damageState={damageState}
          hasFishInBulb={circuit.hasFishInBulb}
          isPixelBulb={circuit.isPixelBulb}
        />

        {/* 6. Handwritten notes on paper if present */}
        {circuit.customNote && (
          <text
            x="450"
            y="230"
            textAnchor="middle"
            fill="#475569"
            className="font-caveat font-bold select-none italic"
            style={{ fontSize: '22px' }}
          >
            {circuit.customNote}
          </text>
        )}
      </svg>
    </div>
  );
};
