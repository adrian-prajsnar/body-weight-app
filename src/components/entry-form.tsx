import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, AppState, Platform, Pressable, Text, TextInput, View } from 'react-native';
import {
  formatDateLabel,
  formatKg,
  getTodayDate,
  parseKg,
  toDateKey,
} from '../format';
import { saveEntry } from '../storage';
import { WeightEntry } from '../types';
import { styles } from '../theme/styles';

type EntryFormProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  onBackupWarning?: (message: string) => void;
};

export function EntryForm({ entries, onSaved, onBackupWarning }: EntryFormProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [weightInput, setWeightInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        setSelectedDate(getTodayDate());
      }
    });

    return () => subscription.remove();
  }, []);

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
      Alert.alert(
        'Invalid weight',
        'Enter a weight between 20.00 and 300.00 kg with up to 2 decimals.',
      );
      return;
    }

    setIsSaving(true);

    try {
      await saveEntry(selectedDateKey, weightKg);
      await onSaved();
      setSelectedDate(getTodayDate());
    } catch (error) {
      await onSaved();
      const message = error instanceof Error ? error.message : 'Backup export failed.';
      onBackupWarning?.(`Saved in app, but backup failed: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
  );
}
