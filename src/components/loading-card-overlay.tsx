import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function LoadingCardOverlay({ style }: { style?: StyleProp<ViewStyle> }) {
  const styles = useAppStyles();
  const colors = useColors();

  return (
    <View style={[styles.loadingOverlay, style]}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  );
}
