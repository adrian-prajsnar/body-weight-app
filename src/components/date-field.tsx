import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

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
        maximumDate,
        minimumDate,
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
        {optional && value ? (
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.linkText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        style={({ pressed }) => [styles.dateButton, pressed && styles.buttonPressed]}
        onPress={openPicker}
      >
        <View style={styles.filterFieldHeader}>
          <Text style={[styles.dateButtonValue, optional && !value && styles.filterPlaceholder]}>
            {value ? formatDateLabel(toDateKey(value)) : optional ? 'Any' : 'Select date'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={colors.textSubtle} />
        </View>
      </Pressable>
      {showPicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={value ?? getTodayDate()}
          mode="date"
          display="spinner"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
