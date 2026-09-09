import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppCard } from '../components/app-card';
import { DateField } from '../components/date-field';
import { ErrorCard } from '../components/error-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { ScreenHeader } from '../components/screen-header';
import { WeightEntryModal } from '../components/weight-entry-modal';
import { useConfirm } from '../context/confirm-context';
import { useToast } from '../context/toast-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import {
  clampHistoryDateRange,
  formatDateLabel,
  getDefaultHistoryDateRange,
  getTodayDate,
  toDateKey,
} from '../format';
import { filterEntriesByBounds } from '../stats';
import { runWhenIdle } from '../run-when-idle';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { spacing } from '../theme/tokens';
import { waitForInteractions, waitForPaint } from '../wait-for-paint';

const SCROLL_TOP_THRESHOLD = 160;

export function HistoryScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { entries, isLoading, isRefreshing, deletingDate, error, removeEntry, refreshEntries } =
    useSharedWeightEntries();
  const { showError, showSuccess } = useToast();
  const { confirm } = useConfirm();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const handleScrollOffset = useCallback((offset: number) => {
    setShowScrollTop((current) => {
      const next = offset > SCROLL_TOP_THRESHOLD;
      return current === next ? current : next;
    });
  }, []);
  const { scrollY, onScroll } = useScrollHeader(handleScrollOffset);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const today = getTodayDate();
  const defaultRange = useMemo(() => getDefaultHistoryDateRange(today), [today]);
  const [fromDate, setFromDate] = useState(() => defaultRange.from);
  const [toDate, setToDate] = useState(() => defaultRange.to);
  const [isListReady, setIsListReady] = useState(false);
  const hasActivatedListRef = useRef(false);
  const [isClearingFilter, setIsClearingFilter] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    if (!isFocused || hasActivatedListRef.current) {
      return;
    }

    hasActivatedListRef.current = true;
    const task = runWhenIdle(() => {
      setIsListReady(true);
    });
    return () => task.cancel();
  }, [isFocused]);

  const fromKey = toDateKey(fromDate);
  const toKey = toDateKey(toDate);
  const defaultFromKey = toDateKey(defaultRange.from);
  const defaultToKey = toDateKey(defaultRange.to);
  const isFilterCustom = fromKey !== defaultFromKey || toKey !== defaultToKey;
  const isInvalid = fromKey > toKey;
  const showListContent = !isLoading && isListReady;

  const filteredEntries = useMemo(() => {
    if (isInvalid) {
      return [];
    }
    return filterEntriesByBounds(entries, fromKey, toKey);
  }, [entries, fromKey, toKey, isInvalid]);

  const handleFromChange = useCallback(
    async (date: Date | null) => {
      if (!date) {
        return;
      }
      const next = clampHistoryDateRange(date, toDate, 'from', today);
      setFromDate(next.from);
      setToDate(next.to);
      await waitForInteractions();
    },
    [toDate, today],
  );

  const handleToChange = useCallback(
    async (date: Date | null) => {
      if (!date) {
        return;
      }
      const next = clampHistoryDateRange(fromDate, date, 'to', today);
      setFromDate(next.from);
      setToDate(next.to);
      await waitForInteractions();
    },
    [fromDate, today],
  );

  const handleEdit = useCallback((date: string) => {
    setEditingDate(date);
  }, []);

  const handleDelete = useCallback(
    (date: string) => {
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
          } catch (deleteError) {
            const message = deleteError instanceof Error ? deleteError.message : t('history.deleteFailed');
            showError(message);
          }
        })();
      });
    },
    [confirm, removeEntry, showError, showSuccess, t],
  );

  const clearFilter = useCallback(() => {
    if (isClearingFilter) {
      return;
    }
    void (async () => {
      setIsClearingFilter(true);
      await waitForPaint();
      setFromDate(defaultRange.from);
      setToDate(defaultRange.to);
      await waitForInteractions();
      setIsClearingFilter(false);
    })();
  }, [defaultRange.from, defaultRange.to, isClearingFilter]);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const emptyMessage = isInvalid ? t('history.invalidRangeEmpty') : t('history.emptyFiltered');

  const subtitle = useMemo(() => {
    if (isLoading) {
      return t('history.subtitleLoading');
    }
    const totalLabel = t('history.totalWeighIns', { count: entries.length });
    if (filteredEntries.length === entries.length) {
      return totalLabel;
    }
    return `${totalLabel} · ${t('history.filteredWeighIns', { count: filteredEntries.length })}`;
  }, [entries.length, filteredEntries.length, isLoading, t]);

  const scrollTopBottom = insets.bottom + spacing.sm + 64 + spacing.xl + spacing.sm;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('history.title')} subtitle={subtitle} scrollY={scrollY} />

      <Animated.ScrollView
        ref={scrollRef}
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

        <AppCard delay={0}>
          {isFilterCustom || isClearingFilter ? (
            <View style={{ alignItems: 'flex-end', marginBottom: spacing.sm, minHeight: 20 }}>
              <Pressable
                onPress={clearFilter}
                disabled={isClearingFilter}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityState={{ busy: isClearingFilter }}
              >
                {isClearingFilter ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Text style={styles.linkText}>{t('history.clearAll')}</Text>
                )}
              </Pressable>
            </View>
          ) : null}
          <View style={styles.historyDateFilters}>
            <DateField
              label={t('history.from')}
              value={fromDate}
              onChange={handleFromChange}
              maximumDate={toDate}
            />
            <DateField
              label={t('history.to')}
              value={toDate}
              onChange={handleToChange}
              maximumDate={today}
            />
          </View>
          {isInvalid ? <Text style={styles.warningText}>{t('history.invalidRange')}</Text> : null}
        </AppCard>

        <AppCard isBusy={isRefreshing && showListContent} delay={60}>
          {showListContent ? (
            <HistoryList
              entries={filteredEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingDate={deletingDate}
              emptyMessage={emptyMessage}
              grouped
            />
          ) : (
            <HistoryListSkeleton rows={6} />
          )}
        </AppCard>
      </Animated.ScrollView>

      {showScrollTop ? (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
          <Pressable
            style={({ pressed }) => [
              styles.scrollTopFab,
              { bottom: scrollTopBottom },
              pressed && styles.buttonPressed,
            ]}
            onPress={scrollToTop}
            accessibilityRole="button"
            accessibilityLabel={t('history.scrollToTop')}
          >
            <Ionicons name="chevron-up" size={22} color={colors.accent} />
          </Pressable>
        </Animated.View>
      ) : null}

      <WeightEntryModal
        visible={editingDate !== null}
        date={editingDate}
        entries={entries}
        onClose={() => setEditingDate(null)}
        onSaved={refreshEntries}
        isDataLoading={isLoading}
      />
    </View>
  );
}
