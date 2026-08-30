import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type SkeletonBlockProps = {
  height: number;
  width?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ height, width = '100%', style }: SkeletonBlockProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const progress = useSharedValue(0);
  const [blockWidth, setBlockWidth] = useState(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-blockWidth, blockWidth]) },
    ],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setBlockWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.skeletonBlock, { height, width }, style]} onLayout={handleLayout}>
      <Animated.View style={[styles.skeletonShimmer, shimmerStyle]}>
        <LinearGradient
          colors={[colors.skeleton, colors.skeletonHighlight, colors.skeleton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
