export type WeightEntry = {
  date: string;
  weightKg: number;
};

export type WeightStats = {
  average: number | null;
  min: number | null;
  max: number | null;
  count: number;
};

export type DashboardPeriod =
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last6Months'
  | 'lastYear';

export type DateRange = {
  start: string;
  end: string;
};

export type ComparisonMode = 'week' | 'month' | 'year' | 'custom';

export type ChartRange = '30d' | '90d' | '1y';

export type WeightSeries = {
  /** Entries inside the window, ascending by date. */
  points: WeightEntry[];
  min: number;
  max: number;
};

export type EntryGroup = {
  /** `YYYY-MM` key the group covers. */
  monthKey: string;
  entries: WeightEntry[];
};

export type LatestChange = {
  latest: WeightEntry | null;
  /** Signed difference against the previous entry, or null when there is none. */
  change: number | null;
};

export type PeriodComparison = {
  labelA: string;
  labelB: string;
  rangeA: DateRange;
  rangeB: DateRange;
  statsA: WeightStats;
  statsB: WeightStats;
  difference: number | null;
};

export type UserProfile = {
  heightEntries: HeightEntry[];
};

export type HeightEntry = {
  effectiveDate: string;
  heightCm: number;
};
