import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatDateLabel, formatKg } from '../format';
import { getHeightAtDate } from '../height';
import { getChartSeries, getLatestChange } from '../stats';
import { useAppStyles } from '../theme/styles';
import { ChartRange, WeightEntry } from '../types';
import { AppCard } from './app-card';
import { BmiBadge } from './bmi-badge';
import { DeltaChip } from './delta-chip';
import { EmptyState } from './empty-state';
import { SegmentedControl, SegmentedOption } from './segmented-control';
import { SkeletonBlock } from './skeleton';
import { WeightChart } from './weight-chart';

const RANGE_OPTIONS: SegmentedOption<ChartRange>[] = [
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
];

type HeroWeightCardProps = {
  entries: WeightEntry[];
  isLoading: boolean;
  isBusy?: boolean;
};

export function HeroWeightCard({ entries, isLoading, isBusy = false }: HeroWeightCardProps) {
  const styles = useAppStyles();
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const [range, setRange] = useState<ChartRange>('30d');

  const { latest, change } = useMemo(() => getLatestChange(entries), [entries]);
  const series = useMemo(() => getChartSeries(entries, range), [entries, range]);

  const bmi = useMemo(() => {
    if (!showBmi || !latest) {
      return null;
    }
    const heightCm = getHeightAtDate(heightEntries, latest.date);
    return heightCm === null ? null : calculateBmi(latest.weightKg, heightCm);
  }, [heightEntries, latest, showBmi]);

  if (isLoading) {
    return (
      <AppCard elevated isBusy={isBusy}>
        <SkeletonBlock height={12} width="35%" />
        <SkeletonBlock height={48} width="60%" />
        <SkeletonBlock height={40} width="100%" />
        <SkeletonBlock height={140} width="100%" />
      </AppCard>
    );
  }

  return (
    <AppCard elevated isBusy={isBusy}>
      <Text style={styles.heroLabel}>Current weight</Text>

      {latest ? (
        <>
          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{formatKg(latest.weightKg)}</Text>
            <Text style={styles.heroUnit}>kg</Text>
          </View>
          <View style={styles.heroMetaRow}>
            <DeltaChip value={change} />
            {bmi ? <BmiBadge bmi={bmi} compact /> : null}
          </View>
          <Text style={styles.cardSubtitle}>Logged {formatDateLabel(latest.date)}</Text>
        </>
      ) : (
        <EmptyState
          icon="scale-outline"
          title="No weight logged yet"
          message="Add your first entry below to see your trend here."
        />
      )}

      {latest ? (
        <>
          <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />
          <WeightChart series={series} />
        </>
      ) : null}
    </AppCard>
  );
}
