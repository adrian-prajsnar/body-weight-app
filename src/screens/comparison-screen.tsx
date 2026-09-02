import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { ComparisonResult } from '../components/comparison-result';
import { ComparisonResultSkeleton } from '../components/comparison-result-skeleton';
import { DateField } from '../components/date-field';
import { EmptyState } from '../components/empty-state';
import { ErrorCard } from '../components/error-card';
import { ScreenHeader } from '../components/screen-header';
import { useSharedUserProfile } from '../context/user-profile-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import { toDateKey } from '../format';
import { getComparison } from '../stats';
import { ComparisonMode } from '../types';
import { useAppStyles } from '../theme/styles';

type RangePickerProps = {
  title: string;
  delay: number;
  start: Date | null;
  end: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
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
        onChange={onStartChange}
      />
      <DateField
        label={t('comparison.end')}
        value={end}
        onChange={onEndChange}
      />
    </AppCard>
  );
}

export function ComparisonScreen() {
  const styles = useAppStyles();
  const { t, locale } = useTranslation();
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const { birthDate } = useSharedUserProfile();
  const { scrollY, onScroll } = useScrollHeader();
  const [mode, setMode] = useState<ComparisonMode>('week');

  const [rangeAStart, setRangeAStart] = useState<Date | null>(null);
  const [rangeAEnd, setRangeAEnd] = useState<Date | null>(null);
  const [rangeBStart, setRangeBStart] = useState<Date | null>(null);
  const [rangeBEnd, setRangeBEnd] = useState<Date | null>(null);

  const resetCustomRanges = () => {
    setRangeAStart(null);
    setRangeAEnd(null);
    setRangeBStart(null);
    setRangeBEnd(null);
  };

  useEffect(() => {
    if (!birthDate && mode === 'ageYear') {
      setMode('week');
    }
  }, [birthDate, mode]);

  const modeOptions = useMemo(() => {
    const options: { value: ComparisonMode; label: string }[] = [
      { value: 'week', label: t('comparison.week') },
      { value: 'month', label: t('comparison.month') },
      { value: 'year', label: t('comparison.year') },
    ];
    if (birthDate) {
      options.push({ value: 'ageYear', label: t('comparison.ageYear') });
    }
    options.push({ value: 'custom', label: t('comparison.custom') });
    return options;
  }, [birthDate, t, locale]);

  const customRanges = useMemo(() => {
    if (mode !== 'custom') {
      return null;
    }
    if (!rangeAStart || !rangeAEnd || !rangeBStart || !rangeBEnd) {
      return null;
    }
    return {
      rangeA: { start: toDateKey(rangeAStart), end: toDateKey(rangeAEnd) },
      rangeB: { start: toDateKey(rangeBStart), end: toDateKey(rangeBEnd) },
    };
  }, [mode, rangeAStart, rangeAEnd, rangeBStart, rangeBEnd]);

  const customIncomplete =
    mode === 'custom' &&
    (!rangeAStart || !rangeAEnd || !rangeBStart || !rangeBEnd);

  const comparison = useMemo(() => {
    if (mode === 'custom') {
      if (!customRanges) {
        return null;
      }
      return getComparison(entries, 'custom', customRanges, birthDate);
    }
    return getComparison(entries, mode, undefined, birthDate);
  }, [entries, mode, customRanges, locale, birthDate]);

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.presetScroll}
            contentContainerStyle={styles.presetScrollContent}
          >
            {modeOptions.map((option) => {
              const isActive = mode === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.presetButton,
                    isActive && styles.presetButtonActive,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {
                    if (option.value === 'custom' && mode !== 'custom') {
                      resetCustomRanges();
                    }
                    setMode(option.value);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.presetButtonText,
                      isActive && styles.presetButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
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

        {customIncomplete ? null : isLoading ? (
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
