import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { formatDateLabel, getTodayDate, toDateKey } from '../format';
import { styles } from '../theme/styles';

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
      <Pressable style={styles.dateButton} onPress={openPicker}>
        <Text style={[styles.dateButtonValue, optional && !value && styles.filterPlaceholder]}>
          {value ? formatDateLabel(toDateKey(value)) : optional ? 'Any' : 'Select date'}
        </Text>
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
