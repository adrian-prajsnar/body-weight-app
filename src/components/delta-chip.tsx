import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatKg } from '../format';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type DeltaChipProps = {
  /** Signed change in kg. `null` renders nothing. */
  value: number | null;
  suffix?: string;
};

export function DeltaChip({ value, suffix }: DeltaChipProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();

  if (value === null) {
    return null;
  }

  const isFlat = Math.abs(value) < 0.05;
  const isDown = value < 0;

  const tint = isFlat
    ? { background: colors.surfaceMuted, text: colors.textMuted }
    : isDown
      ? { background: colors.successSoft, text: colors.successText }
      : { background: colors.warningSoft, text: colors.warningText };

  const icon = isFlat ? 'remove' : isDown ? 'arrow-down' : 'arrow-up';
  const sign = isFlat ? '' : isDown ? '−' : '+';

  return (
    <View style={[styles.deltaChip, { backgroundColor: tint.background }]}>
      <Ionicons name={icon} size={13} color={tint.text} />
      <Text style={[styles.deltaChipText, { color: tint.text }]}>
        {sign}
        {formatKg(Math.abs(value))} {t('common.kg')}
        {suffix ? ` ${suffix}` : ''}
      </Text>
    </View>
  );
}
