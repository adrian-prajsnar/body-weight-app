import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { bmiInfoFromValue } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatKg } from '../format';
import { getBmiStatsForRange } from '../height';
import { DateRange, WeightEntry, WeightStats } from '../types';
import { styles } from '../theme/styles';
import { BmiBadge } from './bmi-badge';

type StatsSummaryProps = {
  stats: WeightStats;
  entries: WeightEntry[];
  range: DateRange;
};

function WeightStatLine({
  label,
  value,
  large = false,
}: {
  label: string;
  value: number | null;
  large?: boolean;
}) {
  return (
    <Text style={large ? styles.statsValue : styles.statsText}>
      {label}: {value === null ? '—' : `${formatKg(value)} kg`}
    </Text>
  );
}

function BmiStatLine({
  label,
  value,
  showBmi,
  large = false,
}: {
  label: string;
  value: number | null;
  showBmi: boolean;
  large?: boolean;
}) {
  if (!showBmi || value === null) {
    return null;
  }

  return (
    <View style={styles.statWithBmiRow}>
      <Text style={large ? styles.statsText : styles.statsText}>{label} BMI</Text>
      <BmiBadge bmi={bmiInfoFromValue(value)} compact={!large} />
    </View>
  );
}

export function StatsSummary({ stats, entries, range }: StatsSummaryProps) {
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const bmiStats = useMemo(
    () => getBmiStatsForRange(entries, heightEntries, range),
    [entries, heightEntries, range],
  );

  return (
    <View style={{ gap: 8 }}>
      <WeightStatLine label="Average" value={stats.average} large />
      <BmiStatLine label="Average" value={bmiStats.average} showBmi={showBmi} large />
      <WeightStatLine label="Min" value={stats.min} />
      <BmiStatLine label="Min" value={bmiStats.min} showBmi={showBmi} />
      <WeightStatLine label="Max" value={stats.max} />
      <BmiStatLine label="Max" value={bmiStats.max} showBmi={showBmi} />
      <Text style={styles.statsText}>Entries: {stats.count}</Text>
    </View>
  );
}
