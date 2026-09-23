import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ColorScheme, Palette } from '../tokens';

export type StyleContext = {
  colors: Palette;
  scheme: ColorScheme;
};

export const tabularNums: TextStyle = { fontVariant: ['tabular-nums'] };

/** Flat cards: border separation only (matches the clean dark-mode look). */
export function cardSurface(colors: Palette, scheme: ColorScheme, level: 1 | 2): ViewStyle {
  return {
    borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
    borderColor: level === 2 && scheme === 'light' ? colors.borderStrong : colors.border,
  };
}

/** Floating chrome (tab bar): border separation only — elevation/shadow tint badly on light Android. */
export function floatingSurface(colors: Palette, scheme: ColorScheme): ViewStyle {
  return {
    borderWidth: scheme === 'dark' ? 1 : StyleSheet.hairlineWidth,
    borderColor: scheme === 'dark' ? colors.border : colors.borderStrong,
  };
}
