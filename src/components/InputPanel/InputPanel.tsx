import { useState, useCallback } from 'react';
import { Terminal, AlertCircle } from 'lucide-react';
import styles from './InputPanel.module.css';

const EXAMPLE_INPUTS = ['0', '1', '101', '111', '1011', '1111', '100111', '11111111'];

interface InputPanelProps {
  onLoad: (input: string) => void;
  onClear: () => void;
  validationError: string | null;
  isSimulating: boolean;
}

export function InputPanel({ onLoad, onClear, validationError, isSimulating }: InputPanelProps) {
  const [value, setValue] = useState('');

  const handleLoad = useCallback(() => {
    onLoad(value.trim());
  }, [value, onLoad]);

  const handleExample = useCallback((ex: string) => {
    setValue(ex);
    onLoad(ex);
  }, [onLoad]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLoad();
  }, [handleLoad]);

  return (
    <section className={styles.panel} aria-label="Input configuration">
      <div className={styles.header}>
        <span className={styles.headerIcon} aria-hidden="true"><Terminal size={14} /></span>
        <span className={styles.headerTitle}>Input</span>
      </div>
      <div className={styles.body}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={`${styles.input} ${validationError ? styles.hasError : ''}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter binary string…"
            aria-label="Binary input"
            aria-describedby={validationError ? 'input-error' : undefined}
            spellCheck={false}
            autoComplete="off"
            disabled={isSimulating}
          />
          <button
            className={styles.loadBtn}
            onClick={handleLoad}
            disabled={isSimulating || value.trim().length === 0}
            aria-label="Load input and initialize machine"
          >
            Load
          </button>
        </div>
        {validationError && (
          <p className={styles.errorMessage} id="input-error" role="alert">
            <AlertCircle size={13} className={styles.errorIcon} />
            {validationError}
          </p>
        )}
        <div>
          <p className={styles.examplesLabel}>Examples</p>
          <div className={styles.examples} role="list" aria-label="Example inputs">
            {EXAMPLE_INPUTS.map((ex) => (
              <button
                key={ex}
                className={styles.exampleBtn}
                onClick={() => handleExample(ex)}
                disabled={isSimulating}
                role="listitem"
                aria-label={`Load example: ${ex}`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.hint}>
          Enter a binary string using only <code>0</code> and <code>1</code>.
          Leading zeros are preserved. Maximum 64 bits.
        </p>
      </div>
    </section>
  );
}
