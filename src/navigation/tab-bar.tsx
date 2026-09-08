import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationLoading } from '../context/navigation-loading-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { spacing } from '../theme/tokens';
import { RootTabParamList } from './types';

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof RootTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  Dashboard: { active: 'home', inactive: 'home-outline' },
  History: { active: 'list', inactive: 'list-outline' },
  Comparison: { active: 'git-compare', inactive: 'git-compare-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { isNavigationBlocked } = useNavigationLoading();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { bottom: insets.bottom + spacing.sm }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name as keyof RootTabParamList];

        const isTabSwitchBlocked = isNavigationBlocked && !isFocused;

        const onPress = () => {
          if (isTabSwitchBlocked) {
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            style={[
              styles.tabBarItem,
              isFocused && styles.tabBarItemActive,
              isTabSwitchBlocked && styles.tabBarItemDisabled,
            ]}
            disabled={isTabSwitchBlocked}
            onPress={onPress}
            onLongPress={() =>
              navigation.emit({ type: 'tabLongPress', target: route.key })
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
          >
            <Ionicons
              name={isFocused ? icons.active : icons.inactive}
              size={22}
              color={isFocused ? colors.accent : colors.textSubtle}
            />
            <Text
              style={[
                styles.tabBarLabel,
                { color: isFocused ? colors.accentText : colors.textSubtle },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
