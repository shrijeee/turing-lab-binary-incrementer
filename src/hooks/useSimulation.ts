import { useState, useRef, useCallback, useEffect } from 'react';
import { createInitialState, stepMachine } from '../engine/machine';
import { validateInput } from '../engine/validator';
import type { SimulationState } from '../engine/types';

export type SpeedLevel = 'slow' | 'medium' | 'fast' | 'instant';

const SPEED_MS: Record<SpeedLevel, number> = {
  slow: 800,
  medium: 300,
  fast: 80,
  instant: 0,
};

export interface UseSimulationReturn {
  sim: SimulationState | null;
  isRunning: boolean;
  speed: SpeedLevel;
  validationError: string | null;
  load: (input: string) => void;
  step: () => void;
  run: () => void;
  pause: () => void;
  reset: () => void;
  clear: () => void;
  setSpeed: (s: SpeedLevel) => void;
}

export function useSimulation(): UseSimulationReturn {
  const [sim, setSim] = useState<SimulationState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<SpeedLevel>('medium');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Use refs for values accessed inside the interval closure
  const simRef = useRef<SimulationState | null>(null);
  const isRunningRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedRef = useRef<SpeedLevel>('medium');

  // Keep refs in sync with state
  useEffect(() => { simRef.current = sim; }, [sim]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const load = useCallback((input: string) => {
    stopInterval();
    setIsRunning(false);
    const validation = validateInput(input);
    if (!validation.valid) {
      setValidationError(validation.error ?? 'Invalid input');
      setSim(null);
      return;
    }
    setValidationError(null);
    const initial = createInitialState(input);
    const ready = { ...initial, status: 'idle' as const };
    setSim(ready);
    simRef.current = ready;
  }, [stopInterval]);

  const step = useCallback(() => {
    setSim((prev) => {
      if (!prev || prev.status === 'halted' || prev.status === 'error') return prev;
      const next = stepMachine({ ...prev, status: 'running' });
      simRef.current = next;
      return next;
    });
  }, []);

  const scheduleNext = useCallback(() => {
    stopInterval();
    const delay = SPEED_MS[speedRef.current];

    const tick = () => {
      if (!isRunningRef.current) return;
      const current = simRef.current;
      if (!current || current.status === 'halted' || current.status === 'error') {
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }
      const next = stepMachine({ ...current, status: 'running' });
      simRef.current = next;
      setSim(next);

      if (next.status === 'halted' || next.status === 'error') {
        setIsRunning(false);
        isRunningRef.current = false;
        return;
      }
      intervalRef.current = setTimeout(tick, SPEED_MS[speedRef.current]);
    };

    intervalRef.current = setTimeout(tick, delay);
  }, [stopInterval]);

  const run = useCallback(() => {
    const current = simRef.current;
    if (!current || current.status === 'halted' || current.status === 'error') return;
    setIsRunning(true);
    isRunningRef.current = true;
    scheduleNext();
  }, [scheduleNext]);

  const pause = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    isRunningRef.current = false;
    setSim((prev) => prev ? { ...prev, status: 'paused' } : prev);
  }, [stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    isRunningRef.current = false;
    setSim((prev) => {
      if (!prev) return prev;
      const initial = createInitialState(prev.input);
      const ready = { ...initial, status: 'idle' as const };
      simRef.current = ready;
      return ready;
    });
  }, [stopInterval]);

  const clear = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    isRunningRef.current = false;
    setValidationError(null);
    setSim(null);
    simRef.current = null;
  }, [stopInterval]);

  const handleSetSpeed = useCallback((s: SpeedLevel) => {
    setSpeed(s);
    speedRef.current = s;
    // If currently running, restart with new speed
    if (isRunningRef.current) {
      scheduleNext();
    }
  }, [scheduleNext]);

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  return { sim, isRunning, speed, validationError, load, step, run, pause, reset, clear, setSpeed: handleSetSpeed };
}
