import { SkipForward, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import type { SimulationState } from '../../engine/types';
import type { SpeedLevel } from '../../hooks/useSimulation';
import styles from './Controls.module.css';

const SPEED_OPTIONS: { label: string; value: SpeedLevel }[] = [
  { label: 'Slow', value: 'slow' },
  { label: 'Med', value: 'medium' },
  { label: 'Fast', value: 'fast' },
  { label: '⚡', value: 'instant' },
];

interface ControlsProps {
  sim: SimulationState | null;
  isRunning: boolean;
  speed: SpeedLevel;
  onStep: () => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetSpeed: (s: SpeedLevel) => void;
}

export function Controls({ sim, isRunning, speed, onStep, onRun, onPause, onReset, onSetSpeed }: ControlsProps) {
  const isIdle = !sim;
  const isHalted = sim?.status === 'halted';
  const isError = sim?.status === 'error';
  const canStep = !isIdle && !isRunning && !isHalted && !isError;
  const canRun = !isIdle && !isRunning && !isHalted && !isError;
  const canPause = isRunning;
  const canReset = !isIdle && !isRunning;

  return (
    <div className={styles.panel} role="toolbar" aria-label="Simulation controls">
      <div className={styles.controlGroup}>
        <button
          className={styles.btn}
          onClick={onStep}
          disabled={!canStep}
          title="Execute one transition (Step)"
          aria-label="Step: execute one transition"
        >
          <SkipForward size={14} />
          Step
        </button>

        {isRunning ? (
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={onPause}
            title="Pause execution"
            aria-label="Pause automatic execution"
          >
            <Pause size={14} />
            Pause
          </button>
        ) : (
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={onRun}
            disabled={!canRun}
            title="Run to halt"
            aria-label="Run machine to halting state"
          >
            <Play size={14} />
            Run
          </button>
        )}

        <div className={styles.divider} aria-hidden="true" />

        <button
          className={`${styles.btn} ${styles.danger}`}
          onClick={onReset}
          disabled={!canReset}
          title="Reset to initial configuration"
          aria-label="Reset machine to initial state"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className={styles.controlGroup}>
        <div className={styles.speedGroup}>
          <span className={styles.speedLabel}>Speed</span>
          <div className={styles.speedBtns} role="group" aria-label="Execution speed">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.speedBtn} ${speed === opt.value ? styles.active : ''}`}
                onClick={() => onSetSpeed(opt.value)}
                aria-pressed={speed === opt.value}
                aria-label={`Speed: ${opt.label}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {sim && (
          <span className={styles.stepInfo} aria-live="polite" aria-atomic="true">
            Step <span>{sim.stepCount}</span>
          </span>
        )}
      </div>
    </div>
  );
}
