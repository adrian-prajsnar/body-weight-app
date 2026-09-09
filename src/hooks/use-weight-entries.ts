import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../i18n';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useRefreshOnAppForeground } from './use-refresh-on-app-foreground';
import { deleteEntry, getEntries } from '../supabase/weight-sync';
import { WeightEntry } from '../types';

export function useWeightEntries() {
  const { isAuthenticated, isLoading: isAuthLoading } = useSupabaseAuth();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingDate, setDeletingDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refreshEntries = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setEntries([]);
      setIsLoading(false);
      setIsRefreshing(false);
      setError(null);
      hasLoadedRef.current = false;
      return;
    }

    if (hasLoadedRef.current) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const loaded = await getEntries();
      setEntries(loaded);
      setError(null);
      hasLoadedRef.current = true;
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : t('errors.couldNotLoadEntries');
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries]);

  useRefreshOnAppForeground(refreshEntries, isAuthenticated);

  const removeEntry = useCallback(
    async (date: string) => {
      setDeletingDate(date);
    try {
      await deleteEntry(date);
      await refreshEntries();
    } catch (deleteError) {
      throw deleteError instanceof Error
        ? deleteError
        : new Error(t('history.deleteFailed'));
    } finally {
      setDeletingDate(null);
    }
    },
    [refreshEntries],
  );

  return {
    entries,
    isLoading,
    isRefreshing,
    deletingDate,
    error,
    refreshEntries,
    removeEntry,
  };
}
