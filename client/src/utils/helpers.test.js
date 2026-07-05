import { describe, test, expect } from 'vitest';
import { fmt, isBlank, toNum } from './helpers';

describe('fmt.currency', () => {
  test('formats a number as USD currency', () => {
    expect(fmt.currency(1234.5)).toBe('₹1,234.50');
  });

  test('returns an em dash for null or undefined', () => {
    expect(fmt.currency(null)).toBe('—');
    expect(fmt.currency(undefined)).toBe('—');
  });
});

describe('isBlank', () => {
  test('treats undefined, null, and whitespace-only strings as blank', () => {
    expect(isBlank(undefined)).toBe(true);
    expect(isBlank(null)).toBe(true);
    expect(isBlank('   ')).toBe(true);
  });

  test('treats non-empty values as not blank', () => {
    expect(isBlank('Alex Kim')).toBe(false);
    expect(isBlank(0)).toBe(false);
  });
});

describe('toNum', () => {
  test('converts numeric strings to numbers', () => {
    expect(toNum('42')).toBe(42);
  });

  test('returns null for non-numeric input', () => {
    expect(toNum('abc')).toBeNull();
  });
});