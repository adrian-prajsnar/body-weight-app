import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccountScreen } from '../screens/account-screen';
import { ComparisonScreen } from '../screens/comparison-screen';
import { DashboardScreen } from '../screens/dashboard-screen';
import { HistoryScreen } from '../screens/history-screen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Comparison" component={ComparisonScreen} options={{ title: 'Compare' }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}
