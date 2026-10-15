import type { SimulationState, TraceEntry, StateName } from './types';
import { MACHINE_CONFIG, lookupTransition } from './transitions';
import { createTape, readCell, writeCell, tapeSnapshot } from './tape';

const MAX_STEPS = 10000; // Safety limit

/**
 * Creates the initial simulation state for a given binary input.
 */
export function createInitialState(input: string): SimulationState {
  return {
    tape: createTape(input),
    headPosition: 0,
    currentState: MACHINE_CONFIG.initialState,
    status: 'idle',
    trace: [],
    stepCount: 0,
    input,
  };
}

/**
 * Executes exactly one transition step.
 * Returns a new SimulationState (immutable update pattern).
 */
export function stepMachine(state: SimulationState): SimulationState {
  if (state.status === 'halted' || state.status === 'error') {
    return state;
  }

  const { tape, headPosition, currentState, trace, stepCount } = state;

  if (stepCount >= MAX_STEPS) {
    return {
      ...state,
      status: 'error',
      errorMessage: `Exceeded maximum step limit (${MAX_STEPS}). The machine may not terminate.`,
    };
  }

  const symbolRead = readCell(tape, headPosition);
  const transition = lookupTransition(currentState, symbolRead);

  if (!transition) {
    return {
      ...state,
      status: 'error',
      errorMessage: `No transition defined for state "${currentState}" reading symbol "${symbolRead}".`,
    };
  }

  const snapshotBefore = tapeSnapshot(tape, headPosition);

  // Apply the transition
  const newTape = writeCell(tape, headPosition, transition.writeSymbol);
  let newHeadPosition = headPosition;
  if (transition.move === 'L') newHeadPosition -= 1;
  else if (transition.move === 'R') newHeadPosition += 1;
  // 'N' means no move

  const newState = transition.nextState;
  const newStatus: SimulationState['status'] =
    newState === MACHINE_CONFIG.haltingState ? 'halted' : 'running';

  const traceEntry: TraceEntry = {
    step: stepCount + 1,
    prevState: currentState,
    headPosition,
    symbolRead,
    symbolWritten: transition.writeSymbol,
    direction: transition.move,
    nextState: newState,
    tapeSnapshot: snapshotBefore,
    headPositionAfter: newHeadPosition,
  };

  return {
    ...state,
    tape: newTape,
    headPosition: newHeadPosition,
    currentState: newState,
    status: newStatus,
    trace: [...trace, traceEntry],
    stepCount: stepCount + 1,
  };
}

/**
 * Runs the machine to completion from the current state.
 * Returns the final SimulationState with full trace.
 */
export function runToHalt(state: SimulationState): SimulationState {
  let current: SimulationState = { ...state, status: 'running' };
  while (current.status === 'running') {
    current = stepMachine(current);
  }
  return current;
}

/**
 * Independent verification: checks that the machine output equals
 * the arithmetic increment of the input.
 * This is ONLY used for verification display — NOT used by the engine.
 */
export function verifyResult(input: string, outputTape: string): boolean {
  // Remove leading zeros from output for comparison, but keep at least one digit
  const cleanInput = input.replace(/^0+/, '') || '0';
  const cleanOutput = outputTape.replace(/^0+/, '') || '0';

  // Convert to BigInt for exact arithmetic (handles arbitrary length)
  try {
    const inputNum = BigInt('0b' + (cleanInput || '0'));
    const expectedNum = inputNum + 1n;
    const expectedBin = expectedNum.toString(2);
    return cleanOutput === expectedBin;
  } catch {
    return false;
  }
}
