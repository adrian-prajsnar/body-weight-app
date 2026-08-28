import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SupabaseAuthProvider } from './src/context/supabase-auth-context';
import { WeightEntriesProvider } from './src/context/weight-entries-context';
import { RootNavigator } from './src/navigation/root-navigator';

export default function App() {
  return (
    <SupabaseAuthProvider>
      <WeightEntriesProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </WeightEntriesProvider>
    </SupabaseAuthProvider>
  );
}
