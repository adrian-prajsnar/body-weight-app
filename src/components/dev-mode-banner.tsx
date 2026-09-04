import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEV_BANNER_BODY_HEIGHT } from '../dev-layout';
import { useTranslation } from '../i18n/language-context';
import { useColors } from '../theme/theme-context';
import { fontFamily, spacing } from '../theme/tokens';

export function DevModeBanner() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { t } = useTranslation();

  if (!__DEV__) {
    return null;
  }
  return (
    <View
      style={{
        paddingTop: insets.top,
        minHeight: insets.top + DEV_BANNER_BODY_HEIGHT,
        paddingBottom: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.warning,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
      }}
    >
      <Ionicons name="warning" size={16} color={colors.onAccent} />
      <Text
        style={{
          fontSize: 13,
          lineHeight: 18,
          fontFamily: fontFamily.bold,
          color: colors.onAccent,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {t('dev.modeBanner')}
      </Text>
    </View>
  );
}
