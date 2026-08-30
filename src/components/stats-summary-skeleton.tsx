import { View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { SkeletonBlock } from './skeleton';

export function StatsSummarySkeleton() {
  const styles = useAppStyles();

  return (
    <View style={styles.statGrid}>
      {Array.from({ length: 4 }, (_, index) => (
        <View key={index} style={styles.statTile}>
          <SkeletonBlock height={12} width="55%" />
          <SkeletonBlock height={22} width="70%" />
        </View>
      ))}
    </View>
  );
}
