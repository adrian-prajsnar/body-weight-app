import { Text, View } from 'react-native';
import { formatDateRange, formatWeightValue, getWeightUnitLabel } from '../format';
import { useUnits } from '../context/unit-context';
import { useTranslation } from '../i18n/language-context';
import { DateRange, WeightEntry, WeightStats } from '../types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { AppCard } from './app-card';
import { StatsSummary } from './stats-summary';

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
}: ComparisonResultProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { units } = useUnits();
  const weightUnit = getWeightUnitLabel(units);

  const differenceColor =
    difference === null || Math.abs(difference) < 0.005
      ? colors.text
      : difference < 0
        ? colors.successText
        : colors.warningText;

  return (
    <>
      <AppCard title={labelA} subtitle={formatDateRange(rangeA)} isBusy={isBusy}>
        <StatsSummary stats={statsA} entries={entries} range={rangeA} />
      </AppCard>

      <AppCard isBusy={isBusy} delay={60}>
        <View style={styles.comparisonDeltaBlock}>
          <Text style={styles.sectionLabel}>{t('comparison.difference')}</Text>
          <Text style={[styles.differenceValue, { color: differenceColor }]}>
            {difference === null
              ? t('common.emDash')
              : `${difference > 0 ? '+' : ''}${formatWeightValue(difference, units)} ${weightUnit}`}
          </Text>
          <Text style={styles.cardSubtitle}>{t('comparison.differenceNote')}</Text>
        </View>
      </AppCard>

      <AppCard title={labelB} subtitle={formatDateRange(rangeB)} isBusy={isBusy} delay={120}>
        <StatsSummary stats={statsB} entries={entries} range={rangeB} />
      </AppCard>
    </>
  );
}
