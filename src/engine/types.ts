export type TapeSymbol = '0' | '1' | 'B'; // B = blank

export type MoveDirection = 'L' | 'R' | 'N';

export type StateName =
  | 'q_scan_right'   // Scan right to find end of input
  | 'q_increment'    // Move left and perform increment/carry
  | 'q_carry'        // Carry propagation moving left
  | 'q_write_msb'    // Write leading 1 when carry overflows
  | 'q_halt';        // Halted (accepting)

export interface Transition {
  currentState: StateName;
  readSymbol: TapeSymbol;
  writeSymbol: TapeSymbol;
  move: MoveDirection;
  nextState: StateName;
  description: string; // Human-readable description for UI
}

export interface TapeCell {
  symbol: TapeSymbol;
  index: number;
}

export interface MachineConfig {
  states: StateName[];
  inputAlphabet: TapeSymbol[];
  tapeAlphabet: TapeSymbol[];
  blankSymbol: TapeSymbol;
  initialState: StateName;
  haltingState: StateName;
  transitions: Transition[];
}

export interface TraceEntry {
  step: number;
  prevState: StateName;
  headPosition: number;
  symbolRead: TapeSymbol;
  symbolWritten: TapeSymbol;
  direction: MoveDirection;
  nextState: StateName;
  tapeSnapshot: string; // E.g. "...B 1 [0] 1 B..."
  headPositionAfter: number;
}

export interface SimulationState {
  tape: Map<number, TapeSymbol>;
  headPosition: number;
  currentState: StateName;
  status: 'idle' | 'running' | 'paused' | 'halted' | 'error';
  trace: TraceEntry[];
  stepCount: number;
  errorMessage?: string;
  input: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
