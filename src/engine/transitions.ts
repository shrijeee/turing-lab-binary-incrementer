import type { Transition, MachineConfig, StateName, TapeSymbol } from './types';

/**
 * Binary Incrementer Turing Machine Transition Function
 *
 * Algorithm:
 * 1. q_scan_right: Move right over 0s and 1s until blank is found.
 * 2. q_increment: Move left one step (now at LSB), begin increment.
 *    - Read 0 → write 1, halt (no carry needed).
 *    - Read 1 → write 0, continue left (carry).
 *    - Read B → write 1 (single blank = empty input treated as 0), halt.
 * 3. q_carry: Continue moving left with carry.
 *    - Read 0 → write 1, halt.
 *    - Read 1 → write 0, continue left.
 *    - Read B → write 1 (overflow: all bits were 1), halt.
 * 4. q_halt: Terminal state.
 *
 * State naming is descriptive and maps directly to algorithm phases.
 */
export const TRANSITIONS: Transition[] = [
  // ── Phase 1: Scan right to find end of input ──────────────────────────────
  {
    currentState: 'q_scan_right',
    readSymbol: '0',
    writeSymbol: '0',
    move: 'R',
    nextState: 'q_scan_right',
    description: 'Scanning right past 0',
  },
  {
    currentState: 'q_scan_right',
    readSymbol: '1',
    writeSymbol: '1',
    move: 'R',
    nextState: 'q_scan_right',
    description: 'Scanning right past 1',
  },
  {
    currentState: 'q_scan_right',
    readSymbol: 'B',
    writeSymbol: 'B',
    move: 'L',
    nextState: 'q_increment',
    description: 'Reached end of input — move left to LSB',
  },
  // ── Phase 2: Begin increment at LSB (first entry, before any carry) ───────
  {
    currentState: 'q_increment',
    readSymbol: '0',
    writeSymbol: '1',
    move: 'N',
    nextState: 'q_halt',
    description: 'LSB is 0 → write 1, halt (no carry)',
  },
  {
    currentState: 'q_increment',
    readSymbol: '1',
    writeSymbol: '0',
    move: 'L',
    nextState: 'q_carry',
    description: 'LSB is 1 → write 0, carry left',
  },
  {
    currentState: 'q_increment',
    readSymbol: 'B',
    writeSymbol: '1',
    move: 'N',
    nextState: 'q_halt',
    description: 'Empty input (blank at head) → write 1, halt',
  },
  // ── Phase 3: Carry propagation ────────────────────────────────────────────
  {
    currentState: 'q_carry',
    readSymbol: '0',
    writeSymbol: '1',
    move: 'N',
    nextState: 'q_halt',
    description: 'Carry absorbed by 0 → write 1, halt',
  },
  {
    currentState: 'q_carry',
    readSymbol: '1',
    writeSymbol: '0',
    move: 'L',
    nextState: 'q_carry',
    description: 'Carry propagates: 1 → 0, continue left',
  },
  {
    currentState: 'q_carry',
    readSymbol: 'B',
    writeSymbol: '1',
    move: 'N',
    nextState: 'q_halt',
    description: 'Carry overflow: prepend leading 1, halt',
  },
];

export const MACHINE_CONFIG: MachineConfig = {
  states: ['q_scan_right', 'q_increment', 'q_carry', 'q_halt'],
  inputAlphabet: ['0', '1'],
  tapeAlphabet: ['0', '1', 'B'],
  blankSymbol: 'B',
  initialState: 'q_scan_right',
  haltingState: 'q_halt',
  transitions: TRANSITIONS,
};

/**
 * Look up a transition given the current state and symbol.
 * Returns undefined if no transition exists (should not happen in a
 * well-defined machine, but handled gracefully by the engine).
 */
export function lookupTransition(
  state: StateName,
  symbol: TapeSymbol
): Transition | undefined {
  return TRANSITIONS.find(
    (t) => t.currentState === state && t.readSymbol === symbol
  );
}
