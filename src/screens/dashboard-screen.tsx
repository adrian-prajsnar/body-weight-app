import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { EntryForm } from '../components/entry-form';
import { ErrorCard } from '../components/error-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { LoadingCardOverlay } from '../components/loading-card-overlay';
import { PeriodSelector } from '../components/period-selector';
import { ScreenHeader } from '../components/screen-header';
import { StatsSummary } from '../components/stats-summary';
import { StatsSummarySkeleton } from '../components/stats-summary-skeleton';
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
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const [period, setPeriod] = useState<DashboardPeriod>('thisWeek');

  const range = useMemo(() => getDashboardPeriodRange(period), [period]);
  const stats = useMemo(() => getStatsForRange(entries, range), [entries, range]);
  const recentEntries = useMemo(() => getLast7DaysEntries(entries), [entries]);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Body Weight Tracker" subtitle="Log and review your weight" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshEntries()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshEntries()} />
        ) : null}

        <EntryForm entries={entries} onSaved={refreshEntries} isDataLoading={isLoading} />

        <View style={styles.loadingCard}>
          {isRefreshing ? <LoadingCardOverlay /> : null}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Average</Text>
            <PeriodSelector selected={period} onSelect={setPeriod} />
            <Text style={styles.statsText}>Period: {formatDateRange(range)}</Text>
            {isLoading ? (
              <StatsSummarySkeleton />
            ) : (
              <StatsSummary stats={stats} entries={entries} range={range} />
            )}
          </View>
        </View>

        <View style={styles.loadingCard}>
          {isRefreshing ? <LoadingCardOverlay /> : null}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent history</Text>
            <Text style={styles.statsText}>Last 7 days</Text>
            {isLoading ? (
              <HistoryListSkeleton rows={3} />
            ) : (
              <HistoryList entries={recentEntries} />
            )}
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate('History')}
            >
              <Text style={styles.primaryButtonText}>View all history</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
