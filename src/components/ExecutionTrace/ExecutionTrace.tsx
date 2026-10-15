import { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';
import type { TraceEntry } from '../../engine/types';
import styles from './ExecutionTrace.module.css';

interface ExecutionTraceProps {
  trace: TraceEntry[];
}

export function ExecutionTrace({ trace }: ExecutionTraceProps) {
  const bottomRef = useRef<HTMLTableRowElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    if (bottomRef.current && scrollRef.current) {
      const container = scrollRef.current;
      // Only auto-scroll if near bottom
      const threshold = 100;
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      if (nearBottom || trace.length <= 5) {
        bottomRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [trace.length]);

  const moveLabel = (m: string) => {
    if (m === 'L') return '← L';
    if (m === 'R') return 'R →';
    return '— N';
  };

  return (
    <section className={styles.panel} aria-label="Execution trace">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon} aria-hidden="true"><Activity size={14} /></span>
          <span className={styles.headerTitle}>Execution Trace</span>
        </div>
        <span className={styles.stepCount}>{trace.length} steps</span>
      </div>

      {trace.length === 0 ? (
        <p className={styles.emptyTrace}>No steps executed yet. Step or Run to see the trace.</p>
      ) : (
        <div className={styles.traceScroll} ref={scrollRef}>
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">From State</th>
                <th scope="col">Head</th>
                <th scope="col">Read</th>
                <th scope="col">Write</th>
                <th scope="col">Move</th>
                <th scope="col">To State</th>
                <th scope="col">Tape</th>
              </tr>
            </thead>
            <tbody>
              {trace.map((entry, i) => (
                <tr
                  key={entry.step}
                  className={i === trace.length - 1 ? styles.latest : ''}
                  ref={i === trace.length - 1 ? bottomRef : undefined}
                >
                  <td>{entry.step}</td>
                  <td>{entry.prevState}</td>
                  <td>{entry.headPosition}</td>
                  <td>{entry.symbolRead}</td>
                  <td>{entry.symbolWritten}</td>
                  <td>{moveLabel(entry.direction)}</td>
                  <td>{entry.nextState}</td>
                  <td className={styles.tape} title={entry.tapeSnapshot}>{entry.tapeSnapshot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
