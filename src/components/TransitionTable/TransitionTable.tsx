import { Table } from 'lucide-react';
import { TRANSITIONS } from '../../engine/transitions';
import styles from './TransitionTable.module.css';

interface TransitionTableProps {
  activeTransitionKey: string | null;
}

export function TransitionTable({ activeTransitionKey }: TransitionTableProps) {
  return (
    <section className={styles.panel} aria-label="Transition function table">
      <div className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true"><Table size={14} /></span>
        <span className={styles.headerTitle}>Transition Function δ</span>
      </div>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Read</th>
              <th scope="col">Write</th>
              <th scope="col">Move</th>
              <th scope="col">Next State</th>
            </tr>
          </thead>
          <tbody>
            {TRANSITIONS.map((t, i) => {
              const key = `${t.currentState}-${t.readSymbol}`;
              const isActive = key === activeTransitionKey;
              return (
                <tr
                  key={i}
                  className={isActive ? styles.active : ''}
                  aria-selected={isActive}
                >
                  <td className={styles.state}>{t.currentState}</td>
                  <td className={styles.symbol}>{t.readSymbol}</td>
                  <td className={styles.symbol}>{t.writeSymbol}</td>
                  <td className={styles.move}>{t.move}</td>
                  <td className={`${styles.state} ${t.nextState === 'q_halt' ? styles.halt : ''}`}>
                    {t.nextState}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
