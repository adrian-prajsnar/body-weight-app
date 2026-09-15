import { describe, expect, it } from 'vitest';
import { filterEntriesByRange, getDashboardPeriodRange } from './stats';
import { WeightEntry } from './types';

const entries: WeightEntry[] = [
  {
    date: '2023-06-01',
    weightKg: 80,
    createdAt: '2023-06-01T08:00:00.000Z',
    updatedAt: '2023-06-01T08:00:00.000Z',
  },
  {
    date: '2024-01-15',
    weightKg: 78,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    date: '2024-06-01',
    weightKg: 77,
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-06-01T08:00:00.000Z',
  },
];

describe('getDashboardPeriodRange', () => {
  it('uses the previous calendar year for lastYear', () => {
    const today = new Date(2024, 8, 14);
    expect(getDashboardPeriodRange('lastYear', today)).toEqual({
      start: '2023-01-01',
      end: '2023-12-31',
    });
  });
});

describe('filterEntriesByRange', () => {
  it('includes entries on both range boundaries', () => {
    const filtered = filterEntriesByRange(entries, {
      start: '2024-01-01',
      end: '2024-12-31',
    });
    expect(filtered.map((entry) => entry.date)).toEqual(['2024-01-15', '2024-06-01']);
  });
});
