import { useMemo } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { useTranslation } from '../i18n/language-context';
import { DashboardPeriod } from '../types';
import { useAppStyles } from '../theme/styles';

const PERIOD_VALUES: DashboardPeriod[] = [
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'lastMonth',
  'last6Months',
  'lastYear',
];

const PERIOD_KEYS: Record<DashboardPeriod, string> = {
  thisWeek: 'periods.thisWeek',
  lastWeek: 'periods.lastWeek',
  thisMonth: 'periods.thisMonth',
  lastMonth: 'periods.lastMonth',
  last6Months: 'periods.last6Months',
  lastYear: 'periods.lastYear',
};

type PeriodSelectorProps = {
  selected: DashboardPeriod;
  onSelect: (period: DashboardPeriod) => void;
};

export function PeriodSelector({ selected, onSelect }: PeriodSelectorProps) {
  const styles = useAppStyles();
  const { t, locale } = useTranslation();

  const options = useMemo(
    () =>
      PERIOD_VALUES.map((value) => ({
        value,
        label: t(PERIOD_KEYS[value]),
      })),
    [t, locale],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.presetScroll}
      contentContainerStyle={styles.presetScrollContent}
    >
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.presetButton,
              isActive && styles.presetButtonActive,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[styles.presetButtonText, isActive && styles.presetButtonTextActive]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
