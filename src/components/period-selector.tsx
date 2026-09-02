import { useMemo } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { useTranslation } from '../i18n/language-context';
import { DashboardPeriod } from '../types';
import { useAppStyles } from '../theme/styles';

const BASE_PERIODS: DashboardPeriod[] = [
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
  thisAgeYear: 'periods.thisAgeYear',
};

type PeriodSelectorProps = {
  selected: DashboardPeriod;
  onSelect: (period: DashboardPeriod) => void;
  showAgeYear?: boolean;
};

export function PeriodSelector({
  selected,
  onSelect,
  showAgeYear = false,
}: PeriodSelectorProps) {
  const styles = useAppStyles();
  const { t, locale } = useTranslation();

  const options = useMemo(() => {
    const values = showAgeYear ? [...BASE_PERIODS, 'thisAgeYear' as const] : BASE_PERIODS;
    return values.map((value) => ({
      value,
      label: t(PERIOD_KEYS[value]),
    }));
  }, [showAgeYear, t, locale]);

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
