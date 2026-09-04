import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from './theme/tokens';

/** Visible banner body below the status bar (padding + line height). */
export const DEV_BANNER_BODY_HEIGHT = spacing.sm + 18;

const SCREEN_HEADER_TOP_GAP = spacing.md;

export function useScreenTopPadding(): number {
  const insets = useSafeAreaInsets();
  return __DEV__ ? SCREEN_HEADER_TOP_GAP : insets.top + SCREEN_HEADER_TOP_GAP;
}

export function useToastTopOffset(): number {
  const insets = useSafeAreaInsets();
  return __DEV__
    ? insets.top + DEV_BANNER_BODY_HEIGHT + spacing.sm
    : insets.top + spacing.sm;
}
