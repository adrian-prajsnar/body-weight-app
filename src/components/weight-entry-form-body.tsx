import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { BmiBadge } from './bmi-badge';
import { DateField } from './date-field';
import { EmptyState } from './empty-state';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useUnits } from '../context/unit-context';
import { useToast } from '../context/toast-context';
import { useSharedUserProfile } from '../context/user-profile-context';
import {
  formatDateLabel,
  formatWeightValue,
  getTodayDate,
  getWeightRangeMessage,
  getWeightUnitLabel,
  parseWeightInput,
  toDateKey,
} from '../format';
import { canLogWeightAtDate, getHeightAtDate, hasAnyHeight } from '../height';
import { useTranslation } from '../i18n/language-context';
import { RootTabParamList } from '../navigation/types';
import { getLatestChange } from '../stats';
import { saveEntry } from '../supabase/weight-sync';
import { WeightEntry } from '../types';
import { lbToKg, WEIGHT_STEP_KG, WEIGHT_STEP_LB } from '../units';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { spacing } from '../theme/tokens';

type WeightEntryFormBodyProps = {
  entries: WeightEntry[];
  onSaved: () => Promise<void>;
  isDataLoading?: boolean;
  initialDate?: Date;
  resetDateAfterSave?: boolean;
  onSaveSuccess?: () => void;
  autoFocusWeight?: boolean;
  dateReadOnly?: boolean;
};

export function WeightEntryFormBody({
  entries,
  onSaved,
  isDataLoading = false,
  initialDate,
  resetDateAfterSave = false,
  onSaveSuccess,
  autoFocusWeight = false,
  dateReadOnly = false,
}: WeightEntryFormBodyProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { units } = useUnits();
  const { heightEntries, isLoading: isProfileLoading } = useSharedUserProfile();
  const { showBmi } = useSharedBmiDisplay();
  const { showError, showSuccess } = useToast();
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getTodayDate);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const weightInputRef = useRef<TextInput>(null);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const weightPlaceholder = units === 'imperial' ? '0.0' : '0.00';
  const heightAtDate = getHeightAtDate(heightEntries, selectedDateKey);
  const canLogWeight = canLogWeightAtDate(heightEntries, selectedDateKey);
  const needsHeightSetup = !hasAnyHeight(heightEntries);

  const previewBmi = useMemo(() => {
    const weightKg = parseWeightInput(weightInput, units);
    if (!showBmi || weightKg === null || heightAtDate === null) {
      return null;
    }
    return calculateBmi(weightKg, heightAtDate);
  }, [weightInput, heightAtDate, showBmi, units]);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  useEffect(() => {
    const existing = entries.find((entry) => entry.date === selectedDateKey);
    setWeightInput(existing ? formatWeightValue(existing.weightKg, units) : '');
  }, [entries, selectedDateKey, units]);

  useEffect(() => {
    if (!autoFocusWeight) {
      return;
    }
    const timer = setTimeout(() => weightInputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [autoFocusWeight, initialDate]);

  const isBlocked = isProfileLoading || !canLogWeight;
  const isDisabled = isSaving || isDataLoading || isBlocked;

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
    if (!canLogWeight) {
      showError(
        needsHeightSetup
          ? t('entryForm.heightRequiredSave')
          : t('entryForm.noHeightForDateSave', { date: formatDateLabel(selectedDateKey) }),
      );
      return;
    }

    const weightKg = parseWeightInput(weightInput, units);
    if (weightKg === null) {
      showError(getWeightRangeMessage(units));
      return;
    }

    setIsSaving(true);

    try {
      await saveEntry(selectedDateKey, weightKg);
      await onSaved();
      if (resetDateAfterSave) {
        setSelectedDate(getTodayDate());
      }
      showSuccess(t('entryForm.saved'));
      onSaveSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('entryForm.saveFailed');
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const openProfile = () => {
    navigation.navigate('Profile');
  };

  if (needsHeightSetup && !isProfileLoading) {
    return (
      <View style={{ gap: 12 }}>
        <EmptyState
          icon="body-outline"
          title={t('entryForm.heightRequiredTitle')}
          message={t('entryForm.heightRequiredMessage')}
        />
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={openProfile}
        >
          <Text style={styles.secondaryButtonText}>{t('entryForm.openProfile')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.md }}>
      <DateField
        label={t('entryForm.date')}
        value={selectedDate}
        onChange={(date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        maximumDate={getTodayDate()}
        readOnly={dateReadOnly}
      />

      {!canLogWeight ? (
        <View style={{ gap: spacing.md }}>
          <EmptyState
            icon="calendar-outline"
            title={t('entryForm.noHeightForDateTitle')}
            message={t('entryForm.noHeightForDateMessage')}
          />
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={openProfile}
          >
            <Text style={styles.secondaryButtonText}>{t('entryForm.openProfile')}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          <View style={{ gap: spacing.sm }}>
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
                  ref={weightInputRef}
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
        </View>
      )}
    </View>
  );
}
