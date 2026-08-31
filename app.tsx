import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseAuthProvider } from './src/context/supabase-auth-context';
import { BmiDisplayProvider } from './src/context/bmi-display-context';
import { ConfirmProvider } from './src/context/confirm-context';
import { ToastProvider } from './src/context/toast-context';
import { UserProfileProvider } from './src/context/user-profile-context';
import { WeightEntriesProvider } from './src/context/weight-entries-context';
import { RootNavigator } from './src/navigation/root-navigator';
import { LanguageProvider } from './src/i18n/language-context';
import { UnitProvider } from './src/context/unit-context';
import { ThemeProvider, useTheme } from './src/theme/theme-context';
import { fontFamily } from './src/theme/tokens';

function ThemedApp() {
  const { colors, scheme } = useTheme();

  const navigationTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colors, scheme]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SupabaseAuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <UserProfileProvider>
              <BmiDisplayProvider>
                <WeightEntriesProvider>
                  <NavigationContainer theme={navigationTheme}>
                    <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                    <RootNavigator />
                  </NavigationContainer>
                </WeightEntriesProvider>
              </BmiDisplayProvider>
            </UserProfileProvider>
          </ConfirmProvider>
        </ToastProvider>
      </SupabaseAuthProvider>
    </View>
  );
}

function FontGate({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    [fontFamily.regular]: Inter_400Regular,
    [fontFamily.medium]: Inter_500Medium,
    [fontFamily.semibold]: Inter_600SemiBold,
    [fontFamily.bold]: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UnitProvider>
            <FontGate>
              <ThemedApp />
            </FontGate>
          </UnitProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
