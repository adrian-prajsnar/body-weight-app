import { useWindowDimensions } from 'react-native';
import { layoutBreakpoint } from '../theme/tokens';

export function useWideLayout(): boolean {
  const { width } = useWindowDimensions();
  return width >= layoutBreakpoint.wide;
}
