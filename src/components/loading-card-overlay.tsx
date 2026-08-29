import { ActivityIndicator, View } from 'react-native';
import { styles } from '../theme/styles';

export function LoadingCardOverlay() {
  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="small" color="#2563EB" />
    </View>
  );
}
