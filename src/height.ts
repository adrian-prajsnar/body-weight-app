import { calculateBmi } from './bmi';
import { filterEntriesByRange } from './stats';
import { DateRange, HeightEntry, WeightEntry } from './types';

/** Effective date for a single height that applies to all weight entry dates. */
export const FIXED_HEIGHT_EFFECTIVE_DATE = '1970-01-01';

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

export function hasAnyHeight(heightEntries: HeightEntry[]): boolean {
  return heightEntries.length > 0;
}

export function canLogWeightAtDate(heightEntries: HeightEntry[], date: string): boolean {
  return getHeightAtDate(heightEntries, date) !== null;
}

export function usesHeightTimeline(heightEntries: HeightEntry[]): boolean {
  if (heightEntries.length === 0) {
    return false;
  }
  if (heightEntries.length > 1) {
    return true;
  }
  return heightEntries[0].effectiveDate !== FIXED_HEIGHT_EFFECTIVE_DATE;
}

export function getTimelineHeightEntries(heightEntries: HeightEntry[]): HeightEntry[] {
  return heightEntries
    .filter((entry) => entry.effectiveDate !== FIXED_HEIGHT_EFFECTIVE_DATE)
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
}

export function getRecentTimelineEntries(heightEntries: HeightEntry[], limit: number): HeightEntry[] {
  const timeline = getTimelineHeightEntries(heightEntries);
  if (timeline.length <= limit) {
    return timeline;
  }

  return [...timeline]
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
