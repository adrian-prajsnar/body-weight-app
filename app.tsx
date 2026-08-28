import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { WeightEntriesProvider } from './src/context/weight-entries-context';
import { RootTabParamList } from './src/navigation/types';
import { ComparisonScreen } from './src/screens/comparison-screen';
import { DashboardScreen } from './src/screens/dashboard-screen';
import { HistoryScreen } from './src/screens/history-screen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <WeightEntriesProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: '#6B7280',
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'Dashboard' }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'History' }}
          />
          <Tab.Screen
            name="Comparison"
            component={ComparisonScreen}
            options={{ title: 'Compare' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WeightEntriesProvider>
  );
}
