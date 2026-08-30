import { Pressable, ScrollView, Text } from 'react-native';
import { DashboardPeriod } from '../types';
import { useAppStyles } from '../theme/styles';

const PERIOD_OPTIONS: { label: string; value: DashboardPeriod }[] = [
  { label: 'This week', value: 'thisWeek' },
  { label: 'Last week', value: 'lastWeek' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'Last 6 months', value: 'last6Months' },
  { label: 'Last year', value: 'lastYear' },
];

type PeriodSelectorProps = {
  selected: DashboardPeriod;
  onSelect: (period: DashboardPeriod) => void;
};

export function PeriodSelector({ selected, onSelect }: PeriodSelectorProps) {
  const styles = useAppStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.presetScroll}
      contentContainerStyle={styles.presetScrollContent}
    >
      {PERIOD_OPTIONS.map((option) => {
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
