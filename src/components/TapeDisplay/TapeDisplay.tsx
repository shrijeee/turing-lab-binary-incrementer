import { useRef, useEffect, useMemo } from 'react';
import { CassetteTape as Tape } from 'lucide-react';
import type { SimulationState } from '../../engine/types';
import { readCell, getDisplayRange } from '../../engine/tape';
import styles from './TapeDisplay.module.css';

interface TapeDisplayProps {
  sim: SimulationState | null;
}

export function TapeDisplay({ sim }: TapeDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  // Auto-scroll head into view
  useEffect(() => {
    if (headRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const head = headRef.current;
      const containerRect = container.getBoundingClientRect();
      const headRect = head.getBoundingClientRect();

      const headCenter = headRect.left + headRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = headCenter - containerCenter;

      if (Math.abs(offset) > containerRect.width * 0.25) {
        container.scrollBy({ left: offset, behavior: 'smooth' });
      }
    }
  }, [sim?.headPosition]);

  // Track recently modified cells (last step's write position)
  const modifiedIndex = useMemo(() => {
    if (!sim || sim.trace.length === 0) return null;
    const last = sim.trace[sim.trace.length - 1];
    return last.headPosition; // position where the last write occurred
  }, [sim]);

  if (!sim) {
    return (
      <section className={styles.panel} aria-label="Tape visualization">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon} aria-hidden="true"><Tape size={14} /></span>
            <span className={styles.headerTitle}>Tape</span>
          </div>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <Tape size={32} strokeWidth={1} />
          </span>
          <p className={styles.emptyText}>Load a binary input to begin simulation</p>
        </div>
      </section>
    );
  }

  const { tape, headPosition, currentState, status } = sim;
  const { min, max } = getDisplayRange(tape, headPosition, 4);

  const stateClass =
    status === 'halted' ? styles.halted
    : status === 'error' ? styles.error
    : '';

  // Last trace entry for transition info
  const lastTrace = sim.trace.length > 0 ? sim.trace[sim.trace.length - 1] : null;

  return (
    <section className={styles.panel} aria-label="Tape visualization">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon} aria-hidden="true"><Tape size={14} /></span>
          <span className={styles.headerTitle}>Tape</span>
        </div>
        <div className={styles.stateInfo}>
          <span className={styles.stateLabel}>State</span>
          <span className={`${styles.stateName} ${stateClass}`} aria-label={`Current state: ${currentState}`}>
            {currentState}
          </span>
        </div>
      </div>

      <div className={styles.tapeScroll} ref={scrollRef} role="region" aria-label="Tape cells">
        <div className={styles.tapeTrack}>
          {Array.from({ length: max - min + 1 }, (_, i) => {
            const idx = min + i;
            const sym = readCell(tape, idx);
            const isHead = idx === headPosition;
            const isModified = !isHead && idx === modifiedIndex && status !== 'idle';
            const isBlank = sym === 'B';

            const cellClass = [
              styles.cell,
              isHead ? styles.head : '',
              isModified ? styles.modified : '',
              isBlank ? styles.blank : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={idx}
                className={styles.cellWrapper}
                ref={isHead ? headRef : undefined}
                aria-current={isHead ? 'true' : undefined}
              >
                {isHead && (
                  <div className={styles.headIndicator} aria-hidden="true">
                    <span className={styles.headLabel}>Head</span>
                    <span className={styles.headArrow}>▼</span>
                  </div>
                )}
                <div
                  className={cellClass}
                  role="cell"
                  aria-label={`Cell ${idx}: ${sym === 'B' ? 'blank' : sym}${isHead ? ', head position' : ''}`}
                >
                  {sym === 'B' ? 'B' : sym}
                </div>
                <div className={styles.cellIndex}>{idx}</div>
              </div>
            );
          })}
        </div>
      </div>

      {lastTrace && (
        <div className={styles.transitionInfo} aria-label="Last transition details">
          <span className={styles.transitionLabel}>Last transition</span>
          <span className={styles.transitionDetail}>
            Read: <span>{lastTrace.symbolRead}</span>
          </span>
          <span className={styles.transitionDetail}>
            Wrote: <span>{lastTrace.symbolWritten}</span>
          </span>
          <span className={styles.transitionDetail}>
            Moved: <span>{lastTrace.direction === 'N' ? 'None' : lastTrace.direction === 'L' ? 'Left' : 'Right'}</span>
          </span>
        </div>
      )}
    </section>
  );
}
