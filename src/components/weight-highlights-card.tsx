import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useUnits } from '../context/unit-context';
import { formatDateLabel, formatWeightDifference, formatWeightValue, getWeightUnitLabel } from '../format';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { WeightEntry } from '../types';
import {
  getBirthdayRecap,
  getBirthdayWeighIns,
  getChangeSinceLastBirthday,
  getWeightExtremes,
} from '../weight-insights';
import { AppCard } from './app-card';

type WeightHighlightsCardProps = {
  entries: WeightEntry[];
  birthDate: string;
  isBusy?: boolean;
};

function InsightRow({
  label,
  value,
  meta,
}: {
  label: string;
  value: string;
  meta: string;
}) {
  const styles = useAppStyles();

  return (
    <View style={styles.insightRow}>
      <Text style={styles.statTileLabel}>{label}</Text>
      <View style={styles.insightRowHeader}>
        <Text style={styles.insightValue}>{value}</Text>
      </View>
      <Text style={styles.insightMeta}>{meta}</Text>
    </View>
  );
}

export function WeightHighlightsCard({
  entries,
  birthDate,
  isBusy = false,
}: WeightHighlightsCardProps) {
  const styles = useAppStyles();
  const { t } = useTranslation();
  const { units } = useUnits();
  const weightUnit = getWeightUnitLabel(units);

  const extremes = useMemo(() => getWeightExtremes(entries, birthDate), [entries, birthDate]);
  const sinceBirthday = useMemo(
    () => getChangeSinceLastBirthday(entries, birthDate),
    [entries, birthDate],
  );
  const birthdayWeighIns = useMemo(
    () => getBirthdayWeighIns(entries, birthDate),
    [entries, birthDate],
  );
  const recap = useMemo(() => getBirthdayRecap(entries, birthDate), [entries, birthDate]);

  if (!extremes) {
    return null;
  }

  const formatWeighIn = (weightKg: number) =>
    `${formatWeightValue(weightKg, units)} ${weightUnit}`;
  const formatMeta = (date: string, ageLabel: string) =>
    t('dashboard.onDateAtAge', { date: formatDateLabel(date), age: ageLabel });

  return (
    <AppCard title={t('dashboard.highlights')} isBusy={isBusy} delay={40}>
      <View style={styles.insightList}>
        {extremes.heaviest ? (
          <InsightRow
            label={t('dashboard.heaviestAtAge')}
            value={formatWeighIn(extremes.heaviest.entry.weightKg)}
            meta={formatMeta(extremes.heaviest.entry.date, extremes.heaviest.ageLabel)}
          />
        ) : null}
        {extremes.lightest ? (
          <InsightRow
            label={t('dashboard.lightestAtAge')}
            value={formatWeighIn(extremes.lightest.entry.weightKg)}
            meta={formatMeta(extremes.lightest.entry.date, extremes.lightest.ageLabel)}
          />
        ) : null}
        {sinceBirthday ? (
          <InsightRow
            label={t('dashboard.sinceBirthday')}
            value={formatWeightDifference(sinceBirthday.changeKg, units)}
            meta={formatMeta(sinceBirthday.birthday.entry.date, sinceBirthday.birthday.ageLabel)}
          />
        ) : null}
        {recap ? (
          <InsightRow
            label={t('dashboard.birthdayRecap')}
            value={formatWeightDifference(recap.difference, units)}
            meta={t('dashboard.recapDifference')}
          />
        ) : null}
        {birthdayWeighIns.map((item) => (
          <InsightRow
            key={item.birthdayKey}
            label={t('dashboard.birthdayWeight', { age: item.ageLabel })}
            value={formatWeighIn(item.entry.weightKg)}
            meta={formatDateLabel(item.entry.date)}
          />
        ))}
      </View>
    </AppCard>
  );
}
