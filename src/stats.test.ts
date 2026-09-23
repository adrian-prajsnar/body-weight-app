import { describe, expect, it } from 'vitest';
import {
  filterEntriesByRange,
  getComparison,
  getDashboardPeriodRange,
  getTrendRows,
} from './stats';
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
  {
    date: '2024-06-02',
    weightKg: 76.5,
    createdAt: '2024-06-02T08:00:00.000Z',
    updatedAt: '2024-06-02T08:00:00.000Z',
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

  it('uses this week from Monday through today', () => {
    const today = new Date(2024, 8, 18);
    expect(getDashboardPeriodRange('thisWeek', today)).toEqual({
      start: '2024-09-16',
      end: '2024-09-18',
    });
  });
});

describe('filterEntriesByRange', () => {
  it('includes entries on both range boundaries', () => {
    const filtered = filterEntriesByRange(entries, {
      start: '2024-01-01',
      end: '2024-12-31',
    });
    expect(filtered.map((entry) => entry.date)).toEqual([
      '2024-01-15',
      '2024-06-01',
      '2024-06-02',
    ]);
  });
});

describe('getTrendRows', () => {
  it('builds daily rows with per-day weights and deltas', () => {
    const rows = getTrendRows(
      entries,
      'day',
      { start: '2024-06-01', end: '2024-06-02' },
    );

    expect(rows).toHaveLength(2);
    expect(rows[0].stats.average).toBe(76.5);
    expect(rows[0].deltaToOlder).toBe(-0.5);
  });
});

describe('getComparison', () => {
  it('compares custom period averages', () => {
    const result = getComparison(
      entries,
      'custom',
      {
        rangeA: { start: '2024-06-01', end: '2024-06-02' },
        rangeB: { start: '2024-01-15', end: '2024-01-15' },
      },
    );

    expect(result?.statsA.average).toBe(76.75);
    expect(result?.statsB.average).toBe(78);
    expect(result?.difference).toBe(-1.25);
  });

  it('returns null for invalid custom ranges', () => {
    expect(
      getComparison(entries, 'custom', {
        rangeA: { start: '2024-06-02', end: '2024-06-01' },
        rangeB: { start: '2024-01-15', end: '2024-01-15' },
      }),
    ).toBeNull();
  });
});
