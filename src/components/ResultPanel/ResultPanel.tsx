import { CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import type { SimulationState } from '../../engine/types';
import { extractOutput } from '../../engine/tape';
import { verifyResult } from '../../engine/machine';
import styles from './ResultPanel.module.css';

interface ResultPanelProps {
  sim: SimulationState;
}

export function ResultPanel({ sim }: ResultPanelProps) {
  const output = extractOutput(sim.tape);
  const verified = verifyResult(sim.input, output);

  return (
    <section className={styles.panel} aria-label="Computation result">
      <div className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true"><BarChart2 size={14} /></span>
        <span className={styles.headerTitle}>Result</span>
      </div>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.label}>Input</span>
          <span className={styles.value}>{sim.input}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Output</span>
          <span className={`${styles.value} ${styles.accent}`}>{output}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Steps</span>
          <span className={`${styles.value} ${styles.small}`}>{sim.stepCount}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Final State</span>
          <span className={`${styles.value} ${styles.small}`}>{sim.currentState}</span>
        </div>
        <div className={`${styles.verificationRow} ${verified ? styles.pass : styles.fail}`}>
          <span className={`${styles.verificationIcon} ${verified ? styles.pass : styles.fail}`} aria-hidden="true">
            {verified ? <CheckCircle size={16} /> : <XCircle size={16} />}
          </span>
          <span className={`${styles.verificationText} ${verified ? styles.pass : styles.fail}`}>
            {verified ? 'Verification passed' : 'Verification failed'}
          </span>
          <span className={styles.verificationDetail}>
            {sim.input} + 1 = {output}
          </span>
        </div>
      </div>
    </section>
  );
}
