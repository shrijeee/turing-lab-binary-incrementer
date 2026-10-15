import { describe, it, expect } from 'vitest';
import { createInitialState, stepMachine, runToHalt, verifyResult } from '../machine';
import { extractOutput } from '../tape';

function incrementBinary(input: string): string {
  const initial = createInitialState(input);
  const final = runToHalt(initial);
  if (final.status === 'error') throw new Error(final.errorMessage);
  return extractOutput(final.tape);
}

describe('Binary Incrementer — correctness', () => {
  const cases: [string, string][] = [
    ['0', '1'],
    ['1', '10'],
    ['10', '11'],
    ['101', '110'],
    ['111', '1000'],
    ['1011', '1100'],
    ['1111', '10000'],
    ['100111', '101000'],
    ['0000', '0001'],
    ['1000000', '1000001'],
    // Large all-ones overflow
    ['11111111', '100000000'],
  ];

  for (const [input, expected] of cases) {
    it(`increments ${input} → ${expected}`, () => {
      expect(incrementBinary(input)).toBe(expected);
    });
  }
});

describe('Binary Incrementer — execution trace', () => {
  it('produces a non-empty trace', () => {
    const initial = createInitialState('101');
    const final = runToHalt(initial);
    expect(final.trace.length).toBeGreaterThan(0);
  });

  it('each step increments stepCount', () => {
    const s0 = createInitialState('10');
    const s1 = stepMachine({ ...s0, status: 'running' });
    expect(s1.stepCount).toBe(1);
  });

  it('halts in q_halt state', () => {
    const initial = createInitialState('101');
    const final = runToHalt(initial);
    expect(final.currentState).toBe('q_halt');
    expect(final.status).toBe('halted');
  });
});

describe('verifyResult', () => {
  it('correctly verifies increment', () => {
    expect(verifyResult('101', '110')).toBe(true);
    expect(verifyResult('111', '1000')).toBe(true);
    expect(verifyResult('101', '111')).toBe(false);
  });

  it('handles large numbers', () => {
    expect(verifyResult('11111111', '100000000')).toBe(true);
  });
});
