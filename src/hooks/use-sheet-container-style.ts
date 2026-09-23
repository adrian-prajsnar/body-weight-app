import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { layoutWidth } from '../theme/tokens';

export function useSheetContainerStyle(extra?: StyleProp<ViewStyle>): StyleProp<ViewStyle> {
  const styles = useAppStyles();
  const { width } = useWindowDimensions();
  const isFloating = width > layoutWidth.sheet;

  return [styles.datePickerSheet, isFloating && styles.datePickerSheetFloating, extra];
}

export function useFloatingSheet(): boolean {
  const { width } = useWindowDimensions();
  return width > layoutWidth.sheet;
}
