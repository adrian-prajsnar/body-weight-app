import { describe, expect, it } from 'vitest';
import { getHeightAtDate } from './height';
import { HeightEntry } from './types';

const entries: HeightEntry[] = [
  { effectiveDate: '2024-01-01', heightCm: 170 },
  { effectiveDate: '2024-06-01', heightCm: 172 },
];

describe('getHeightAtDate', () => {
  it('returns the latest height on or before the date', () => {
    expect(getHeightAtDate(entries, '2024-03-15')).toBe(170);
    expect(getHeightAtDate(entries, '2024-06-01')).toBe(172);
    expect(getHeightAtDate(entries, '2024-12-31')).toBe(172);
  });

  it('returns null when no height covers the date', () => {
    expect(getHeightAtDate(entries, '2023-12-31')).toBeNull();
    expect(getHeightAtDate([], '2024-01-01')).toBeNull();
  });
});
