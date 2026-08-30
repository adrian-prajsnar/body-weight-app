import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { configureCalendarLocale } from '../i18n/calendar-locale';
import { useTranslation } from '../i18n/language-context';
import { toDateKey } from '../format';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { fontFamily } from '../theme/tokens';

type DatePickerSheetProps = {
  visible: boolean;
  value: Date;
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function DatePickerSheet({
  visible,
  value,
  title,
  minimumDate,
  maximumDate,
  onClose,
  onConfirm,
}: DatePickerSheetProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const [selectedKey, setSelectedKey] = useState(toDateKey(value));

  useEffect(() => {
    if (visible) {
      setSelectedKey(toDateKey(value));
    }
  }, [value, visible]);

  useEffect(() => {
    configureCalendarLocale(locale);
  }, [locale]);

  const minDate = minimumDate ? toDateKey(minimumDate) : undefined;
  const maxDate = maximumDate ? toDateKey(maximumDate) : undefined;

  const markedDates = useMemo(
    () => ({
      [selectedKey]: {
        selected: true,
        selectedColor: colors.accent,
        selectedTextColor: colors.onAccent,
      },
    }),
    [colors.accent, colors.onAccent, selectedKey],
  );

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.surface,
      calendarBackground: colors.surface,
      textSectionTitleColor: colors.textMuted,
      textSectionTitleDisabledColor: colors.textSubtle,
      selectedDayBackgroundColor: colors.accent,
      selectedDayTextColor: colors.onAccent,
      todayTextColor: colors.accent,
      dayTextColor: colors.text,
      textDisabledColor: colors.textSubtle,
      monthTextColor: colors.text,
      arrowColor: colors.accent,
      disabledArrowColor: colors.textSubtle,
      dotColor: colors.accent,
      indicatorColor: colors.accent,
      textDayFontFamily: fontFamily.medium,
      textMonthFontFamily: fontFamily.semibold,
      textDayHeaderFontFamily: fontFamily.medium,
      textDayFontSize: 15,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 12,
    }),
    [colors],
  );

  const handleDayPress = (day: DateData) => {
    setSelectedKey(day.dateString);
  };

  const handleConfirm = () => {
    onConfirm(parseDateKey(selectedKey));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalSheetBackdrop}>
        <Pressable style={styles.modalSheetDismissArea} onPress={onClose} />
        <View
          style={[
            styles.datePickerSheet,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.datePickerSheetHeader}>
            <Text style={styles.datePickerSheetTitle}>
              {title ?? t('dateField.selectDate')}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}
              onPress={onClose}
              hitSlop={8}
              accessibilityLabel={t('common.cancel')}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <Calendar
            current={selectedKey}
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            enableSwipeMonths
            firstDay={locale === 'pl' ? 1 : 0}
            theme={calendarTheme}
          />
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              styles.datePickerSheetConfirm,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleConfirm}
          >
            <Text style={styles.primaryButtonText}>{t('common.done')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
