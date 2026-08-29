import { calculateBmi } from './bmi';
import { filterEntriesByRange } from './stats';
import { DateRange, HeightEntry, WeightEntry } from './types';

export type BmiStats = {
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
};

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
  const values: number[] = [];

  for (const entry of filtered) {
    const heightCm = getHeightAtDate(heightEntries, entry.date);
    if (heightCm === null) {
      continue;
    }

    const bmi = calculateBmi(entry.weightKg, heightCm);
    if (bmi) {
      values.push(bmi.value);
    }
  }

  if (values.length === 0) {
    return { average: null, min: null, max: null, count: 0 };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    average: Math.round((total / values.length) * 10) / 10,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
  };
}
