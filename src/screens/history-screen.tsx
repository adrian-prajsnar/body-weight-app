import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { HistoryList } from '../components/history-list';
import { ScreenHeader } from '../components/screen-header';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { filterEntriesByBounds } from '../stats';
import { styles } from '../theme/styles';

type OptionalDateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

function OptionalDateField({ label, value, onChange }: OptionalDateFieldProps) {
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
        value: value ?? getTodayDate(),
        mode: 'date',
        onChange: handleChange,
      });
      return;
    }
    setShowPicker(true);
  };

  return (
    <View style={styles.rangeRow}>
      <View style={styles.filterFieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {value ? (
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.linkText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable style={styles.dateButton} onPress={openPicker}>
        <Text style={[styles.dateButtonValue, !value && styles.filterPlaceholder]}>
          {value ? formatDateLabel(toDateKey(value)) : 'Any'}
        </Text>
      </Pressable>
      {showPicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={value ?? getTodayDate()}
          mode="date"
          display="spinner"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

export function HistoryScreen() {
  const { entries, removeEntry } = useSharedWeightEntries();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

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
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Delete failed.';
              Alert.alert('Delete failed', message);
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.filterFieldHeader}>
            <Text style={styles.cardTitle}>Date filter</Text>
            {isFilterActive ? (
              <Pressable onPress={clearFilter} hitSlop={8}>
                <Text style={styles.linkText}>Clear all</Text>
              </Pressable>
            ) : null}
          </View>
          <OptionalDateField label="From" value={fromDate} onChange={setFromDate} />
          <OptionalDateField label="To" value={toDate} onChange={setToDate} />
          {isInvalid ? (
            <Text style={styles.warningText}>From date must be on or before to date.</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <HistoryList
            entries={filteredEntries}
            onDelete={handleDelete}
            emptyMessage={emptyMessage}
          />
        </View>
      </ScrollView>
    </View>
  );
}
