import { Pressable, Text, View } from 'react-native';
import { styles } from '../theme/styles';

type ErrorCardProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorCardTitle}>Could not load data</Text>
      <Text style={styles.errorCardMessage}>{message}</Text>
      <Pressable style={styles.secondaryButton} onPress={onRetry}>
        <Text style={styles.secondaryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );
}
