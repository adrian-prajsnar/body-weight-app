import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { spacing } from '../theme/tokens';

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[colors.accentSoft, colors.background]}
        style={styles.authBackdrop}
        pointerEvents="none"
      />
      <View style={styles.authMain}>{children}</View>
      <View
        style={[
          styles.authBrandFooter,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <Text style={styles.authBrandFooterName}>{t('app.name')}</Text>
        <Text style={styles.authBrandFooterTagline}>{t('app.tagline')}</Text>
      </View>
    </View>
  );
}
