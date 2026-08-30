import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { EntryForm } from '../components/entry-form';
import { ErrorCard } from '../components/error-card';
import { HeroWeightCard } from '../components/hero-weight-card';
import { HistoryList } from '../components/history-list';
import { HistoryListSkeleton } from '../components/history-list-skeleton';
import { PeriodSelector } from '../components/period-selector';
import { ScreenHeader } from '../components/screen-header';
import { StatsSummary } from '../components/stats-summary';
import { StatsSummarySkeleton } from '../components/stats-summary-skeleton';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { RootTabParamList } from '../navigation/types';
import { formatDateRange } from '../format';
import {
  getDashboardPeriodRange,
  getLast7DaysEntries,
  getStatsForRange,
} from '../stats';
import { DashboardPeriod } from '../types';
import { useAppStyles } from '../theme/styles';

type Props = BottomTabScreenProps<RootTabParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const styles = useAppStyles();
  const { entries, isLoading, isRefreshing, error, refreshEntries } = useSharedWeightEntries();
  const { scrollY, onScroll } = useScrollHeader();
  const [period, setPeriod] = useState<DashboardPeriod>('thisWeek');

  const range = useMemo(() => getDashboardPeriodRange(period), [period]);
  const stats = useMemo(() => getStatsForRange(entries, range), [entries, range]);
  const recentEntries = useMemo(() => getLast7DaysEntries(entries), [entries]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Overview"
        subtitle="Track how your weight is trending"
        scrollY={scrollY}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshEntries()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshEntries()} />
        ) : null}

        <HeroWeightCard entries={entries} isLoading={isLoading} isBusy={isRefreshing} />

        <EntryForm entries={entries} onSaved={refreshEntries} isDataLoading={isLoading} />

        <AppCard
          title="Averages"
          subtitle={formatDateRange(range)}
          isBusy={isRefreshing}
          delay={120}
        >
          <PeriodSelector selected={period} onSelect={setPeriod} />
          {isLoading ? (
            <StatsSummarySkeleton />
          ) : (
            <StatsSummary stats={stats} entries={entries} range={range} />
          )}
        </AppCard>

        <AppCard
          title="Recent history"
          subtitle="Last 7 days"
          isBusy={isRefreshing}
          delay={180}
          right={
            <Pressable onPress={() => navigation.navigate('History')} hitSlop={8}>
              <Text style={styles.linkText}>View all</Text>
            </Pressable>
          }
        >
          {isLoading ? (
            <HistoryListSkeleton rows={3} />
          ) : (
            <HistoryList
              entries={recentEntries}
              emptyMessage="Nothing logged in the last 7 days."
            />
          )}
        </AppCard>
      </Animated.ScrollView>
    </View>
  );
}
