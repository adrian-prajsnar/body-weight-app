import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { chooseBackupFolder, getBackupStatus, importFromFile } from './src/export';
import { formatDateLabel, formatKg, parseKg, toDateKey } from './src/format';
import { deleteEntry, getEntries, replaceEntries, saveEntry } from './src/storage';
import { getStats } from './src/stats';
import { BackupStatus, WeightEntry } from './src/types';

const PERIOD_PRESETS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '1 year', days: 365 },
] as const;

export default function App() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weightInput, setWeightInput] = useState('');
  const [periodDays, setPeriodDays] = useState(7);
  const [customDaysInput, setCustomDaysInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({ configured: false });
  const [backupWarning, setBackupWarning] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const stats = useMemo(() => getStats(entries, periodDays), [entries, periodDays]);

  const refreshEntries = useCallback(async () => {
    const loaded = await getEntries();
    setEntries(loaded);
  }, []);

  const refreshBackupStatus = useCallback(async () => {
    setBackupStatus(await getBackupStatus());
  }, []);

  useEffect(() => {
    void refreshEntries();
    void refreshBackupStatus();
  }, [refreshEntries, refreshBackupStatus]);

  useEffect(() => {
    const existing = entries.find((entry) => entry.date === selectedDateKey);
    setWeightInput(existing ? formatKg(existing.weightKg) : '');
  }, [entries, selectedDateKey]);

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: 'date',
        onChange: handleDateChange,
      });
      return;
    }
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    const weightKg = parseKg(weightInput);
    if (weightKg === null) {
      Alert.alert('Invalid weight', 'Enter a weight between 20.00 and 300.00 kg with up to 2 decimals.');
      return;
    }

    setIsSaving(true);
    setBackupWarning(null);

    try {
      await saveEntry(selectedDateKey, weightKg);
      await refreshEntries();
      await refreshBackupStatus();
      setWeightInput(formatKg(weightKg));
    } catch (error) {
      await refreshEntries();
      const message = error instanceof Error ? error.message : 'Backup export failed.';
      setBackupWarning(`Saved in app, but backup failed: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (date: string) => {
    Alert.alert('Delete entry', `Remove the entry for ${formatDateLabel(date)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setBackupWarning(null);
            try {
              await deleteEntry(date);
              await refreshEntries();
              await refreshBackupStatus();
            } catch (error) {
              await refreshEntries();
              const message = error instanceof Error ? error.message : 'Backup export failed.';
              setBackupWarning(`Deleted in app, but backup failed: ${message}`);
            }
          })();
        },
      },
    ]);
  };

  const handleChooseBackupFolder = async () => {
    const selected = await chooseBackupFolder();
    if (!selected) {
      Alert.alert('Backup folder', 'Folder selection was cancelled.');
      return;
    }

    await refreshBackupStatus();
    setBackupWarning(null);
    Alert.alert('Backup folder', 'Backup folder updated.');
  };

  const handleImport = async () => {
    try {
      const imported = await importFromFile();
      await replaceEntries(imported);
      await refreshEntries();
      await refreshBackupStatus();
      setBackupWarning(null);
      Alert.alert('Import complete', `Restored ${imported.length} entries.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed.';
      if (message !== 'Import cancelled.') {
        Alert.alert('Import failed', message);
      }
    }
  };

  const applyCustomPeriod = () => {
    const days = Number(customDaysInput);
    if (!Number.isInteger(days) || days < 1 || days > 3650) {
      Alert.alert('Invalid period', 'Enter a whole number of days between 1 and 3650.');
      return;
    }
    setPeriodDays(days);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Body Weight Tracker</Text>
        <Text style={styles.subtitle}>Daily weight in kilograms</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add or edit entry</Text>
          <Pressable style={styles.dateButton} onPress={openDatePicker}>
            <Text style={styles.dateButtonLabel}>Date</Text>
            <Text style={styles.dateButtonValue}>{formatDateLabel(selectedDateKey)}</Text>
          </Pressable>

          {showDatePicker && Platform.OS === 'ios' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.fieldLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType="decimal-pad"
            placeholder="65.25"
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
            onPress={() => void handleSave()}
            disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average</Text>
          <View style={styles.presetRow}>
            {PERIOD_PRESETS.map((preset) => (
              <Pressable
                key={preset.days}
                style={[
                  styles.presetButton,
                  periodDays === preset.days && styles.presetButtonActive,
                ]}
                onPress={() => setPeriodDays(preset.days)}
              >
                <Text
                  style={[
                    styles.presetButtonText,
                    periodDays === preset.days && styles.presetButtonTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.customPeriodRow}>
            <TextInput
              style={[styles.input, styles.customPeriodInput]}
              value={customDaysInput}
              onChangeText={setCustomDaysInput}
              keyboardType="number-pad"
              placeholder="Custom days"
              placeholderTextColor="#9CA3AF"
            />
            <Pressable style={styles.secondaryButton} onPress={applyCustomPeriod}>
              <Text style={styles.secondaryButtonText}>Apply</Text>
            </Pressable>
          </View>

          <Text style={styles.statsText}>
            Period: last {periodDays} day{periodDays === 1 ? '' : 's'}
          </Text>
          <Text style={styles.statsValue}>
            Average: {stats.average === null ? '—' : `${formatKg(stats.average)} kg`}
          </Text>
          <Text style={styles.statsText}>
            Min: {stats.min === null ? '—' : `${formatKg(stats.min)} kg`} · Max:{' '}
            {stats.max === null ? '—' : `${formatKg(stats.max)} kg`} · Entries: {stats.count}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backup</Text>
          <Text style={styles.statsText}>
            Folder: {backupStatus.configured ? 'configured' : 'not set yet'}
          </Text>
          <Text style={styles.statsText}>
            Last export:{' '}
            {backupStatus.lastExportAt
              ? new Date(backupStatus.lastExportAt).toLocaleString()
              : 'never'}
          </Text>
          {backupWarning ? <Text style={styles.warningText}>{backupWarning}</Text> : null}
          <View style={styles.backupRow}>
            <Pressable style={styles.secondaryButton} onPress={() => void handleChooseBackupFolder()}>
              <Text style={styles.secondaryButtonText}>Choose folder</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => void handleImport()}>
              <Text style={styles.secondaryButtonText}>Import backup</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>History</Text>
          {entries.length === 0 ? (
            <Text style={styles.emptyText}>No entries yet.</Text>
          ) : (
            <FlatList
              data={entries}
              keyExtractor={(item) => item.date}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyDate}>{formatDateLabel(item.date)}</Text>
                    <Text style={styles.historyWeight}>{formatKg(item.weightKg)} kg</Text>
                  </View>
                  <Pressable onPress={() => handleDelete(item.date)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  fieldLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dateButtonLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateButtonValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  presetButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  presetButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  presetButtonTextActive: {
    color: '#1D4ED8',
  },
  customPeriodRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  customPeriodInput: {
    flex: 1,
  },
  statsText: {
    fontSize: 14,
    color: '#4B5563',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  warningText: {
    fontSize: 13,
    color: '#B45309',
  },
  backupRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyDate: {
    fontSize: 14,
    color: '#374151',
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
