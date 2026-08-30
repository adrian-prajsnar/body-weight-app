import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { DatePickerSheet } from './date-picker-sheet';

type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  optional?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
};

export function DateField({
  label,
  value,
  onChange,
  optional = false,
  maximumDate,
  minimumDate,
}: DateFieldProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.rangeRow}>
      <View style={styles.filterFieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {optional && value ? (
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.linkText}>{t('common.clear')}</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        style={({ pressed }) => [styles.dateButton, pressed && styles.buttonPressed]}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.filterFieldHeader}>
          <Text style={[styles.dateButtonValue, optional && !value && styles.filterPlaceholder]}>
            {value
              ? formatDateLabel(toDateKey(value))
              : optional
                ? t('common.any')
                : t('dateField.selectDate')}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={colors.textSubtle} />
        </View>
      </Pressable>
      <DatePickerSheet
        visible={showPicker}
        value={value ?? getTodayDate()}
        title={label}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onClose={() => setShowPicker(false)}
        onConfirm={onChange}
      />
    </View>
  );
}
