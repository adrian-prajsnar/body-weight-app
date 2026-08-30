import { useMemo } from 'react';
import { View } from 'react-native';
import { bmiInfoFromValue } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatKg } from '../format';
import { getBmiStatsForRange } from '../height';
import { DateRange, WeightEntry, WeightStats } from '../types';
import { useAppStyles } from '../theme/styles';
import { BmiBadge } from './bmi-badge';
import { StatTile } from './stat-tile';

type StatsSummaryProps = {
  stats: WeightStats;
  entries: WeightEntry[];
  range: DateRange;
};

function formatValue(value: number | null): string {
  return value === null ? '—' : formatKg(value);
}

export function StatsSummary({ stats, entries, range }: StatsSummaryProps) {
  const styles = useAppStyles();
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const bmiStats = useMemo(
    () => getBmiStatsForRange(entries, heightEntries, range),
    [entries, heightEntries, range],
  );

  const bmiBadge = (value: number | null) =>
    showBmi && value !== null ? <BmiBadge bmi={bmiInfoFromValue(value)} compact /> : null;

  return (
    <View style={styles.statGrid}>
      <StatTile
        label="Average"
        value={formatValue(stats.average)}
        unit={stats.average === null ? undefined : 'kg'}
        badge={bmiBadge(bmiStats.average)}
      />
      <StatTile
        label="Lowest"
        value={formatValue(stats.min)}
        unit={stats.min === null ? undefined : 'kg'}
        badge={bmiBadge(bmiStats.min)}
      />
      <StatTile
        label="Highest"
        value={formatValue(stats.max)}
        unit={stats.max === null ? undefined : 'kg'}
        badge={bmiBadge(bmiStats.max)}
      />
      <StatTile label="Entries" value={String(stats.count)} />
    </View>
  );
}
