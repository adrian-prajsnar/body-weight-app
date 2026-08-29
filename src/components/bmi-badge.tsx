import { Text, View } from 'react-native';
import { BmiInfo, getBmiTheme } from '../bmi';
import { styles } from '../theme/styles';

type BmiBadgeProps = {
  bmi: BmiInfo;
  compact?: boolean;
};

export function BmiBadge({ bmi, compact = false }: BmiBadgeProps) {
  const theme = getBmiTheme(bmi.category);

  return (
    <View style={[styles.bmiBadge, compact && styles.bmiBadgeCompact, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.bmiBadgeText, compact && styles.bmiBadgeTextCompact, { color: theme.textColor }]}>
        BMI {bmi.value.toFixed(1)} · {bmi.label}
      </Text>
    </View>
  );
}
