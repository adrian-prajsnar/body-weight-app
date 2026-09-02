import { useCallback, useRef } from 'react';
import { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/**
 * Tracks vertical scroll offset so a screen header can reveal its hairline
 * once content slides underneath it.
 */
export function useScrollHeader() {
  const scrollY = useSharedValue(0);
  const scrollOffsetRef = useRef(0);

  const setScrollOffset = useCallback((offset: number) => {
    scrollOffsetRef.current = offset;
  }, []);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    runOnJS(setScrollOffset)(event.contentOffset.y);
  });

  return { scrollY, onScroll, scrollOffsetRef };
}
