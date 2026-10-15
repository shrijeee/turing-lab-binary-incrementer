import { Cpu, Github } from 'lucide-react';
import type { SimulationState } from '../../engine/types';
import styles from './NavBar.module.css';

interface NavBarProps {
  machineStatus: SimulationState['status'] | 'idle';
}

const STATUS_LABELS: Record<string, string> = {
  idle: 'Idle',
  running: 'Running',
  paused: 'Paused',
  halted: 'Halted',
  error: 'Error',
};

export function NavBar({ machineStatus }: NavBarProps) {
  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.brand}>
        <span className={styles.brandIcon} aria-hidden="true">
          <Cpu size={22} strokeWidth={1.5} />
        </span>
        <div className={styles.brandText}>
          <span className={styles.brandName}>Turing Lab</span>
          <span className={styles.brandSubtitle}>Theory of Computation · Machine Simulator</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.statusBadge} role="status" aria-live="polite">
          <span className={`${styles.statusDot} ${machineStatus !== 'idle' ? styles[machineStatus] : ''}`} />
          {STATUS_LABELS[machineStatus] ?? machineStatus}
        </div>
      </div>
    </nav>
  );
}
