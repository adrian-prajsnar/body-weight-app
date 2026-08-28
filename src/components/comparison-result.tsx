import { Text, View } from 'react-native';
import { formatDateRange } from '../format';
import { DateRange, WeightStats } from '../types';
import { styles } from '../theme/styles';
import { StatsSummary } from './stats-summary';

type ComparisonResultProps = {
  labelA: string;
  labelB: string;
  rangeA: DateRange;
  rangeB: DateRange;
  statsA: WeightStats;
  statsB: WeightStats;
  difference: number | null;
};

export function ComparisonResult({
  labelA,
  labelB,
  rangeA,
  rangeB,
  statsA,
  statsB,
  difference,
}: ComparisonResultProps) {
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.comparisonPeriodCard}>
        <Text style={styles.comparisonPeriodLabel}>{labelA}</Text>
        <Text style={styles.statsText}>{formatDateRange(rangeA)}</Text>
        <StatsSummary stats={statsA} />
      </View>

      <View style={styles.comparisonPeriodCard}>
        <Text style={styles.comparisonPeriodLabel}>{labelB}</Text>
        <Text style={styles.statsText}>{formatDateRange(rangeB)}</Text>
        <StatsSummary stats={statsB} />
      </View>

      <View>
        <Text style={styles.statsText}>Difference (A − B)</Text>
        <Text style={styles.differenceValue}>
          {difference === null
            ? '—'
            : `${difference > 0 ? '+' : ''}${difference.toFixed(2)} kg`}
        </Text>
      </View>
    </View>
  );
}
