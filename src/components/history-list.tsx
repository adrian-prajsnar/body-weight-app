import { FlatList, Pressable, Text, View } from 'react-native';
import { formatDateLabel, formatKg } from '../format';
import { WeightEntry } from '../types';
import { styles } from '../theme/styles';

type HistoryListProps = {
  entries: WeightEntry[];
  onDelete?: (date: string) => void;
  emptyMessage?: string;
};

export function HistoryList({
  entries,
  onDelete,
  emptyMessage = 'No entries yet.',
}: HistoryListProps) {
  if (entries.length === 0) {
    return <Text style={styles.emptyText}>{emptyMessage}</Text>;
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.date}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.historyRow}>
          <View>
            <Text style={styles.historyDate}>{formatDateLabel(item.date)}</Text>
            <Text style={styles.historyWeight}>{formatKg(item.weightKg)} kg</Text>
          </View>
          {onDelete ? (
            <Pressable onPress={() => onDelete(item.date)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    />
  );
}
