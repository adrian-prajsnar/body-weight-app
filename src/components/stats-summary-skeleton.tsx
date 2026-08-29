import { View } from 'react-native';
import { SkeletonBlock } from './skeleton';

export function StatsSummarySkeleton() {
  return (
    <View style={{ gap: 10 }}>
      <SkeletonBlock height={28} width="70%" />
      <SkeletonBlock height={16} width="85%" />
      <SkeletonBlock height={16} width="60%" />
      <SkeletonBlock height={16} width="40%" />
    </View>
  );
}
