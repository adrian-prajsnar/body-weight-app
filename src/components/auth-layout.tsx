import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { AppCard } from './app-card';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <LinearGradient
        colors={[colors.accentSoft, colors.background]}
        style={styles.authBackdrop}
        pointerEvents="none"
      />
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)} style={styles.authBrand}>
          <View style={[styles.authLogo, { backgroundColor: colors.accent }]}>
            <Ionicons name="analytics" size={32} color={colors.onAccent} />
          </View>
          <Text style={[styles.title, { textAlign: 'center' }]}>{t('app.name')}</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>{t('app.tagline')}</Text>
        </Animated.View>

        <AppCard delay={100} title={title} subtitle={subtitle}>
          {children}
        </AppCard>

        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
