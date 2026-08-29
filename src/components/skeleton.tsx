import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { styles } from '../theme/styles';

type SkeletonBlockProps = {
  height: number;
  width?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ height, width = '100%', style }: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.skeletonBlock, { height, width, opacity }, style]} />
  );
}
