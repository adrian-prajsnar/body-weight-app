import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
};

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const styles = useAppStyles();
  const colors = useColors();

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons name={icon} size={24} color={colors.textSubtle} />
      </View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      {message ? <Text style={styles.emptyStateText}>{message}</Text> : null}
    </View>
  );
}
