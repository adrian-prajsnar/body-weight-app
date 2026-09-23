import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStyles } from '../theme/styles';
import { AppCard } from './app-card';
import { BrandLogo } from './brand-logo';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const styles = useAppStyles();

  return (
    <KeyboardAvoidingView style={styles.authMain} behavior="padding">
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <View style={styles.authFrame}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.authHeader}>
            <BrandLogo />
            <View style={styles.authHeading}>
              <Text style={styles.authTitle}>{title}</Text>
              <Text style={styles.authSubtitle}>{subtitle}</Text>
            </View>
          </Animated.View>

          <AppCard delay={100}>{children}</AppCard>

          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
