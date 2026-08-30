import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { AppCard } from './app-card';
import { BmiBadge } from './bmi-badge';
import { DateField } from './date-field';
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
import { getLatestChange } from '../stats';
import { saveEntry } from '../supabase/weight-sync';
import { WeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

const STEP_KG = 0.1;

type EntryFormProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  isDataLoading?: boolean;
};

export function EntryForm({ entries, onSaved, isDataLoading = false }: EntryFormProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const { showError, showSuccess } = useToast();
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const isDisabled = isSaving || isDataLoading;

  const adjustWeight = (delta: number) => {
    const current = parseKg(weightInput) ?? getLatestChange(entries).latest?.weightKg ?? null;
    if (current === null) {
      return;
    }
    setWeightInput(formatKg(Math.round((current + delta) * 100) / 100));
  };

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
    <AppCard title="Log weight" isBusy={isDataLoading} delay={60}>
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

      <Text style={styles.fieldLabel}>Weight</Text>
      <View style={styles.weightEntryRow}>
        <Pressable
          style={({ pressed }) => [styles.stepperButton, pressed && styles.buttonPressed]}
          onPress={() => adjustWeight(-STEP_KG)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Decrease weight"
        >
          <Ionicons name="remove" size={22} color={colors.textMuted} />
        </Pressable>

        <View style={[styles.weightInputWrapper, isFocused && styles.inputFocused]}>
          <TextInput
            style={styles.weightInput}
            value={weightInput}
            onChangeText={setWeightInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textSubtle}
            editable={!isDisabled}
          />
          <Text style={styles.weightInputUnit}>kg</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.stepperButton, pressed && styles.buttonPressed]}
          onPress={() => adjustWeight(STEP_KG)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel="Increase weight"
        >
          <Ionicons name="add" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      {previewBmi ? (
        <View style={styles.bmiPreviewRow}>
          <Text style={styles.fieldLabel}>Estimated BMI</Text>
          <BmiBadge bmi={previewBmi} />
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          isDisabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => void handleSave()}
        disabled={isDisabled}
      >
        {isSaving ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryButtonText}>Save entry</Text>
        )}
      </Pressable>
    </AppCard>
  );
}
