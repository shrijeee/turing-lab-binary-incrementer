import type { ValidationResult } from './types';

/**
 * Validates binary input for the Turing Machine.
 *
 * Convention: Leading zeros are accepted (e.g., "010" is valid and represents 2).
 * The machine will correctly compute 010 → 011.
 * Empty string is rejected; the user must enter at least one character.
 */
export function validateInput(input: string): ValidationResult {
  if (input.length === 0) {
    return { valid: false, error: 'Input cannot be empty. Enter a binary string (0s and 1s).' };
  }
  if (!/^[01]+$/.test(input)) {
    const badChars = [...new Set(input.split('').filter((c) => c !== '0' && c !== '1'))];
    return {
      valid: false,
      error: `Invalid character(s): ${badChars.map((c) => JSON.stringify(c)).join(', ')}. Only 0 and 1 are allowed.`,
    };
  }
  if (input.length > 64) {
    return { valid: false, error: 'Input too long. Maximum 64 bits for display clarity.' };
  }
  return { valid: true };
}
