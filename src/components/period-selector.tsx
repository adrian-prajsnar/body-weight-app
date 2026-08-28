import { Pressable, Text, View } from 'react-native';
import { DashboardPeriod } from '../types';
import { styles } from '../theme/styles';

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
  return (
    <View style={styles.presetRow}>
      {PERIOD_OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.presetButton,
            selected === option.value && styles.presetButtonActive,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.presetButtonText,
              selected === option.value && styles.presetButtonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
