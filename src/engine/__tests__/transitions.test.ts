import { describe, it, expect } from 'vitest';
import { lookupTransition, TRANSITIONS } from '../transitions';

describe('Transition table', () => {
  it('has a transition for every (state, symbol) pair defined', () => {
    expect(TRANSITIONS.length).toBeGreaterThan(0);
  });

  it('q_scan_right + 0 → moves right, stays in q_scan_right', () => {
    const t = lookupTransition('q_scan_right', '0');
    expect(t).toBeDefined();
    expect(t!.move).toBe('R');
    expect(t!.nextState).toBe('q_scan_right');
    expect(t!.writeSymbol).toBe('0');
  });

  it('q_scan_right + 1 → moves right, stays in q_scan_right', () => {
    const t = lookupTransition('q_scan_right', '1');
    expect(t).toBeDefined();
    expect(t!.move).toBe('R');
    expect(t!.nextState).toBe('q_scan_right');
  });

  it('q_scan_right + B → moves left, enters q_increment', () => {
    const t = lookupTransition('q_scan_right', 'B');
    expect(t).toBeDefined();
    expect(t!.move).toBe('L');
    expect(t!.nextState).toBe('q_increment');
  });

  it('q_increment + 0 → writes 1, halts (no move)', () => {
    const t = lookupTransition('q_increment', '0');
    expect(t).toBeDefined();
    expect(t!.writeSymbol).toBe('1');
    expect(t!.nextState).toBe('q_halt');
  });

  it('q_increment + 1 → writes 0, moves left, enters q_carry', () => {
    const t = lookupTransition('q_increment', '1');
    expect(t).toBeDefined();
    expect(t!.writeSymbol).toBe('0');
    expect(t!.move).toBe('L');
    expect(t!.nextState).toBe('q_carry');
  });

  it('q_carry + 0 → writes 1, halts', () => {
    const t = lookupTransition('q_carry', '0');
    expect(t).toBeDefined();
    expect(t!.writeSymbol).toBe('1');
    expect(t!.nextState).toBe('q_halt');
  });

  it('q_carry + 1 → writes 0, moves left, stays q_carry', () => {
    const t = lookupTransition('q_carry', '1');
    expect(t).toBeDefined();
    expect(t!.writeSymbol).toBe('0');
    expect(t!.move).toBe('L');
    expect(t!.nextState).toBe('q_carry');
  });

  it('q_carry + B → writes 1, halts (overflow)', () => {
    const t = lookupTransition('q_carry', 'B');
    expect(t).toBeDefined();
    expect(t!.writeSymbol).toBe('1');
    expect(t!.nextState).toBe('q_halt');
  });

  it('returns undefined for q_halt + any symbol (no transitions from halt)', () => {
    expect(lookupTransition('q_halt', '0')).toBeUndefined();
    expect(lookupTransition('q_halt', '1')).toBeUndefined();
    expect(lookupTransition('q_halt', 'B')).toBeUndefined();
  });
});
