import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileNavigator } from './profile-navigator';
import { ComparisonScreen } from '../screens/comparison-screen';
import { DashboardScreen } from '../screens/dashboard-screen';
import { HistoryScreen } from '../screens/history-screen';
import { useTranslation } from '../i18n/language-context';
import { AppTabBar } from './tab-bar';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function MainTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t('navigation.dashboard') }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: t('navigation.history') }}
      />
      <Tab.Screen
        name="Comparison"
        component={ComparisonScreen}
        options={{ title: t('navigation.compare') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: t('navigation.profile') }}
      />
    </Tab.Navigator>
  );
}
