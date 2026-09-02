import { calculateBmi } from './bmi';
import { filterEntriesByRange } from './stats';
import { DateRange, HeightEntry, WeightEntry } from './types';

/** @deprecated Legacy fixed-height sentinel; may exist in older data. */
export const FIXED_HEIGHT_EFFECTIVE_DATE = '1970-01-01';

export type BmiStats = {
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
  totalCount: number;
  minDate: string | null;
  maxDate: string | null;
};

export function getSortedHeightEntries(heightEntries: HeightEntry[]): HeightEntry[] {
  return [...heightEntries].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
}

export function getHeightAtDate(heightEntries: HeightEntry[], date: string): number | null {
  let best: HeightEntry | null = null;

  for (const entry of heightEntries) {
    if (entry.effectiveDate <= date) {
      if (!best || entry.effectiveDate > best.effectiveDate) {
        best = entry;
      }
    }
  }

  return best?.heightCm ?? null;
}

export function hasAnyHeight(heightEntries: HeightEntry[]): boolean {
  return heightEntries.length > 0;
}

export function getRecentHeightEntries(heightEntries: HeightEntry[], limit: number): HeightEntry[] {
  const sorted = getSortedHeightEntries(heightEntries);
  if (sorted.length <= limit) {
    return sorted;
  }

  return [...sorted]
    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))
    .slice(0, limit)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
}

export function getCurrentHeight(heightEntries: HeightEntry[]): number | null {
  if (heightEntries.length === 0) {
    return null;
  }

  const sorted = [...heightEntries].sort((a, b) =>
    b.effectiveDate.localeCompare(a.effectiveDate),
  );
  return sorted[0].heightCm;
}

export function getBmiStatsForRange(
  weightEntries: WeightEntry[],
  heightEntries: HeightEntry[],
  range: DateRange,
): BmiStats {
  const filtered = filterEntriesByRange(weightEntries, range);
  const values: { date: string; value: number }[] = [];

  for (const entry of filtered) {
    const heightCm = getHeightAtDate(heightEntries, entry.date);
    if (heightCm === null) {
      continue;
    }

    const bmi = calculateBmi(entry.weightKg, heightCm);
    if (bmi) {
      values.push({ date: entry.date, value: bmi.value });
    }
  }

  if (values.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
      count: 0,
      totalCount: filtered.length,
      minDate: null,
      maxDate: null,
    };
  }

  const total = values.reduce((sum, item) => sum + item.value, 0);
  const min = Math.min(...values.map((item) => item.value));
  const max = Math.max(...values.map((item) => item.value));
  const earliestDate = (value: number) =>
    values
      .filter((item) => item.value === value)
      .sort((a, b) => a.date.localeCompare(b.date))[0].date;

  return {
    average: Math.round((total / values.length) * 10) / 10,
    min,
    max,
    count: values.length,
    totalCount: filtered.length,
    minDate: earliestDate(min),
    maxDate: earliestDate(max),
  };
}
