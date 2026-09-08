import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppCard } from '../components/app-card';
import { ComparisonModeSelector } from '../components/comparison-mode-selector';
import { ComparisonResult } from '../components/comparison-result';
import { ComparisonResultSkeleton } from '../components/comparison-result-skeleton';
import { ComparisonTrendList } from '../components/comparison-trend-list';
import { DateField } from '../components/date-field';
import { EmptyState } from '../components/empty-state';
import { ErrorCard } from '../components/error-card';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { ScreenHeader } from '../components/screen-header';
import { SegmentedControl, SegmentedOption } from '../components/segmented-control';
import { useSharedUserProfile } from '../context/user-profile-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScreenLoading } from '../hooks/use-screen-loading';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import {
  fromDateKey,
  getDefaultTrendDateRange,
  getTrendDateRangeValidationMessageKey,
  getTodayDate,
  toDateKey,
  validateTrendDateRange,
} from '../format';
import { getComparison, getTrendRows } from '../stats';
import { ComparisonMode, CustomCompareKind, TrendGranularity } from '../types';
import { runWhenIdle } from '../run-when-idle';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { spacing } from '../theme/tokens';

const SCROLL_TOP_THRESHOLD = 160;

type RangePickerProps = {
  title: string;
  delay: number;
  start: Date | null;
  end: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  invalid?: boolean;
  maximumDate: Date;
};

function RangePicker({
  title,
  delay,
  start,
  end,
  onStartChange,
  onEndChange,
  invalid = false,
  maximumDate,
}: RangePickerProps) {
  const styles = useAppStyles();
  const { t } = useTranslation();

  return (
    <AppCard title={title} delay={delay}>
      <DateField
        label={t('comparison.start')}
        value={start}
        onChange={onStartChange}
        maximumDate={end ?? maximumDate}
      />
      <DateField
        label={t('comparison.end')}
        value={end}
        onChange={onEndChange}
        maximumDate={maximumDate}
        minimumDate={start ?? undefined}
      />
      {invalid ? <Text style={styles.warningText}>{t('comparison.invalidCustom')}</Text> : null}
    </AppCard>
  );
}

function isTrendMode(mode: ComparisonMode): mode is TrendGranularity {
  return mode !== 'custom';
}

export function ComparisonScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const { birthDate } = useSharedUserProfile();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const listReadyTaskRef = useRef<ReturnType<typeof runWhenIdle> | null>(null);
  const today = getTodayDate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isListReady, setIsListReady] = useState(false);
  const [mode, setMode] = useState<ComparisonMode>('day');

  const defaultTrendRange = useMemo(
    () => getDefaultTrendDateRange('day', today, birthDate),
    [birthDate, today],
  );
  const [fromDate, setFromDate] = useState(defaultTrendRange.from);
  const [toDate, setToDate] = useState(defaultTrendRange.to);

  const [customKind, setCustomKind] = useState<CustomCompareKind>('period');

  const [rangeAStart, setRangeAStart] = useState<Date | null>(null);
  const [rangeAEnd, setRangeAEnd] = useState<Date | null>(null);
  const [rangeBStart, setRangeBStart] = useState<Date | null>(null);
  const [rangeBEnd, setRangeBEnd] = useState<Date | null>(null);
  const [dateA, setDateA] = useState<Date | null>(null);
  const [dateB, setDateB] = useState<Date | null>(null);

  const handleScrollOffset = useCallback((offset: number) => {
    setShowScrollTop((current) => {
      const next = offset > SCROLL_TOP_THRESHOLD;
      return current === next ? current : next;
    });
  }, []);

  const { scrollY, onScroll } = useScrollHeader(handleScrollOffset);

  const beginListLoading = useCallback(() => {
    listReadyTaskRef.current?.cancel();
    setIsListReady(false);
    listReadyTaskRef.current = runWhenIdle(() => {
      setIsListReady(true);
      listReadyTaskRef.current = null;
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      beginListLoading();
      return () => listReadyTaskRef.current?.cancel();
    }, [beginListLoading]),
  );

  const resetCustomRanges = () => {
    setRangeAStart(null);
    setRangeAEnd(null);
    setRangeBStart(null);
    setRangeBEnd(null);
  };

  const resetCustomDates = () => {
    setDateA(null);
    setDateB(null);
  };

  const customKindOptions = useMemo<SegmentedOption<CustomCompareKind>[]>(
    () => [
      { value: 'period', label: t('comparison.customKind.period') },
      { value: 'dates', label: t('comparison.customKind.dates') },
    ],
    [locale, t],
  );

  useEffect(() => {
    if (!birthDate && mode === 'ageYear') {
      setMode('day');
    }
  }, [birthDate, mode]);

  const applyDefaultRange = useCallback(
    (granularity: TrendGranularity) => {
      const next = getDefaultTrendDateRange(granularity, today, birthDate);
      setFromDate(next.from);
      setToDate(next.to);
    },
    [birthDate, today],
  );

  const fromKey = toDateKey(fromDate);
  const toKey = toDateKey(toDate);

  const rangeValidation = useMemo(() => {
    if (!isTrendMode(mode)) {
      return null;
    }
    return validateTrendDateRange(fromDate, toDate, mode, today, birthDate);
  }, [birthDate, fromDate, mode, today, toDate]);

  const rangeValidationMessage = useMemo(() => {
    if (!rangeValidation || !isTrendMode(mode)) {
      return null;
    }
    return t(getTrendDateRangeValidationMessageKey(rangeValidation, mode));
  }, [mode, rangeValidation, t]);

  const isInvalidRange = rangeValidation !== null;

  const isDefaultRange = useMemo(() => {
    if (!isTrendMode(mode)) {
      return true;
    }
    const defaultRange = getDefaultTrendDateRange(mode, today, birthDate);
    return (
      fromKey === toDateKey(defaultRange.from) && toKey === toDateKey(defaultRange.to)
    );
  }, [birthDate, fromKey, mode, today, toKey]);

  const filterRange = useMemo(
    () => ({ start: fromKey, end: toKey }),
    [fromKey, toKey],
  );

  const trendRows = useMemo(() => {
    if (!isListReady || !isTrendMode(mode) || isInvalidRange) {
      return [];
    }
    return getTrendRows(entries, mode, filterRange, birthDate);
  }, [birthDate, entries, filterRange, isInvalidRange, isListReady, mode]);

  const showTrendContent = !isLoading && isListReady && !isInvalidRange;
  const isScreenLoading =
    isLoading || (isTrendMode(mode) && !isListReady);
  useScreenLoading(isScreenLoading);

  const filterMinimumFrom = useMemo(() => {
    if (!birthDate || !isTrendMode(mode) || mode === 'day') {
      return undefined;
    }
    return fromDateKey(birthDate);
  }, [birthDate, mode]);

  const customRanges = useMemo(() => {
    if (mode !== 'custom') {
      return null;
    }
    if (customKind === 'dates') {
      if (!dateA || !dateB) {
        return null;
      }
      const dateAKey = toDateKey(dateA);
      const dateBKey = toDateKey(dateB);
      return {
        rangeA: { start: dateAKey, end: dateAKey },
        rangeB: { start: dateBKey, end: dateBKey },
      };
    }
    if (!rangeAStart || !rangeAEnd || !rangeBStart || !rangeBEnd) {
      return null;
    }
    return {
      rangeA: { start: toDateKey(rangeAStart), end: toDateKey(rangeAEnd) },
      rangeB: { start: toDateKey(rangeBStart), end: toDateKey(rangeBEnd) },
    };
  }, [customKind, dateA, dateB, mode, rangeAStart, rangeAEnd, rangeBStart, rangeBEnd]);

  const customIncomplete =
    mode === 'custom' &&
    (customKind === 'period'
      ? !rangeAStart || !rangeAEnd || !rangeBStart || !rangeBEnd
      : !dateA || !dateB);

  const comparison = useMemo(() => {
    if (mode !== 'custom' || !customRanges) {
      return null;
    }
    return getComparison(entries, 'custom', customRanges, birthDate, customKind);
  }, [birthDate, customKind, customRanges, entries, mode]);

  const customInvalid =
    mode === 'custom' &&
    customKind === 'period' &&
    customRanges &&
    (customRanges.rangeA.start > customRanges.rangeA.end ||
      customRanges.rangeB.start > customRanges.rangeB.end);

  const rangeAInvalid =
    Boolean(rangeAStart && rangeAEnd && toDateKey(rangeAStart) > toDateKey(rangeAEnd));
  const rangeBInvalid =
    Boolean(rangeBStart && rangeBEnd && toDateKey(rangeBStart) > toDateKey(rangeBEnd));

  const handleModeChange = (nextMode: ComparisonMode) => {
    if (nextMode === 'custom' && mode !== 'custom') {
      setCustomKind('period');
      resetCustomRanges();
      resetCustomDates();
    }
    if (isTrendMode(nextMode)) {
      applyDefaultRange(nextMode);
      beginListLoading();
    }
    setMode(nextMode);
  };

  const handleCustomKindChange = (nextKind: CustomCompareKind) => {
    if (nextKind === customKind) {
      return;
    }
    if (nextKind === 'period') {
      resetCustomDates();
    } else {
      resetCustomRanges();
    }
    setCustomKind(nextKind);
  };

  const handleFromChange = (date: Date | null) => {
    if (!date || !isTrendMode(mode)) {
      return;
    }
    beginListLoading();
    setFromDate(date);
  };

  const handleToChange = (date: Date | null) => {
    if (!date || !isTrendMode(mode)) {
      return;
    }
    beginListLoading();
    setToDate(date);
  };

  const resetRange = () => {
    if (isTrendMode(mode)) {
      applyDefaultRange(mode);
      beginListLoading();
    }
  };

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const trendEmptyMessage = isInvalidRange
    ? (rangeValidationMessage ?? t('comparison.invalidRange'))
    : t('comparison.nothingMessage');

  const scrollTopBottom = insets.bottom + spacing.sm + 64 + spacing.xl + spacing.sm;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('comparison.title')}
        subtitle={t('comparison.subtitle')}
        scrollY={scrollY}
      />
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
          <View style={styles.comparisonFilterSection}>
            <ComparisonModeSelector
              selected={mode}
              onSelect={handleModeChange}
              showAgeYear={Boolean(birthDate)}
            />

            {isTrendMode(mode) ? (
              <>
                {!isDefaultRange ? (
                  <View style={styles.filterActionsRow}>
                    <Pressable onPress={resetRange} hitSlop={8}>
                      <Text style={styles.linkText}>{t(`comparison.reset.${mode}`)}</Text>
                    </Pressable>
                  </View>
                ) : null}
                <View style={styles.historyDateFilters}>
                  <DateField
                    label={t('comparison.start')}
                    value={fromDate}
                    onChange={handleFromChange}
                    maximumDate={toDate}
                    minimumDate={filterMinimumFrom}
                  />
                  <DateField
                    label={t('comparison.end')}
                    value={toDate}
                    onChange={handleToChange}
                    maximumDate={today}
                    minimumDate={fromDate}
                  />
                </View>
                {rangeValidationMessage ? (
                  <Text style={styles.warningText}>{rangeValidationMessage}</Text>
                ) : null}
              </>
            ) : (
              <SegmentedControl
                options={customKindOptions}
                value={customKind}
                onChange={handleCustomKindChange}
              />
            )}
          </View>
        </AppCard>

        {mode === 'custom' && customKind === 'period' ? (
          <>
            <RangePicker
              title={t('periods.rangeA')}
              delay={60}
              start={rangeAStart}
              end={rangeAEnd}
              onStartChange={setRangeAStart}
              onEndChange={setRangeAEnd}
              invalid={rangeAInvalid}
              maximumDate={today}
            />
            <RangePicker
              title={t('periods.rangeB')}
              delay={120}
              start={rangeBStart}
              end={rangeBEnd}
              onStartChange={setRangeBStart}
              onEndChange={setRangeBEnd}
              invalid={rangeBInvalid}
              maximumDate={today}
            />
          </>
        ) : null}

        {mode === 'custom' && customKind === 'dates' ? (
          <AppCard delay={60}>
            <DateField
              label={t('comparison.dateA')}
              value={dateA}
              onChange={setDateA}
              maximumDate={today}
            />
            <DateField
              label={t('comparison.dateB')}
              value={dateB}
              onChange={setDateB}
              maximumDate={today}
            />
          </AppCard>
        ) : null}

        {isTrendMode(mode) ? (
            <AppCard
            isBusy={isRefreshing && showTrendContent}
            delay={60}
            animateEntry={false}
          >
            {isInvalidRange ? (
              <EmptyState
                icon="git-compare-outline"
                title={t('comparison.nothingTitle')}
                message={trendEmptyMessage}
              />
            ) : showTrendContent ? (
              <ComparisonTrendList
                mode={mode}
                rows={trendRows}
                entries={entries}
                embedded
                emptyMessage={trendEmptyMessage}
              />
            ) : (
              <HistoryListSkeleton rows={6} />
            )}
          </AppCard>
        ) : customIncomplete ? (
          <AppCard delay={60}>
            <EmptyState
              icon="git-compare-outline"
              title={t('comparison.nothingTitle')}
              message={t('comparison.nothingMessage')}
            />
          </AppCard>
        ) : isLoading ? (
          <AppCard delay={60}>
            <ComparisonResultSkeleton />
          </AppCard>
        ) : customInvalid ? (
          <AppCard delay={60}>
            <EmptyState
              icon="git-compare-outline"
              title={t('comparison.nothingTitle')}
              message={t('comparison.invalidCustom')}
            />
          </AppCard>
        ) : comparison ? (
          <AppCard delay={60} isBusy={isRefreshing}>
            <ComparisonResult
              labelA={comparison.labelA}
              labelB={comparison.labelB}
              rangeA={comparison.rangeA}
              rangeB={comparison.rangeB}
              statsA={comparison.statsA}
              statsB={comparison.statsB}
              entries={entries}
              difference={comparison.difference}
              isDayMode={customKind === 'dates'}
              embedded
            />
          </AppCard>
        ) : (
          <AppCard delay={60}>
            <EmptyState
              icon="git-compare-outline"
              title={t('comparison.nothingTitle')}
              message={t('comparison.nothingMessage')}
            />
          </AppCard>
        )}
      </Animated.ScrollView>

      {isTrendMode(mode) && showScrollTop ? (
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
    </View>
  );
}
