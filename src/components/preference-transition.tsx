import { ReactNode, useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from '../i18n/language-context';
import { useTheme } from '../theme/theme-context';

const FADE_OUT_MS = 120;
const FADE_IN_MS = 150;
const MIN_OPACITY = 0.88;

type PreferenceTransitionProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PreferenceTransition({ children, style }: PreferenceTransitionProps) {
  const { locale } = useTranslation();
  const { scheme } = useTheme();
  const opacity = useSharedValue(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    opacity.value = withSequence(
      withTiming(MIN_OPACITY, { duration: FADE_OUT_MS }),
      withTiming(1, { duration: FADE_IN_MS }),
    );
  }, [locale, scheme, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
