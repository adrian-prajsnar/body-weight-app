import { describe, expect, it } from 'vitest';
import {
  getChangeSinceLastBirthday,
  getWeightExtremes,
  nearestEntryWithinDays,
} from './weight-insights';
import { WeightEntry } from './types';

const entries: WeightEntry[] = [
  {
    date: '2024-01-01',
    weightKg: 82,
    createdAt: '2024-01-01T08:00:00.000Z',
    updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    date: '2024-06-01',
    weightKg: 78,
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
  {
    date: '2024-09-01',
    weightKg: 80,
    createdAt: '2024-09-01T08:00:00.000Z',
    updatedAt: '2024-09-01T08:00:00.000Z',
  },
];

describe('getWeightExtremes', () => {
  it('finds latest, heaviest, and lightest entries', () => {
    const extremes = getWeightExtremes(entries, '1990-01-01');
    expect(extremes?.latest.entry.date).toBe('2024-09-01');
    expect(extremes?.heaviest?.entry.weightKg).toBe(82);
    expect(extremes?.lightest?.entry.weightKg).toBe(78);
  });

  it('returns null for empty history', () => {
    expect(getWeightExtremes([], '1990-01-01')).toBeNull();
  });
});

describe('nearestEntryWithinDays', () => {
  it('prefers the closest date within the window', () => {
    const match = nearestEntryWithinDays(entries, '2024-05-30', 7);
    expect(match?.date).toBe('2024-06-01');
  });
});

describe('getChangeSinceLastBirthday', () => {
  it('returns null when latest entry is the birthday weigh-in', () => {
    const birthdayOnly: WeightEntry[] = [
      {
        date: '2024-09-01',
        weightKg: 80,
        createdAt: '2024-09-01T08:00:00.000Z',
        updatedAt: '2024-09-01T08:00:00.000Z',
      },
    ];

    expect(getChangeSinceLastBirthday(birthdayOnly, '1990-09-01')).toBeNull();
  });
});
