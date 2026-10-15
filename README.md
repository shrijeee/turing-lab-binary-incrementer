# Turing Lab — Binary Incrementer Simulator

> An interactive Turing Machine workbench demonstrating formal computation.

An interactive Turing Machine Transducer that increments binary numbers using state transitions and tape operations. Built for Theory of Computation (TOC), featuring step-by-step simulation, tape visualization, and transition tracing.

![Turing Lab Screenshot](./docs/screenshot.png)

---

## Overview

**Turing Lab** is a professional, interactive web application that simulates a Turing Machine computing the binary increment function f(x) = x + 1. Built as an academic project for Theory of Computation (TOC), it visualises every state transition, tape operation, and carry propagation step of a formally defined Turing Machine transducer.

Unlike toy simulators that convert numbers with JavaScript arithmetic and fake tape movement, Turing Lab runs a mathematically rigorous machine: the tape is mutable, the head moves one cell at a time, and every symbol written is determined by the explicit transition function δ.

---

## Problem Statement

Given a binary string w ∈ {0,1}*, compute f(w) = w + 1, where w represents a non-negative integer in standard binary notation.

For example: `111` (7) → `1000` (8).

The computation must be performed by a Turing Machine that physically modifies a tape — not by JavaScript arithmetic.

---

## Objectives

1. Implement a formally correct Turing Machine transducer for binary increment.
2. Provide an interactive, step-by-step simulation with full execution trace.
3. Visualise the tape, head position, and state transitions in real time.
4. Verify the output independently using arithmetic comparison.
5. Document the machine definition for academic review.

---

## Theory: Turing Machine Transducer

A **Turing Machine** is a mathematical model of computation defined by the 7-tuple:

```
M = (Q, Σ, Γ, δ, q₀, B, F)
```

| Component | Description |
|-----------|-------------|
| Q | Finite set of states |
| Σ | Input alphabet |
| Γ | Tape alphabet (Σ ⊆ Γ) |
| δ | Transition function: Q × Γ → Q × Γ × {L, R, N} |
| q₀ | Initial state |
| B | Blank symbol (B ∈ Γ \ Σ) |
| F | Set of accepting/halting states |

A **transducer** is a Turing Machine that produces output on the tape rather than simply accepting or rejecting. When it halts, the tape contents represent the computed result.

---

## Binary Increment Algorithm

The machine implements the standard carry-ripple increment:

1. **Scan right**: Move the head rightward, passing over all input bits, to find the first blank (end of input).
2. **Move to LSB**: Step left once to land on the least significant bit (LSB).
3. **Increment**:
   - If LSB is `0`: write `1` and halt (no carry).
   - If LSB is `1`: write `0`, move left (carry propagates).
4. **Carry propagation**: Continue moving left.
   - `0` → write `1`, halt.
   - `1` → write `0`, move left (carry continues).
   - Blank → write `1`, halt (all bits were 1; new leading digit prepended).

---

## Formal Machine Definition

```
Q  = { q_scan_right, q_increment, q_carry, q_halt }
Σ  = { 0, 1 }
Γ  = { 0, 1, B }
q₀ = q_scan_right
B  = B (blank)
F  = { q_halt }
```

### Transition Function δ

| State | Read | Write | Move | Next State |
|-------|------|-------|------|------------|
| q_scan_right | 0 | 0 | R | q_scan_right |
| q_scan_right | 1 | 1 | R | q_scan_right |
| q_scan_right | B | B | L | q_increment |
| q_increment | 0 | 1 | N | q_halt |
| q_increment | 1 | 0 | L | q_carry |
| q_increment | B | 1 | N | q_halt |
| q_carry | 0 | 1 | N | q_halt |
| q_carry | 1 | 0 | L | q_carry |
| q_carry | B | 1 | N | q_halt |

**Note**: Move `N` means no head movement (the head stays at the current cell after writing).

---

## Examples

| Input | Binary Value | Output | Output Value |
|-------|-------------|--------|--------------|
| `0` | 0 | `1` | 1 |
| `1` | 1 | `10` | 2 |
| `10` | 2 | `11` | 3 |
| `101` | 5 | `110` | 6 |
| `111` | 7 | `1000` | 8 |
| `1011` | 11 | `1100` | 12 |
| `1111` | 15 | `10000` | 16 |
| `100111` | 39 | `101000` | 40 |
| `11111111` | 255 | `100000000` | 256 |

**Leading zeros**: Leading zeros are accepted and preserved where possible. `010` → `011` (increment of 2 is 3). The output is not stripped of leading zeros unless the computation naturally removes them.

---

## Architecture

```
src/
├── engine/              # Pure computation — no React dependencies
│   ├── types.ts         # TypeScript interfaces and type aliases
│   ├── transitions.ts   # Transition table and lookup function
│   ├── tape.ts          # Tape data structure (sparse Map)
│   ├── machine.ts       # Step engine, run-to-halt, verification
│   └── validator.ts     # Input validation
│   └── __tests__/       # Unit tests (Vitest)
├── hooks/
│   └── useSimulation.ts # React hook: state machine for UI lifecycle
├── components/
│   ├── NavBar/          # Top navigation bar
│   ├── InputPanel/      # Binary input and example loading
│   ├── TapeDisplay/     # Animated tape visualisation
│   ├── Controls/        # Step / Run / Pause / Reset / Speed
│   ├── TransitionTable/ # Live transition function display
│   ├── ExecutionTrace/  # Scrollable step-by-step log
│   └── ResultPanel/     # Final output and verification
├── App.tsx              # Layout composition
└── main.tsx             # Entry point
```

**Design principles**:
- The engine (`src/engine/`) is pure TypeScript with zero UI coupling. It can be tested in Node.js.
- The hook (`useSimulation.ts`) manages the UI lifecycle (running, pausing, speed) without polluting the engine.
- All CSS is in CSS Modules co-located with each component.

---

## Features

- ✅ Mathematically correct Turing Machine transition engine
- ✅ Step-by-step or automatic execution with adjustable speed
- ✅ Animated tape visualisation with head tracker
- ✅ Live transition table with active-row highlighting
- ✅ Full execution trace with tape snapshots
- ✅ Independent arithmetic verification of the result
- ✅ Example inputs (0, 1, 101, 111, 1111, 100111, 11111111)
- ✅ Responsive layout for desktop and mobile
- ✅ Accessible controls (ARIA labels, focus states, reduced motion)
- ✅ Unit-tested engine (Vitest)

---

## Installation

**Prerequisites**: Node.js ≥ 18, npm ≥ 9

```bash
git clone <repository-url>
cd "Turing Lab - Binary Incrementer Simulator"
npm install
```

---

## Local Development

```bash
npm run dev
```

Opens the application at `http://localhost:5173`.

---

## Production Build

```bash
npm run build
npm run preview
```

---

## Testing

```bash
npm test
```

Runs all unit tests once and reports results.

```bash
npm run test:watch
```

Runs tests in watch mode during development.

The test suite covers:
- Tape operations (create, read, write, extract output)
- Transition table lookups
- Binary increment correctness for all reference cases
- Overflow (all-ones) inputs
- Execution trace generation
- Independent verification function

---

## Screenshots

> _Screenshots will be added after initial deployment._

| View | Description |
|------|-------------|
| `docs/screenshot.png` | Full application — tape mid-execution |

---

## Limitations

- Input is limited to 64 bits for display clarity. Removing this limit is straightforward.
- The tape visualisation clips at ±4 cells of padding; for very long inputs the display range is extended automatically.
- No persistent state between page reloads (by design — this is a stateless simulator).

---

## Possible Extensions

- Export execution trace as CSV or JSON
- Support for other Turing Machine programs (binary decrement, addition, etc.)
- State diagram visualisation
- Shareable URL with encoded input
- Non-deterministic TM simulation

---

## License

This project does not yet include an open-source license. Contact the author before reuse.

---

## Academic Context

Built for Theory of Computation coursework. Demonstrates formal Turing Machine computation as described in Sipser, *Introduction to the Theory of Computation* (3rd ed.), Chapter 3.
