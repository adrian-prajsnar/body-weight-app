import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SupabaseAuthProvider } from './src/context/supabase-auth-context';
import { BmiDisplayProvider } from './src/context/bmi-display-context';
import { ToastProvider } from './src/context/toast-context';
import { UserProfileProvider } from './src/context/user-profile-context';
import { WeightEntriesProvider } from './src/context/weight-entries-context';
import { RootNavigator } from './src/navigation/root-navigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SupabaseAuthProvider>
        <ToastProvider>
          <UserProfileProvider>
            <BmiDisplayProvider>
              <WeightEntriesProvider>
                <NavigationContainer>
                  <StatusBar style="dark" />
                  <RootNavigator />
                </NavigationContainer>
              </WeightEntriesProvider>
            </BmiDisplayProvider>
          </UserProfileProvider>
        </ToastProvider>
      </SupabaseAuthProvider>
    </SafeAreaProvider>
  );
}
