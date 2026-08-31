import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { AppCard } from './app-card';
import { BmiBadge } from './bmi-badge';
import { DateField } from './date-field';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useUnits } from '../context/unit-context';
import { useToast } from '../context/toast-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import {
  formatWeightValue,
  getTodayDate,
  getWeightRangeMessage,
  getWeightUnitLabel,
  parseWeightInput,
  toDateKey,
} from '../format';
import { getHeightAtDate } from '../height';
import { useTranslation } from '../i18n/language-context';
import { getLatestChange } from '../stats';
import { saveEntry } from '../supabase/weight-sync';
import { WeightEntry } from '../types';
import { lbToKg, WEIGHT_STEP_KG, WEIGHT_STEP_LB } from '../units';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type EntryFormProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  isDataLoading?: boolean;
};

export function EntryForm({ entries, onSaved, isDataLoading = false }: EntryFormProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { units } = useUnits();
  const { heightEntries } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const { showError, showSuccess } = useToast();
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const weightPlaceholder = units === 'imperial' ? '0.0' : '0.00';
  const previewBmi = useMemo(() => {
    const weightKg = parseWeightInput(weightInput, units);
    const heightCm = getHeightAtDate(heightEntries, selectedDateKey);
    if (!showBmi || weightKg === null || heightCm === null) {
      return null;
    }
    return calculateBmi(weightKg, heightCm);
  }, [weightInput, heightEntries, selectedDateKey, showBmi, units]);

  useEffect(() => {
    const existing = entries.find((entry) => entry.date === selectedDateKey);
    setWeightInput(existing ? formatWeightValue(existing.weightKg, units) : '');
  }, [entries, selectedDateKey, units]);

  const isDisabled = isSaving || isDataLoading;

  const adjustWeight = (direction: -1 | 1) => {
    const current =
      parseWeightInput(weightInput, units) ?? getLatestChange(entries).latest?.weightKg ?? null;
    if (current === null) {
      return;
    }

    const deltaKg =
      units === 'imperial' ? lbToKg(WEIGHT_STEP_LB) * direction : WEIGHT_STEP_KG * direction;
    setWeightInput(formatWeightValue(Math.round((current + deltaKg) * 100) / 100, units));
  };

  const handleSave = async () => {
    const weightKg = parseWeightInput(weightInput, units);
    if (weightKg === null) {
      showError(getWeightRangeMessage(units));
      return;
    }

    setIsSaving(true);

    try {
      await saveEntry(selectedDateKey, weightKg);
      await onSaved();
      setSelectedDate(getTodayDate());
      showSuccess(t('entryForm.saved'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('entryForm.saveFailed');
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppCard title={t('entryForm.title')} isBusy={isDataLoading} delay={60}>
      <DateField
        label={t('entryForm.date')}
        value={selectedDate}
        onChange={(date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        maximumDate={getTodayDate()}
      />

      <Text style={styles.fieldLabel}>{t('entryForm.weight')}</Text>
      <View style={styles.weightEntryRow}>
        <Pressable
          style={({ pressed }) => [styles.stepperButton, pressed && styles.buttonPressed]}
          onPress={() => adjustWeight(-1)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={t('entryForm.decreaseWeight')}
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
            placeholder={weightPlaceholder}
            placeholderTextColor={colors.textSubtle}
            editable={!isDisabled}
          />
          <Text style={styles.weightInputUnit}>{getWeightUnitLabel(units)}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.stepperButton, pressed && styles.buttonPressed]}
          onPress={() => adjustWeight(1)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={t('entryForm.increaseWeight')}
        >
          <Ionicons name="add" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      {previewBmi ? (
        <View style={styles.bmiPreviewRow}>
          <Text style={styles.fieldLabel}>{t('entryForm.estimatedBmi')}</Text>
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
          <Text style={styles.primaryButtonText}>{t('entryForm.saveEntry')}</Text>
        )}
      </Pressable>
    </AppCard>
  );
}
