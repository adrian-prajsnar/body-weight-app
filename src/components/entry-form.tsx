import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { BmiBadge } from './bmi-badge';
import { DateField } from './date-field';
import { LoadingCardOverlay } from './loading-card-overlay';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useToast } from '../context/toast-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import {
  formatKg,
  getTodayDate,
  parseKg,
  toDateKey,
  WEIGHT_RANGE_MESSAGE,
} from '../format';
import { getHeightAtDate } from '../height';
import { saveEntry } from '../supabase/weight-sync';
import { WeightEntry } from '../types';
import { styles } from '../theme/styles';

type EntryFormProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  isDataLoading?: boolean;
};

export function EntryForm({ entries, onSaved, isDataLoading = false }: EntryFormProps) {
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const { showError, showSuccess } = useToast();
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const previewBmi = useMemo(() => {
    const weightKg = parseKg(weightInput);
    const heightCm = getHeightAtDate(heightEntries, selectedDateKey);
    if (!showBmi || weightKg === null || heightCm === null) {
      return null;
    }
    return calculateBmi(weightKg, heightCm);
  }, [weightInput, heightEntries, selectedDateKey, showBmi]);

  useEffect(() => {
    const existing = entries.find((entry) => entry.date === selectedDateKey);
    setWeightInput(existing ? formatKg(existing.weightKg) : '');
  }, [entries, selectedDateKey]);

  const handleSave = async () => {
    const weightKg = parseKg(weightInput);
    if (weightKg === null) {
      showError(WEIGHT_RANGE_MESSAGE);
      return;
    }

    setIsSaving(true);

    try {
      await saveEntry(selectedDateKey, weightKg);
      await onSaved();
      setSelectedDate(getTodayDate());
      showSuccess('Weight entry saved.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Save failed.';
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.loadingCard}>
      {isDataLoading ? <LoadingCardOverlay /> : null}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add or edit entry</Text>
        <DateField
          label="Date"
          value={selectedDate}
          onChange={(date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          maximumDate={getTodayDate()}
        />

        <Text style={styles.fieldLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weightInput}
          onChangeText={setWeightInput}
          keyboardType="decimal-pad"
          placeholder="65.25"
          placeholderTextColor="#9CA3AF"
          editable={!isDataLoading && !isSaving}
        />

        {previewBmi ? (
          <View style={styles.bmiPreviewRow}>
            <Text style={styles.fieldLabel}>Estimated BMI</Text>
            <BmiBadge bmi={previewBmi} />
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryButton, (isSaving || isDataLoading) && styles.buttonDisabled]}
          onPress={() => void handleSave()}
          disabled={isSaving || isDataLoading}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Save</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
