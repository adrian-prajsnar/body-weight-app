import { describe, expect, it } from 'vitest';
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  resolveUnitSystem,
} from './units';

describe('weight conversions', () => {
  it('converts kg and lb consistently', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462, 2);
    expect(lbToKg(220.462)).toBeCloseTo(100, 1);
  });
});

describe('height conversions', () => {
  it('converts cm to feet/inches and back', () => {
    expect(cmToFeetInches(180)).toEqual({ feet: 5, inches: 11 });
    expect(feetInchesToCm(5, 11)).toBe(180);
  });
});

describe('resolveUnitSystem', () => {
  it('respects explicit preference over device locale', () => {
    expect(resolveUnitSystem('metric', 'us')).toBe('metric');
    expect(resolveUnitSystem('imperial', 'metric')).toBe('imperial');
  });

  it('uses imperial when preference is system and device is US', () => {
    expect(resolveUnitSystem('system', 'us')).toBe('imperial');
    expect(resolveUnitSystem('system', 'metric')).toBe('metric');
  });
});
