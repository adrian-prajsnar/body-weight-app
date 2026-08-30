import { Text, View } from 'react-native';
import { BmiInfo, getBmiTheme } from '../bmi';
import { useAppStyles } from '../theme/styles';
import { useTheme } from '../theme/theme-context';

type BmiBadgeProps = {
  bmi: BmiInfo;
  compact?: boolean;
};

export function BmiBadge({ bmi, compact = false }: BmiBadgeProps) {
  const styles = useAppStyles();
  const { scheme } = useTheme();
  const badgeTheme = getBmiTheme(bmi.category, scheme);

  return (
    <View
      style={[
        styles.bmiBadge,
        compact && styles.bmiBadgeCompact,
        { backgroundColor: badgeTheme.backgroundColor },
      ]}
    >
      <Text
        style={[
          styles.bmiBadgeText,
          compact && styles.bmiBadgeTextCompact,
          { color: badgeTheme.textColor },
        ]}
      >
        BMI {bmi.value.toFixed(1)} · {bmi.label}
      </Text>
    </View>
  );
}
