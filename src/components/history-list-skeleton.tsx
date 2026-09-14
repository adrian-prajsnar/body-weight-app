import { View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { SkeletonBlock } from './skeleton';

type HistoryListSkeletonProps = {
  rows?: number;
};

export function HistoryListSkeleton({ rows = 5 }: HistoryListSkeletonProps) {
  const styles = useAppStyles();

  return (
    <View style={{ gap: 4 }}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.historyRow}>
          <View style={[styles.historyRowContent, { gap: 8 }]}>
            <View style={{ gap: 2 }}>
              <SkeletonBlock height={14} width="45%" />
              <SkeletonBlock height={11} width="38%" />
            </View>
            <SkeletonBlock height={18} width="35%" />
          </View>
          <SkeletonBlock height={14} width={48} />
        </View>
      ))}
    </View>
  );
}
