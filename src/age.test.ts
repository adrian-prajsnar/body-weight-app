import { describe, expect, it } from 'vitest';
import { getAgeOnDate, getLastBirthdayKey, getThisAgeYearRange } from './age';

describe('getAgeOnDate', () => {
  it('returns null for dates before birth', () => {
    expect(getAgeOnDate('2000-06-15', '1999-01-01')).toBeNull();
  });

  it('returns zero age on birth date', () => {
    const age = getAgeOnDate('2000-06-15', '2000-06-15');
    expect(age).toEqual({ years: 0, months: 0, days: 0, ageMonths: 0 });
  });

  it('handles Feb 29 birthdays on non-leap years', () => {
    const age = getAgeOnDate('2000-02-29', '2023-03-01');
    expect(age?.years).toBe(23);
  });
});

describe('birthday helpers', () => {
  it('finds the latest birthday on or before today', () => {
    expect(getLastBirthdayKey('1990-05-10', new Date(2024, 8, 14))).toBe('2024-05-10');
  });

  it('builds the current age-year range from the last birthday', () => {
    const today = new Date(2024, 8, 14);
    expect(getThisAgeYearRange('1990-05-10', today)).toEqual({
      start: '2024-05-10',
      end: '2024-09-14',
    });
  });
});
