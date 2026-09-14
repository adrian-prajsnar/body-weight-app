import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatDateTime, formatHistoryTimestamp, wasWeightEntryUpdated } from '../format';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { WeightEntry } from '../types';

type HistoryEntryMetaProps = {
  entry: WeightEntry;
};

export function HistoryEntryMeta({ entry }: HistoryEntryMetaProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const createdLabel = formatHistoryTimestamp(entry.createdAt, entry.date);
  const createdA11y = formatDateTime(entry.createdAt);
  const showUpdated = wasWeightEntryUpdated(entry);
  const updatedLabel = formatHistoryTimestamp(entry.updatedAt, entry.date);
  const updatedA11y = formatDateTime(entry.updatedAt);

  return (
    <View style={styles.historyEntryMeta}>
      <View
        style={styles.historyEntryMetaItem}
        accessible
        accessibilityRole="text"
        accessibilityLabel={t('history.createdA11y', { date: createdA11y })}
      >
        <Ionicons name="time-outline" size={12} color={colors.textSubtle} />
        <Text style={styles.historyEntryMetaText}>{createdLabel}</Text>
      </View>
      {showUpdated ? (
        <View
          style={styles.historyEntryMetaItem}
          accessible
          accessibilityRole="text"
          accessibilityLabel={t('history.updatedA11y', { date: updatedA11y })}
        >
          <Ionicons name="sync-outline" size={12} color={colors.textSubtle} />
          <Text style={styles.historyEntryMetaText}>{updatedLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}
