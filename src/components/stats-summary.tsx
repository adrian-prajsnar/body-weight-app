import { Text, View } from 'react-native';
import { formatKg } from '../format';
import { WeightStats } from '../types';
import { styles } from '../theme/styles';

type StatsSummaryProps = {
  stats: WeightStats;
};

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.statsValue}>
        Average: {stats.average === null ? '—' : `${formatKg(stats.average)} kg`}
      </Text>
      <Text style={styles.statsText}>
        Min: {stats.min === null ? '—' : `${formatKg(stats.min)} kg`} · Max:{' '}
        {stats.max === null ? '—' : `${formatKg(stats.max)} kg`} · Entries: {stats.count}
      </Text>
    </View>
  );
}
