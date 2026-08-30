import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type ErrorCardProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  const styles = useAppStyles();
  const colors = useColors();

  return (
    <View style={styles.errorCard}>
      <View style={styles.errorCardHeader}>
        <Ionicons name="alert-circle" size={18} color={colors.danger} />
        <Text style={styles.errorCardTitle}>Could not load data</Text>
      </View>
      <Text style={styles.errorCardMessage}>{message}</Text>
      <Pressable
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
        onPress={onRetry}
      >
        <Text style={styles.secondaryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );
}
