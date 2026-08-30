import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { DateField } from '../components/date-field';
import { ErrorCard } from '../components/error-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { ScreenHeader } from '../components/screen-header';
import { useConfirm } from '../context/confirm-context';
import { useToast } from '../context/toast-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { filterEntriesByBounds } from '../stats';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function HistoryScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { entries, isLoading, isRefreshing, deletingDate, error, removeEntry, refreshEntries } =
    useSharedWeightEntries();
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
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
    const dateLabel = formatDateLabel(date);
    void confirm({
      title: t('history.deleteEntry'),
      message: t('history.deleteConfirm', { date: dateLabel }),
      confirmLabel: t('common.delete'),
      destructive: true,
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      void (async () => {
        try {
          await removeEntry(date);
          showSuccess(t('history.deleted', { date: dateLabel }));
        } catch (error) {
          const message = error instanceof Error ? error.message : t('history.deleteFailed');
          showError(message);
        }
      })();
    });
  };

  const clearFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  const emptyMessage = isInvalid
    ? t('history.invalidRangeEmpty')
    : isFilterActive
      ? t('history.emptyFiltered')
      : t('history.emptyDefault');

  const showFilterCard = isFilterOpen || isFilterActive;

  const subtitle =
    filteredEntries.length === 1
      ? t('history.entryCount_one')
      : t('history.entryCount_other', { count: filteredEntries.length });

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('history.title')}
        subtitle={subtitle}
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
            accessibilityLabel={t('history.toggleFilter')}
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
            title={t('history.dateFilter')}
            right={
              isFilterActive ? (
                <Pressable onPress={clearFilter} hitSlop={8}>
                  <Text style={styles.linkText}>{t('history.clearAll')}</Text>
                </Pressable>
              ) : undefined
            }
          >
            <DateField
              label={t('history.from')}
              value={fromDate}
              onChange={setFromDate}
              optional
              maximumDate={today}
            />
            <DateField
              label={t('history.to')}
              value={toDate}
              onChange={setToDate}
              optional
              maximumDate={today}
            />
            {isInvalid ? (
              <Text style={styles.warningText}>{t('history.invalidRange')}</Text>
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
