import { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { DateField } from '../components/date-field';
import { ErrorCard } from '../components/error-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { LoadingCardOverlay } from '../components/loading-card-overlay';
import { ScreenHeader } from '../components/screen-header';
import { useToast } from '../context/toast-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { filterEntriesByBounds } from '../stats';
import { styles } from '../theme/styles';

export function HistoryScreen() {
  const { entries, isLoading, isRefreshing, deletingDate, error, removeEntry, refreshEntries } =
    useSharedWeightEntries();
  const { showError, showSuccess } = useToast();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const today = getTodayDate();

  const isFilterActive = fromDate !== null || toDate !== null;
  const fromKey = fromDate ? toDateKey(fromDate) : null;
  const toKey = toDate ? toDateKey(toDate) : null;
  const isInvalid = Boolean(fromKey && toKey && fromKey > toKey);

  const filteredEntries = useMemo(() => {
    if (!isFilterActive) {
      return entries;
    }
    if (isInvalid) {
      return [];
    }
    return filterEntriesByBounds(entries, fromKey, toKey);
  }, [entries, fromKey, toKey, isFilterActive, isInvalid]);

  const handleDelete = (date: string) => {
    Alert.alert('Delete entry', `Remove the entry for ${formatDateLabel(date)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await removeEntry(date);
              showSuccess(`Entry for ${formatDateLabel(date)} deleted.`);
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Delete failed.';
              showError(message);
            }
          })();
        },
      },
    ]);
  };

  const clearFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  const emptyMessage = isInvalid
    ? 'Start date must be on or before end date.'
    : isFilterActive
      ? 'No entries in this date range.'
      : 'No entries yet.';

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="History"
        subtitle={isFilterActive ? 'Filtered entries' : 'All logged entries'}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshEntries()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshEntries()} />
        ) : null}

        <View style={styles.card}>
          <View style={styles.filterFieldHeader}>
            <Text style={styles.cardTitle}>Date filter</Text>
            {isFilterActive ? (
              <Pressable onPress={clearFilter} hitSlop={8}>
                <Text style={styles.linkText}>Clear all</Text>
              </Pressable>
            ) : null}
          </View>
          <DateField
            label="From"
            value={fromDate}
            onChange={setFromDate}
            optional
            maximumDate={today}
          />
          <DateField label="To" value={toDate} onChange={setToDate} optional maximumDate={today} />
          {isInvalid ? (
            <Text style={styles.warningText}>From date must be on or before to date.</Text>
          ) : null}
        </View>

        <View style={styles.loadingCard}>
          {isRefreshing ? <LoadingCardOverlay /> : null}
          <View style={styles.card}>
            {isLoading ? (
              <HistoryListSkeleton rows={6} />
            ) : (
              <HistoryList
                entries={filteredEntries}
                onDelete={handleDelete}
                deletingDate={deletingDate}
                emptyMessage={emptyMessage}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
