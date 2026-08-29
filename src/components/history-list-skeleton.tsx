import { View } from 'react-native';
import { styles } from '../theme/styles';
import { SkeletonBlock } from './skeleton';

type HistoryListSkeletonProps = {
  rows?: number;
};

export function HistoryListSkeleton({ rows = 5 }: HistoryListSkeletonProps) {
  return (
    <View style={{ gap: 4 }}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.historyRow}>
          <View style={[styles.historyRowContent, { gap: 8 }]}>
            <SkeletonBlock height={14} width="45%" />
            <SkeletonBlock height={18} width="35%" />
          </View>
          <SkeletonBlock height={14} width={48} />
        </View>
      ))}
    </View>
  );
}
