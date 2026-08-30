import {
  addDays,
  fromDateKey,
  getMondayWeekStart,
  getTodayDate,
  toDateKey,
} from './format';
import { t } from './i18n';
import {
  ChartRange,
  ComparisonMode,
  DashboardPeriod,
  DateRange,
  EntryGroup,
  LatestChange,
  PeriodComparison,
  WeightEntry,
  WeightSeries,
  WeightStats,
} from './types';

const CHART_RANGE_DAYS: Record<ChartRange, number> = {
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

function normalizeToday(today?: Date): Date {
  const date = today ? new Date(today) : getTodayDate();
  date.setHours(0, 0, 0, 0);
  return date;
}

function toRange(start: Date, end: Date): DateRange {
  return {
    start: toDateKey(start),
    end: toDateKey(end),
  };
}

export function getDashboardPeriodRange(
  period: DashboardPeriod,
  todayInput?: Date,
): DateRange {
  const today = normalizeToday(todayInput);

  switch (period) {
    case 'thisWeek': {
      const start = getMondayWeekStart(today);
      return toRange(start, today);
    }
    case 'lastWeek': {
      const thisWeekStart = getMondayWeekStart(today);
      const start = addDays(thisWeekStart, -7);
      const end = addDays(thisWeekStart, -1);
      return toRange(start, end);
    }
    case 'thisMonth': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return toRange(start, today);
    }
    case 'lastMonth': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return toRange(start, end);
    }
    case 'last6Months': {
      const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      return toRange(start, today);
    }
    case 'lastYear': {
      const start = addDays(today, -364);
      return toRange(start, today);
    }
  }
}

export function filterEntriesByRange(
  entries: WeightEntry[],
  range: DateRange,
): WeightEntry[] {
  return entries.filter(
    (entry) => entry.date >= range.start && entry.date <= range.end,
  );
}

export function filterEntriesByBounds(
  entries: WeightEntry[],
  start: string | null,
  end: string | null,
): WeightEntry[] {
  return entries.filter((entry) => {
    if (start && entry.date < start) {
      return false;
    }
    if (end && entry.date > end) {
      return false;
    }
    return true;
  });
}

export function getStatsForRange(
  entries: WeightEntry[],
  range: DateRange,
): WeightStats {
  const filtered = filterEntriesByRange(entries, range);
  if (filtered.length === 0) {
    return { average: null, min: null, max: null, count: 0 };
  }

  const weights = filtered.map((entry) => entry.weightKg);
  const total = weights.reduce((sum, weight) => sum + weight, 0);

  return {
    average: Math.round((total / weights.length) * 100) / 100,
    min: Math.min(...weights),
    max: Math.max(...weights),
    count: weights.length,
  };
}

export function getLast7DaysEntries(entries: WeightEntry[]): WeightEntry[] {
  const today = getTodayDate();
  const start = addDays(today, -6);
  const range = toRange(start, today);
  return filterEntriesByRange(entries, range).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

function getYearComparisonRanges(todayInput?: Date): {
  rangeA: DateRange;
  rangeB: DateRange;
} {
  const today = normalizeToday(todayInput);
  const rangeAEnd = today;
  const rangeAStart = addDays(today, -364);
  const rangeBEnd = addDays(rangeAStart, -1);
  const rangeBStart = addDays(rangeBEnd, -364);
  return {
    rangeA: toRange(rangeAStart, rangeAEnd),
    rangeB: toRange(rangeBStart, rangeBEnd),
  };
}

export function getComparison(
  entries: WeightEntry[],
  mode: ComparisonMode,
  customRanges?: { rangeA: DateRange; rangeB: DateRange },
): PeriodComparison | null {
  let rangeA: DateRange;
  let rangeB: DateRange;
  let labelA: string;
  let labelB: string;

  switch (mode) {
    case 'week':
      rangeA = getDashboardPeriodRange('thisWeek');
      rangeB = getDashboardPeriodRange('lastWeek');
      labelA = t('periods.thisWeek');
      labelB = t('periods.lastWeek');
      break;
    case 'month':
      rangeA = getDashboardPeriodRange('thisMonth');
      rangeB = getDashboardPeriodRange('lastMonth');
      labelA = t('periods.thisMonth');
      labelB = t('periods.lastMonth');
      break;
    case 'year': {
      const ranges = getYearComparisonRanges();
      rangeA = ranges.rangeA;
      rangeB = ranges.rangeB;
      labelA = t('periods.last365Days');
      labelB = t('periods.previous365Days');
      break;
    }
    case 'custom':
      if (!customRanges) {
        return null;
      }
      if (customRanges.rangeA.start > customRanges.rangeA.end) {
        return null;
      }
      if (customRanges.rangeB.start > customRanges.rangeB.end) {
        return null;
      }
      rangeA = customRanges.rangeA;
      rangeB = customRanges.rangeB;
      labelA = t('periods.rangeA');
      labelB = t('periods.rangeB');
      break;
  }

  const statsA = getStatsForRange(entries, rangeA);
  const statsB = getStatsForRange(entries, rangeB);
  const difference =
    statsA.average !== null && statsB.average !== null
      ? Math.round((statsA.average - statsB.average) * 100) / 100
      : null;

  return {
    labelA,
    labelB,
    rangeA,
    rangeB,
    statsA,
    statsB,
    difference,
  };
}

export function dateKeyToDate(dateKey: string): Date {
  return fromDateKey(dateKey);
}

export function groupEntriesByMonth(entries: WeightEntry[]): EntryGroup[] {
  const groups: EntryGroup[] = [];

  for (const entry of entries) {
    const monthKey = entry.date.slice(0, 7);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.monthKey === monthKey) {
      lastGroup.entries.push(entry);
      continue;
    }
    groups.push({ monthKey, entries: [entry] });
  }

  return groups;
}

export function getChartSeries(entries: WeightEntry[], range: ChartRange): WeightSeries {
  const today = getTodayDate();
  const start = addDays(today, -(CHART_RANGE_DAYS[range] - 1));
  const points = filterEntriesByRange(entries, toRange(start, today)).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  if (points.length === 0) {
    return { points, min: 0, max: 0 };
  }

  const weights = points.map((entry) => entry.weightKg);
  return {
    points,
    min: Math.min(...weights),
    max: Math.max(...weights),
  };
}

export function getLatestChange(entries: WeightEntry[]): LatestChange {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0] ?? null;
  const previous = sorted[1] ?? null;

  if (!latest || !previous) {
    return { latest, change: null };
  }

  return {
    latest,
    change: Math.round((latest.weightKg - previous.weightKg) * 100) / 100,
  };
}
