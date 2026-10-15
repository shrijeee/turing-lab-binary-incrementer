import { describe, it, expect } from 'vitest';
import { createTape, readCell, writeCell, extractOutput, tapeSnapshot } from '../tape';

describe('Tape operations', () => {
  it('creates tape from input string', () => {
    const tape = createTape('101');
    expect(readCell(tape, 0)).toBe('1');
    expect(readCell(tape, 1)).toBe('0');
    expect(readCell(tape, 2)).toBe('1');
  });

  it('reads blank for unwritten cells', () => {
    const tape = createTape('1');
    expect(readCell(tape, -1)).toBe('B');
    expect(readCell(tape, 5)).toBe('B');
  });

  it('writes a symbol without mutating original', () => {
    const tape = createTape('10');
    const next = writeCell(tape, 1, '1');
    expect(readCell(tape, 1)).toBe('0'); // original unchanged
    expect(readCell(next, 1)).toBe('1');
  });

  it('writing blank removes the cell (sparse storage)', () => {
    const tape = createTape('1');
    const next = writeCell(tape, 0, 'B');
    expect(next.has(0)).toBe(false);
  });

  it('extracts output string from tape', () => {
    const tape = createTape('101');
    expect(extractOutput(tape)).toBe('101');
  });

  it('extracts output including negative indices', () => {
    let tape = createTape('111');
    tape = writeCell(tape, 0, '0');
    tape = writeCell(tape, 1, '0');
    tape = writeCell(tape, 2, '0');
    tape = writeCell(tape, -1, '1'); // prepended leading 1
    expect(extractOutput(tape)).toBe('1000');
  });

  it('produces readable tape snapshot', () => {
    const tape = createTape('101');
    const snap = tapeSnapshot(tape, 1);
    expect(snap).toContain('[0]');
  });
});
