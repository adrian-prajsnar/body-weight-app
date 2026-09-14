import {
  birthdayKeysDescending,
  formatAge,
  formatAgeDetailed,
  getAgeOnDate,
  getLastBirthdayKey,
  getPreviousAgeYearRange,
  getThisAgeYearRange,
  isNearBirthday,
} from './age';
import { fromDateKey } from './format';
import { getStatsForRange } from './stats';
import { WeightEntry } from './types';

export const BIRTHDAY_WINDOW_DAYS = 14;

function daysBetween(a: string, b: string): number {
  return Math.round((fromDateKey(a).getTime() - fromDateKey(b).getTime()) / (24 * 60 * 60 * 1000));
}

export function nearestEntryWithinDays(
  entries: WeightEntry[],
  dateKey: string,
  windowDays: number,
): WeightEntry | null {
  let best: WeightEntry | null = null;
  let bestAbs = Infinity;

  for (const entry of entries) {
    const abs = Math.abs(daysBetween(entry.date, dateKey));
    if (abs > windowDays) {
      continue;
    }
    if (abs < bestAbs || (abs === bestAbs && best !== null && entry.date > best.date)) {
      best = entry;
      bestAbs = abs;
    }
  }

  return best;
}

export type InsightWeighIn = {
  entry: WeightEntry;
  ageLabel: string;
};

export type WeightExtremes = {
  latest: InsightWeighIn;
  heaviest: InsightWeighIn | null;
  lightest: InsightWeighIn | null;
};

export function getWeightExtremes(
  entries: WeightEntry[],
  birthDate: string,
): WeightExtremes | null {
  if (entries.length === 0) {
    return null;
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const withAge = (entry: WeightEntry): InsightWeighIn => ({
    entry,
    ageLabel: formatAge(getAgeOnDate(birthDate, entry.date)),
  });
  const withDetailedAge = (entry: WeightEntry): InsightWeighIn => ({
    entry,
    ageLabel: formatAgeDetailed(getAgeOnDate(birthDate, entry.date)),
  });

  if (sorted.length === 1) {
    return { latest: withAge(latest), heaviest: null, lightest: null };
  }

  let heaviest = latest;
  let lightest = latest;
  for (const entry of sorted) {
    if (entry.weightKg > heaviest.weightKg) {
      heaviest = entry;
    } else if (entry.weightKg === heaviest.weightKg && entry.date > heaviest.date) {
      heaviest = entry;
    }
    if (entry.weightKg < lightest.weightKg) {
      lightest = entry;
    } else if (entry.weightKg === lightest.weightKg && entry.date > lightest.date) {
      lightest = entry;
    }
  }

  return {
    latest: withAge(latest),
    heaviest: withDetailedAge(heaviest),
    lightest: withDetailedAge(lightest),
  };
}

export type BirthdayWeightChange = {
  birthday: InsightWeighIn;
  latest: InsightWeighIn;
  changeKg: number;
};

export function getChangeSinceLastBirthday(
  entries: WeightEntry[],
  birthDate: string,
  todayInput?: Date,
): BirthdayWeightChange | null {
  if (entries.length === 0) {
    return null;
  }

  const lastBirthday = getLastBirthdayKey(birthDate, todayInput);
  const birthdayEntry = nearestEntryWithinDays(entries, lastBirthday, BIRTHDAY_WINDOW_DAYS);
  if (!birthdayEntry) {
    return null;
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  if (latest.date === birthdayEntry.date) {
    return null;
  }

  return {
    birthday: {
      entry: birthdayEntry,
      ageLabel: formatAge(getAgeOnDate(birthDate, birthdayEntry.date)),
    },
    latest: {
      entry: latest,
      ageLabel: formatAge(getAgeOnDate(birthDate, latest.date)),
    },
    changeKg: Math.round((latest.weightKg - birthdayEntry.weightKg) * 100) / 100,
  };
}

export type BirthdayWeighIn = {
  birthdayKey: string;
  entry: WeightEntry;
  ageLabel: string;
};

export function getBirthdayWeighIns(
  entries: WeightEntry[],
  birthDate: string,
  todayInput?: Date,
  limit = 6,
): BirthdayWeighIn[] {
  const keys = birthdayKeysDescending(birthDate, todayInput, limit);
  const results: BirthdayWeighIn[] = [];

  for (const birthdayKey of keys) {
    const entry = nearestEntryWithinDays(entries, birthdayKey, BIRTHDAY_WINDOW_DAYS);
    if (!entry) {
      continue;
    }
    results.push({
      birthdayKey,
      entry,
      ageLabel: formatAge(getAgeOnDate(birthDate, birthdayKey)),
    });
  }

  return results;
}

export type BirthdayRecap = {
  thisAverage: number;
  previousAverage: number;
  difference: number;
};

export function getBirthdayRecap(
  entries: WeightEntry[],
  birthDate: string,
  todayInput?: Date,
): BirthdayRecap | null {
  if (!isNearBirthday(birthDate, BIRTHDAY_WINDOW_DAYS, todayInput)) {
    return null;
  }

  const thisRange = getThisAgeYearRange(birthDate, todayInput);
  const previousRange = getPreviousAgeYearRange(birthDate, todayInput);
  const thisStats = getStatsForRange(entries, thisRange);
  const previousStats = getStatsForRange(entries, previousRange);

  if (thisStats.average === null || previousStats.average === null) {
    return null;
  }

  return {
    thisAverage: thisStats.average,
    previousAverage: previousStats.average,
    difference: Math.round((thisStats.average - previousStats.average) * 100) / 100,
  };
}
