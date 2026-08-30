import { View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { SkeletonBlock } from './skeleton';

export function ProfileDetailsSkeleton() {
  const styles = useAppStyles();

  return (
    <View style={{ gap: 16 }}>
      <View style={styles.accountRow}>
        <SkeletonBlock height={12} width="20%" />
        <SkeletonBlock height={16} width="70%" />
      </View>
      <View style={styles.accountRow}>
        <SkeletonBlock height={12} width="30%" />
        <SkeletonBlock height={16} width="50%" />
      </View>
      <View style={styles.accountRow}>
        <SkeletonBlock height={12} width="35%" />
        <SkeletonBlock height={16} width="25%" />
      </View>
      <View style={styles.accountRow}>
        <SkeletonBlock height={12} width="20%" />
        <SkeletonBlock height={16} width="40%" />
      </View>
    </View>
  );
}
