import { Alert, ScrollView, View } from 'react-native';
import { HistoryList } from '../components/history-list';
import { ScreenHeader } from '../components/screen-header';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { formatDateLabel } from '../format';
import { styles } from '../theme/styles';

export function HistoryScreen() {
  const { entries, removeEntry } = useSharedWeightEntries();

  const handleDelete = (date: string) => {
    Alert.alert('Delete entry', `Remove the entry for ${formatDateLabel(date)}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await removeEntry(date);
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Backup export failed.';
              Alert.alert('Delete failed', `Deleted in app, but backup failed: ${message}`);
            }
          })();
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="History" subtitle="All logged entries" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <HistoryList entries={entries} onDelete={handleDelete} />
        </View>
      </ScrollView>
    </View>
  );
}
