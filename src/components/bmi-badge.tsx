import { Pressable, Text } from 'react-native';
import { BmiInfo, formatBmiValue, getBmiTheme } from '../bmi';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useTheme } from '../theme/theme-context';

type BmiBadgeProps = {
  bmi: BmiInfo | null;
  compact?: boolean;
  onPress?: () => void;
};

export function BmiBadge({ bmi, compact = false, onPress }: BmiBadgeProps) {
  const styles = useAppStyles();
  const { scheme } = useTheme();
  const { t } = useTranslation();

  if (bmi === null) {
    return null;
  }

  const badgeTheme = getBmiTheme(bmi.category, scheme);
  const label = t('bmi.label', { value: formatBmiValue(bmi.value) });

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.bmiBadge,
        compact && styles.bmiBadgeCompact,
        { backgroundColor: badgeTheme.backgroundColor },
        pressed && onPress ? styles.buttonPressed : null,
      ]}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={onPress ? `${label}. ${t('bmi.openDetailsA11y')}` : label}
    >
      <Text
        style={[
          styles.bmiBadgeText,
          compact && styles.bmiBadgeTextCompact,
          { color: badgeTheme.textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
