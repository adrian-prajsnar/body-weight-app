import { ActivityIndicator, Text, View } from 'react-native';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useTranslation } from '../i18n/language-context';
import { NewPasswordScreen } from '../screens/new-password-screen';
import { AuthNavigator } from './auth-navigator';
import { MainTabNavigator } from './main-tab-navigator';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function RootNavigator() {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { isAuthenticated, isPasswordRecovery, isLoading, isConfigured } = useSupabaseAuth();

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered, { gap: 12 }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.subtitle}>{t('navigation.loadingAccount')}</Text>
      </View>
    );
  }

  if (!isConfigured) {
    return (
      <View style={[styles.screen, styles.centered, styles.authContent]}>
        <Text style={styles.title}>Setup required</Text>
        <Text style={styles.subtitle}>
          Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file, then
          restart Expo.
        </Text>
      </View>
    );
  }

  return isPasswordRecovery ? (
    <NewPasswordScreen />
  ) : isAuthenticated ? (
    <MainTabNavigator />
  ) : (
    <AuthNavigator />
  );
}
