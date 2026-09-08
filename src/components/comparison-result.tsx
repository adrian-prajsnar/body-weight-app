import { useMemo } from 'react';
import { formatDateRange } from '../format';
import { DateRange, TrendRow, WeightEntry, WeightStats } from '../types';
import { AppCard } from './app-card';
import { ComparisonTrendRows } from './comparison-trend-rows';

type ComparisonResultProps = {
  labelA: string;
  labelB: string;
  rangeA: DateRange;
  rangeB: DateRange;
  statsA: WeightStats;
  statsB: WeightStats;
  entries: WeightEntry[];
  difference: number | null;
  isBusy?: boolean;
  embedded?: boolean;
  isDayMode?: boolean;
};

export function ComparisonResult({
  labelA,
  labelB,
  rangeA,
  rangeB,
  statsA,
  statsB,
  entries,
  difference,
  isBusy = false,
  embedded = false,
  isDayMode = false,
}: ComparisonResultProps) {
  const entryByDate = useMemo(
    () => new Map(entries.map((entry) => [entry.date, entry])),
    [entries],
  );

  const rows: TrendRow[] = [
    {
      key: 'range-a',
      title: labelA,
      subtitle: isDayMode ? undefined : formatDateRange(rangeA),
      range: rangeA,
      stats: statsA,
      entry: isDayMode ? (entryByDate.get(rangeA.start) ?? null) : undefined,
      deltaToOlder: difference,
    },
    {
      key: 'range-b',
      title: labelB,
      subtitle: isDayMode ? undefined : formatDateRange(rangeB),
      range: rangeB,
      stats: statsB,
      entry: isDayMode ? (entryByDate.get(rangeB.start) ?? null) : undefined,
      deltaToOlder: null,
    },
  ];

  const body = <ComparisonTrendRows rows={rows} entries={entries} isDayMode={isDayMode} />;

  if (embedded) {
    return body;
  }

  return (
    <AppCard isBusy={isBusy}>
      {body}
    </AppCard>
  );
}
