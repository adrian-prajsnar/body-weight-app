import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatDateLabel } from '../format';
import { WeightEntry } from '../types';
import { styles } from '../theme/styles';
import { WeightWithBmi } from './weight-with-bmi';

type HistoryListProps = {
  entries: WeightEntry[];
  onDelete?: (date: string) => void;
  deletingDate?: string | null;
  emptyMessage?: string;
};

export function HistoryList({
  entries,
  onDelete,
  deletingDate = null,
  emptyMessage = 'No entries yet.',
}: HistoryListProps) {
  const { heightEntries } = useSharedUserProfile();

  if (entries.length === 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <View>
      {entries.map((item) => (
        <View key={item.date} style={styles.historyRow}>
          <View style={styles.historyRowContent}>
            <Text style={styles.historyDate}>{formatDateLabel(item.date)}</Text>
            <WeightWithBmi
              weightKg={item.weightKg}
              entryDate={item.date}
              heightEntries={heightEntries}
              layout="stacked"
              compactBmi
            />
          </View>
          {onDelete ? (
            <Pressable
              onPress={() => onDelete(item.date)}
              disabled={deletingDate !== null}
              style={styles.historyDeleteButton}
            >
              {deletingDate === item.date ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}
