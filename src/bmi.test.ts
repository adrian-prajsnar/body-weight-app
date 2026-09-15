import { describe, expect, it } from 'vitest';
import { calculateBmi, classifyBmiValue } from './bmi';

describe('classifyBmiValue', () => {
  it('uses adult categories when birth date is missing', () => {
    const info = classifyBmiValue(22);
    expect(info.classification).toBe('adult');
    expect(info.category).toBe('normal');
  });

  it('returns unclassified for weigh-ins before birth date', () => {
    const info = classifyBmiValue(22, {
      birthDate: '2000-06-15',
      date: '1999-12-31',
      sex: 'male',
    });
    expect(info.classification).toBe('unclassified');
    expect(info.category).toBe('unclassified');
  });

  it('classifies obese adult BMI', () => {
    const info = classifyBmiValue(31, {
      birthDate: '1990-01-01',
      date: '2024-01-01',
      sex: 'male',
    });
    expect(info.category).toBe('obese');
  });
});

describe('calculateBmi', () => {
  it('returns null for invalid measurements', () => {
    expect(calculateBmi(0, 180)).toBeNull();
    expect(calculateBmi(80, 0)).toBeNull();
  });

  it('computes BMI from weight and height', () => {
    const info = calculateBmi(80, 180, {
      birthDate: '1990-01-01',
      date: '2024-01-01',
      sex: 'male',
    });
    expect(info?.value).toBe(24.7);
  });
});
