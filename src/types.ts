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

export type PeriodComparison = {
  labelA: string;
  labelB: string;
  rangeA: DateRange;
  rangeB: DateRange;
  statsA: WeightStats;
  statsB: WeightStats;
  difference: number | null;
};
