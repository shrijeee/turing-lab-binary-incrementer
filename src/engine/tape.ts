import type { TapeSymbol } from './types';

const BLANK: TapeSymbol = 'B';

/**
 * Tape implemented as a Map<number, TapeSymbol>.
 * Supports arbitrarily negative indices (for carry overflow).
 * Unwritten cells implicitly contain the blank symbol.
 */
export function createTape(input: string): Map<number, TapeSymbol> {
  const tape = new Map<number, TapeSymbol>();
  for (let i = 0; i < input.length; i++) {
    tape.set(i, input[i] as TapeSymbol);
  }
  return tape;
}

export function readCell(tape: Map<number, TapeSymbol>, index: number): TapeSymbol {
  return tape.get(index) ?? BLANK;
}

export function writeCell(
  tape: Map<number, TapeSymbol>,
  index: number,
  symbol: TapeSymbol
): Map<number, TapeSymbol> {
  const next = new Map(tape);
  if (symbol === BLANK) {
    next.delete(index); // sparse: blanks are implicit
  } else {
    next.set(index, symbol);
  }
  return next;
}

/**
 * Returns the contiguous range of meaningful cells for display.
 * Adds padding blank cells on both sides.
 */
export function getDisplayRange(
  tape: Map<number, TapeSymbol>,
  headPosition: number,
  padding = 3
): { min: number; max: number } {
  if (tape.size === 0) {
    return { min: headPosition - padding, max: headPosition + padding };
  }
  const indices = Array.from(tape.keys());
  const min = Math.min(...indices, headPosition) - padding;
  const max = Math.max(...indices, headPosition) + padding;
  return { min, max };
}

/**
 * Produces a compact human-readable tape snapshot for the trace.
 * Example: "B 1 [0] 1 B" where [X] marks the head.
 */
export function tapeSnapshot(
  tape: Map<number, TapeSymbol>,
  headPosition: number
): string {
  const { min, max } = getDisplayRange(tape, headPosition, 2);
  const parts: string[] = [];
  for (let i = min; i <= max; i++) {
    const sym = readCell(tape, i);
    parts.push(i === headPosition ? `[${sym}]` : sym);
  }
  return parts.join(' ');
}

/**
 * Extracts the meaningful output: the contiguous non-blank substring
 * starting from the leftmost non-blank cell.
 */
export function extractOutput(tape: Map<number, TapeSymbol>): string {
  if (tape.size === 0) return 'B';
  const indices = Array.from(tape.keys()).sort((a, b) => a - b);
  const min = indices[0];
  const max = indices[indices.length - 1];
  let result = '';
  for (let i = min; i <= max; i++) {
    result += readCell(tape, i);
  }
  return result || 'B';
}
