import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { DateField } from '../components/date-field';
import { ErrorCard } from '../components/error-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { ScreenHeader } from '../components/screen-header';
import { useToast } from '../context/toast-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { filterEntriesByBounds } from '../stats';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function HistoryScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const { entries, isLoading, isRefreshing, deletingDate, error, removeEntry, refreshEntries } =
    useSharedWeightEntries();
  const { showError, showSuccess } = useToast();
  const { scrollY, onScroll } = useScrollHeader();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      : 'Entries you log will show up here.';

  const showFilterCard = isFilterOpen || isFilterActive;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="History"
        subtitle={
          filteredEntries.length === 1 ? '1 entry' : `${filteredEntries.length} entries`
        }
        scrollY={scrollY}
        right={
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              isFilterActive && { backgroundColor: colors.accentSoft },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setIsFilterOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel="Toggle date filter"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={isFilterActive ? colors.accent : colors.textMuted}
            />
          </Pressable>
        }
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshEntries()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshEntries()} />
        ) : null}

        {showFilterCard ? (
          <AppCard
            title="Date filter"
            right={
              isFilterActive ? (
                <Pressable onPress={clearFilter} hitSlop={8}>
                  <Text style={styles.linkText}>Clear all</Text>
                </Pressable>
              ) : undefined
            }
          >
            <DateField
              label="From"
              value={fromDate}
              onChange={setFromDate}
              optional
              maximumDate={today}
            />
            <DateField
              label="To"
              value={toDate}
              onChange={setToDate}
              optional
              maximumDate={today}
            />
            {isInvalid ? (
              <Text style={styles.warningText}>From date must be on or before to date.</Text>
            ) : null}
          </AppCard>
        ) : null}

        <AppCard isBusy={isRefreshing} delay={60}>
          {isLoading ? (
            <HistoryListSkeleton rows={6} />
          ) : (
            <HistoryList
              entries={filteredEntries}
              onDelete={handleDelete}
              deletingDate={deletingDate}
              emptyMessage={emptyMessage}
              grouped
            />
          )}
        </AppCard>
      </Animated.ScrollView>
    </View>
  );
}
