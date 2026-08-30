import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/**
 * Tracks vertical scroll offset so a screen header can reveal its hairline
 * once content slides underneath it.
 */
export function useScrollHeader() {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return { scrollY, onScroll };
}
