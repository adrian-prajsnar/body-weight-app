import { Text, View } from 'react-native';
import { BmiInfo, formatBmiValue, getBmiTheme } from '../bmi';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useTheme } from '../theme/theme-context';

type BmiBadgeProps = {
  bmi: BmiInfo;
  compact?: boolean;
};

export function BmiBadge({ bmi, compact = false }: BmiBadgeProps) {
  const styles = useAppStyles();
  const { scheme } = useTheme();
  const { t } = useTranslation();
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
        {t('bmi.label', { value: formatBmiValue(bmi.value), category: bmi.label })}
      </Text>
    </View>
  );
}
