import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../theme/styles';

type ScreenHeaderProps = {
  title: string;
  subtitle: string;
  scrollY?: SharedValue<number>;
  leading?: ReactNode;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, scrollY, leading, right }: ScreenHeaderProps) {
  const styles = useAppStyles();
  const insets = useSafeAreaInsets();

  const hairlineStyle = useAnimatedStyle(() => ({
    opacity: scrollY ? interpolate(scrollY.value, [0, 24], [0, 1], 'clamp') : 0,
  }));

  return (
    <View>
      <View style={[styles.screenHeader, { paddingTop: insets.top + 12 }]}>
        <View style={styles.screenHeaderRow}>
          {leading ? <View style={{ marginRight: 8 }}>{leading}</View> : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          {right}
        </View>
      </View>
      <Animated.View style={[styles.screenHeaderHairline, hairlineStyle]} />
    </View>
  );
}
