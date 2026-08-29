import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreen } from '../screens/profile-screen';
import { ComparisonScreen } from '../screens/comparison-screen';
import { DashboardScreen } from '../screens/dashboard-screen';
import { HistoryScreen } from '../screens/history-screen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof RootTabParamList, TabIconName> = {
  Dashboard: 'home-outline',
  History: 'list-outline',
  Comparison: 'git-compare-outline',
  Profile: 'person-outline',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Comparison" component={ComparisonScreen} options={{ title: 'Compare' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
