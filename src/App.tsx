import { useCallback } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { NavBar } from './components/NavBar/NavBar';
import { InputPanel } from './components/InputPanel/InputPanel';
import { TapeDisplay } from './components/TapeDisplay/TapeDisplay';
import { Controls } from './components/Controls/Controls';
import { TransitionTable } from './components/TransitionTable/TransitionTable';
import { ExecutionTrace } from './components/ExecutionTrace/ExecutionTrace';
import { ResultPanel } from './components/ResultPanel/ResultPanel';
import styles from './App.module.css';

export default function App() {
  const { sim, isRunning, speed, validationError, load, step, run, pause, reset, clear, setSpeed } = useSimulation();

  const handleLoad = useCallback((input: string) => {
    load(input);
  }, [load]);

  return (
    <div className={styles.app}>
      <NavBar machineStatus={sim?.status ?? 'idle'} />
      <main className={styles.main}>
        <div className={styles.leftColumn}>
          <InputPanel
            onLoad={handleLoad}
            onClear={clear}
            validationError={validationError}
            isSimulating={isRunning || (sim?.status === 'running')}
          />
          <TransitionTable activeTransitionKey={sim ? `${sim.currentState}-${sim.tape.get(sim.headPosition) ?? 'B'}` : null} />
        </div>
        <div className={styles.rightColumn}>
          <TapeDisplay sim={sim} />
          <Controls
            sim={sim}
            isRunning={isRunning}
            speed={speed}
            onStep={step}
            onRun={run}
            onPause={pause}
            onReset={reset}
            onSetSpeed={setSpeed}
          />
          {sim?.status === 'halted' && (
            <ResultPanel sim={sim} />
          )}
        </div>
        <div className={styles.bottomRow}>
          <ExecutionTrace trace={sim?.trace ?? []} />
        </div>
      </main>
    </div>
  );
}
