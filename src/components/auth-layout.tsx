import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
          <Text style={[styles.title, { textAlign: 'center' }]}>{title}</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>{subtitle}</Text>
        </Animated.View>

        <AppCard delay={100}>{children}</AppCard>

        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
