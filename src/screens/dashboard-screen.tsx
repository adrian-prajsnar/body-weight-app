import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { EntryForm } from '../components/entry-form';
import { HistoryList } from '../components/history-list';
import { PeriodSelector } from '../components/period-selector';
import { ScreenHeader } from '../components/screen-header';
import { StatsSummary } from '../components/stats-summary';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { RootTabParamList } from '../navigation/types';
import { formatDateRange } from '../format';
import {
  getDashboardPeriodRange,
  getLast7DaysEntries,
  getStatsForRange,
} from '../stats';
import { DashboardPeriod } from '../types';
import { styles } from '../theme/styles';

type Props = BottomTabScreenProps<RootTabParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const { entries, refreshEntries } = useSharedWeightEntries();
  const [period, setPeriod] = useState<DashboardPeriod>('thisWeek');

  const range = useMemo(() => getDashboardPeriodRange(period), [period]);
  const stats = useMemo(() => getStatsForRange(entries, range), [entries, range]);
  const recentEntries = useMemo(() => getLast7DaysEntries(entries), [entries]);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Body Weight Tracker" subtitle="Log and review your weight" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <EntryForm entries={entries} onSaved={refreshEntries} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Average</Text>
          <PeriodSelector selected={period} onSelect={setPeriod} />
          <Text style={styles.statsText}>Period: {formatDateRange(range)}</Text>
          <StatsSummary stats={stats} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent history</Text>
          <Text style={styles.statsText}>Last 7 days</Text>
          <HistoryList entries={recentEntries} />
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.primaryButtonText}>View all history</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
