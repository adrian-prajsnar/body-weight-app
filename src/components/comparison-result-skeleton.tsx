import { View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { SkeletonBlock } from './skeleton';

export function ComparisonResultSkeleton() {
  const styles = useAppStyles();

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.comparisonPeriodCard}>
        <SkeletonBlock height={16} width="30%" />
        <SkeletonBlock height={14} width="55%" />
        <SkeletonBlock height={24} width="65%" />
        <SkeletonBlock height={14} width="80%" />
      </View>
      <View style={styles.comparisonPeriodCard}>
        <SkeletonBlock height={16} width="30%" />
        <SkeletonBlock height={14} width="55%" />
        <SkeletonBlock height={24} width="65%" />
        <SkeletonBlock height={14} width="80%" />
      </View>
      <SkeletonBlock height={20} width="50%" />
    </View>
  );
}
