import { Ionicons } from '@expo/vector-icons';
import { memo, useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSharedUserProfile } from '../context/user-profile-context';
import { formatDateLabel, formatMonthLabel } from '../format';
import { useTranslation } from '../i18n/language-context';
import { groupEntriesByMonth } from '../stats';
import { WeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { EmptyState } from './empty-state';
import { WeightWithBmi } from './weight-with-bmi';

type HistoryListProps = {
  entries: WeightEntry[];
  onEdit?: (date: string) => void;
  onDelete?: (date: string) => void;
  deletingDate?: string | null;
  emptyMessage?: string;
  grouped?: boolean;
};

export const HistoryList = memo(function HistoryList({
  entries,
  onEdit,
  onDelete,
  deletingDate = null,
  emptyMessage,
  grouped = false,
}: HistoryListProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { heightEntries } = useSharedUserProfile();

  const resolvedEmptyMessage = emptyMessage ?? t('history.emptyDefault');

  const groups = useMemo(
    () => (grouped ? groupEntriesByMonth(entries) : [{ monthKey: 'all', entries }]),
    [entries, grouped],
  );

  if (entries.length === 0) {
    return (
      <EmptyState
        icon="documents-outline"
        title={t('history.noEntries')}
        message={resolvedEmptyMessage}
      />
    );
  }

  const renderRow = (item: WeightEntry) => (
    <View key={item.date} style={styles.historyRow}>
      <View style={styles.historyRowContent}>
        <Text style={styles.historyDate}>{formatDateLabel(item.date)}</Text>
        <WeightWithBmi
          entry={item}
          heightEntries={heightEntries}
          layout="stacked"
          compactBmi
        />
      </View>
      {onEdit || onDelete ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {onEdit ? (
            <Pressable
              onPress={() => onEdit(item.date)}
              disabled={deletingDate !== null}
              style={({ pressed }) => [
                styles.historyDeleteButton,
                pressed && styles.buttonPressed,
              ]}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={t('history.editA11y', { date: formatDateLabel(item.date) })}
            >
              <Ionicons name="create-outline" size={19} color={colors.textMuted} />
            </Pressable>
          ) : null}
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
              accessibilityLabel={t('history.deleteA11y', { date: formatDateLabel(item.date) })}
            >
              {deletingDate === item.date ? (
                <ActivityIndicator size="small" color={colors.danger} />
              ) : (
                <Ionicons name="trash-outline" size={19} color={colors.danger} />
              )}
            </Pressable>
          ) : null}
        </View>
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
});
