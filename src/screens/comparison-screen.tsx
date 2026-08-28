import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { ComparisonResult } from '../components/comparison-result';
import { ScreenHeader } from '../components/screen-header';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { getComparison } from '../stats';
import { ComparisonMode } from '../types';
import { styles } from '../theme/styles';

const MODE_OPTIONS: { label: string; value: ComparisonMode }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'Custom', value: 'custom' },
];

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

function DateField({ label, value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      onChange(date);
    }
  };

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        onChange: handleChange,
      });
      return;
    }
    setShowPicker(true);
  };

  return (
    <View style={styles.rangeRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dateButton} onPress={openPicker}>
        <Text style={styles.dateButtonValue}>{formatDateLabel(toDateKey(value))}</Text>
      </Pressable>
      {showPicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

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
      <DateField label="Start" value={start} onChange={onStartChange} />
      <DateField label="End" value={end} onChange={onEndChange} />
    </View>
  );
}

export function ComparisonScreen() {
  const { entries } = useSharedWeightEntries();
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
    (toDateKey(rangeAStart) > toDateKey(rangeAEnd) ||
      toDateKey(rangeBStart) > toDateKey(rangeBEnd));

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Comparison"
        subtitle="Compare averages across periods"
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
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

        <View style={styles.card}>
          {customInvalid ? (
            <Text style={styles.warningText}>Each range must have start on or before end.</Text>
          ) : comparison ? (
            <ComparisonResult
              labelA={comparison.labelA}
              labelB={comparison.labelB}
              rangeA={comparison.rangeA}
              rangeB={comparison.rangeB}
              statsA={comparison.statsA}
              statsB={comparison.statsB}
              difference={comparison.difference}
            />
          ) : (
            <Text style={styles.emptyText}>Select valid ranges to compare.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
