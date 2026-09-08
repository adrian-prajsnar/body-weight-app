import { View } from 'react-native';
import { useAppStyles } from '../theme/styles';

export function ListSeparator() {
  const styles = useAppStyles();
  return <View style={styles.divider} />;
}
