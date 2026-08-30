import { useMemo } from 'react';
import { View } from 'react-native';
import { bmiInfoFromValue } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatKg } from '../format';
import { getBmiStatsForRange } from '../height';
import { useTranslation } from '../i18n/language-context';
import { DateRange, WeightEntry, WeightStats } from '../types';
import { useAppStyles } from '../theme/styles';
import { BmiBadge } from './bmi-badge';
import { StatTile } from './stat-tile';

type StatsSummaryProps = {
  stats: WeightStats;
  entries: WeightEntry[];
  range: DateRange;
};

function formatValue(value: number | null, emDash: string): string {
  return value === null ? emDash : formatKg(value);
}

export function StatsSummary({ stats, entries, range }: StatsSummaryProps) {
  const styles = useAppStyles();
  const { t } = useTranslation();
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const bmiStats = useMemo(
    () => getBmiStatsForRange(entries, heightEntries, range),
    [entries, heightEntries, range],
  );

  const emDash = t('common.emDash');

  const bmiBadge = (value: number | null) =>
    showBmi && value !== null ? <BmiBadge bmi={bmiInfoFromValue(value)} compact /> : null;

  return (
    <View style={styles.statGrid}>
      <StatTile
        label={t('stats.average')}
        value={formatValue(stats.average, emDash)}
        unit={stats.average === null ? undefined : t('common.kg')}
        badge={bmiBadge(bmiStats.average)}
      />
      <StatTile
        label={t('stats.lowest')}
        value={formatValue(stats.min, emDash)}
        unit={stats.min === null ? undefined : t('common.kg')}
        badge={bmiBadge(bmiStats.min)}
      />
      <StatTile
        label={t('stats.highest')}
        value={formatValue(stats.max, emDash)}
        unit={stats.max === null ? undefined : t('common.kg')}
        badge={bmiBadge(bmiStats.max)}
      />
      <StatTile label={t('stats.entries')} value={String(stats.count)} />
    </View>
  );
}
