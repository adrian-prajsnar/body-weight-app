import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { ComparisonResult } from '../components/comparison-result';
import { ComparisonResultSkeleton } from '../components/comparison-result-skeleton';
import { DateField } from '../components/date-field';
import { ErrorCard } from '../components/error-card';
import { LoadingCardOverlay } from '../components/loading-card-overlay';
import { ScreenHeader } from '../components/screen-header';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { getTodayDate, toDateKey } from '../format';
import { getComparison } from '../stats';
import { ComparisonMode } from '../types';
import { styles } from '../theme/styles';

const MODE_OPTIONS: { label: string; value: ComparisonMode }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];

type RangePickerProps = {
  title: string;
  start: Date;
  end: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
};

function RangePicker({ title, start, end, onStartChange, onEndChange }: RangePickerProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.rangeLabel}>{title}</Text>
      <DateField
        label="Start"
        value={start}
        onChange={(date) => {
          if (date) {
            onStartChange(date);
          }
        }}
      />
      <DateField
        label="End"
        value={end}
        onChange={(date) => {
          if (date) {
            onEndChange(date);
          }
        }}
      />
    </View>
  );
}

export function ComparisonScreen() {
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const [mode, setMode] = useState<ComparisonMode>('week');
  const today = getTodayDate();

  const [rangeAStart, setRangeAStart] = useState(today);
  const [rangeAEnd, setRangeAEnd] = useState(today);
  const [rangeBStart, setRangeBStart] = useState(today);
  const [rangeBEnd, setRangeBEnd] = useState(today);

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
  }, [entries, mode, customRanges]);

  const customInvalid =
    mode === 'custom' &&
    customRanges &&
    (customRanges.rangeA.start > customRanges.rangeA.end ||
      customRanges.rangeB.start > customRanges.rangeB.end);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Comparison" subtitle="Compare averages across periods" />
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
          <View style={styles.segmentRow}>
            {MODE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.presetButton,
                  mode === option.value && styles.presetButtonActive,
                ]}
                onPress={() => setMode(option.value)}
              >
                <Text
                  style={[
                    styles.presetButtonText,
                    mode === option.value && styles.presetButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {mode === 'custom' ? (
          <>
            <RangePicker
              title="Range A"
              start={rangeAStart}
              end={rangeAEnd}
              onStartChange={setRangeAStart}
              onEndChange={setRangeAEnd}
            />
            <RangePicker
              title="Range B"
              start={rangeBStart}
              end={rangeBEnd}
              onStartChange={setRangeBStart}
              onEndChange={setRangeBEnd}
            />
          </>
        ) : null}

        <View style={styles.loadingCard}>
          {isRefreshing ? <LoadingCardOverlay /> : null}
          <View style={styles.card}>
            {isLoading ? (
              <ComparisonResultSkeleton />
            ) : customInvalid ? (
              <Text style={styles.warningText}>Each range must have start on or before end.</Text>
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
              />
            ) : (
              <Text style={styles.emptyText}>Select valid ranges to compare.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
