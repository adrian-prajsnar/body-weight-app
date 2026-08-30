import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatDateLabel, formatMonthLabel } from '../format';
import { groupEntriesByMonth } from '../stats';
import { WeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { EmptyState } from './empty-state';
import { WeightWithBmi } from './weight-with-bmi';

type HistoryListProps = {
  entries: WeightEntry[];
  onDelete?: (date: string) => void;
  deletingDate?: string | null;
  emptyMessage?: string;
  grouped?: boolean;
};

export function HistoryList({
  entries,
  onDelete,
  deletingDate = null,
  emptyMessage = 'Entries you log will show up here.',
  grouped = false,
}: HistoryListProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { heightEntries } = useSharedUserProfile();

  const groups = useMemo(
    () => (grouped ? groupEntriesByMonth(entries) : [{ monthKey: 'all', entries }]),
    [entries, grouped],
  );

  if (entries.length === 0) {
    return <EmptyState icon="documents-outline" title="No entries" message={emptyMessage} />;
  }

  const renderRow = (item: WeightEntry) => (
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
          style={({ pressed }) => [
            styles.historyDeleteButton,
            pressed && styles.iconButtonDanger,
          ]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Delete entry for ${formatDateLabel(item.date)}`}
        >
          {deletingDate === item.date ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Ionicons name="trash-outline" size={19} color={colors.danger} />
          )}
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <View>
      {groups.map((group) => (
        <View key={group.monthKey} style={styles.historyGroup}>
          {grouped ? (
            <Text style={styles.historyGroupLabel}>
              {formatMonthLabel(group.entries[0].date)}
            </Text>
          ) : null}
          {group.entries.map(renderRow)}
        </View>
      ))}
    </View>
  );
}
