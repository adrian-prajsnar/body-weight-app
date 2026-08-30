import { useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { ComparisonResult } from '../components/comparison-result';
import { ComparisonResultSkeleton } from '../components/comparison-result-skeleton';
import { DateField } from '../components/date-field';
import { EmptyState } from '../components/empty-state';
import { ErrorCard } from '../components/error-card';
import { ScreenHeader } from '../components/screen-header';
import { SegmentedControl, SegmentedOption } from '../components/segmented-control';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import { getTodayDate, toDateKey } from '../format';
import { getComparison } from '../stats';
import { ComparisonMode } from '../types';
import { useAppStyles } from '../theme/styles';

type RangePickerProps = {
  title: string;
  delay: number;
  start: Date;
  end: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
};

function RangePicker({
  title,
  delay,
  start,
  end,
  onStartChange,
  onEndChange,
}: RangePickerProps) {
  const { t } = useTranslation();

  return (
    <AppCard title={title} delay={delay}>
      <DateField
        label={t('comparison.start')}
        value={start}
        onChange={(date) => {
          if (date) {
            onStartChange(date);
          }
        }}
      />
      <DateField
        label={t('comparison.end')}
        value={end}
        onChange={(date) => {
          if (date) {
            onEndChange(date);
          }
        }}
      />
    </AppCard>
  );
}

export function ComparisonScreen() {
  const styles = useAppStyles();
  const { t, locale } = useTranslation();
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const { scrollY, onScroll } = useScrollHeader();
  const [mode, setMode] = useState<ComparisonMode>('week');
  const today = getTodayDate();

  const [rangeAStart, setRangeAStart] = useState(today);
  const [rangeAEnd, setRangeAEnd] = useState(today);
  const [rangeBStart, setRangeBStart] = useState(today);
  const [rangeBEnd, setRangeBEnd] = useState(today);

  const modeOptions = useMemo<SegmentedOption<ComparisonMode>[]>(
    () => [
      { value: 'week', label: t('comparison.week') },
      { value: 'month', label: t('comparison.month') },
      { value: 'year', label: t('comparison.year') },
      { value: 'custom', label: t('comparison.custom') },
    ],
    [t],
  );

  const customRanges = useMemo(() => {
    if (mode !== 'custom') {
      return null;
    }
    return {
      rangeA: { start: toDateKey(rangeAStart), end: toDateKey(rangeAEnd) },
      rangeB: { start: toDateKey(rangeBStart), end: toDateKey(rangeBEnd) },
    };
  }, [mode, rangeAStart, rangeAEnd, rangeBStart, rangeBEnd]);

  const comparison = useMemo(() => {
    if (mode === 'custom') {
      if (!customRanges) {
        return null;
      }
      return getComparison(entries, 'custom', customRanges);
    }
    return getComparison(entries, mode);
  }, [entries, mode, customRanges, locale]);

  const customInvalid =
    mode === 'custom' &&
    customRanges &&
    (customRanges.rangeA.start > customRanges.rangeA.end ||
      customRanges.rangeB.start > customRanges.rangeB.end);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('comparison.title')}
        subtitle={t('comparison.subtitle')}
        scrollY={scrollY}
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

        <AppCard title={t('comparison.period')}>
          <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />
        </AppCard>

        {mode === 'custom' ? (
          <>
            <RangePicker
              title={t('periods.rangeA')}
              delay={60}
              start={rangeAStart}
              end={rangeAEnd}
              onStartChange={setRangeAStart}
              onEndChange={setRangeAEnd}
            />
            <RangePicker
              title={t('periods.rangeB')}
              delay={120}
              start={rangeBStart}
              end={rangeBEnd}
              onStartChange={setRangeBStart}
              onEndChange={setRangeBEnd}
            />
          </>
        ) : null}

        {isLoading ? (
          <AppCard>
            <ComparisonResultSkeleton />
          </AppCard>
        ) : customInvalid ? (
          <AppCard>
            <Text style={styles.warningText}>{t('comparison.invalidCustom')}</Text>
          </AppCard>
        ) : comparison ? (
          <ComparisonResult
            labelA={comparison.labelA}
            labelB={comparison.labelB}
            rangeA={comparison.rangeA}
            rangeB={comparison.rangeB}
            statsA={comparison.statsA}
            statsB={comparison.statsB}
            entries={entries}
            difference={comparison.difference}
            isBusy={isRefreshing}
          />
        ) : (
          <AppCard>
            <EmptyState
              icon="git-compare-outline"
              title={t('comparison.nothingTitle')}
              message={t('comparison.nothingMessage')}
            />
          </AppCard>
        )}
      </Animated.ScrollView>
    </View>
  );
}
