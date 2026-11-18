import { describe, it, expect, beforeEach } from 'vitest';
import { formatINR, cn, getGuestToken, setGuestToken, getAuthToken, setAuthToken, removeAuthToken } from '../lib/utils';

describe('formatINR utility', () => {
  it('formats paise into Indian Rupee notation correctly', () => {
    // 13490000 paise = 134900 rupees = ₹1,34,900
    expect(formatINR(13490000)).toBe('₹1,34,900');
    // 8990000 paise = ₹89,900
    expect(formatINR(8990000)).toBe('₹89,900');
    // 0 paise
    expect(formatINR(0)).toBe('₹0');
    // 500 paise = ₹5
    expect(formatINR(500)).toBe('₹5');
    // 19999900 paise = ₹1,99,999
    expect(formatINR(19999900)).toBe('₹1,99,999');
  });

  it('handles negative or invalid edge cases safely', () => {
    expect(formatINR(NaN)).toBe('₹0');
  });
});

describe('cn utility', () => {
  it('merges class names and handles Tailwind conflicts', () => {
    expect(cn('p-4', 'bg-black', 'text-white')).toBe('p-4 bg-black text-white');
    expect(cn('p-4', false && 'hidden', 'p-8')).toBe('p-8');
  });
});

describe('Token storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates, persists and retrieves guest token', () => {
    const token = getGuestToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(10);
    // Retrieving again should return the same token
    expect(getGuestToken()).toBe(token);

    // Explicit set
    setGuestToken('custom-guest-token');
    expect(getGuestToken()).toBe('custom-guest-token');
  });

  it('handles auth token lifecycle', () => {
    expect(getAuthToken()).toBeNull();
    setAuthToken('jwt-sample-token-123');
    expect(getAuthToken()).toBe('jwt-sample-token-123');
    removeAuthToken();
    expect(getAuthToken()).toBeNull();
  });
});
