import { useCallback, useEffect, useState } from 'react';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { deleteEntry, getEntries } from '../supabase/weight-sync';
import { WeightEntry } from '../types';

export function useWeightEntries() {
  const { isAuthenticated } = useSupabaseAuth();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshEntries = useCallback(async () => {
    if (!isAuthenticated) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loaded = await getEntries();
      setEntries(loaded);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries]);

  const removeEntry = useCallback(
    async (date: string) => {
      await deleteEntry(date);
      await refreshEntries();
    },
    [refreshEntries],
  );

  return {
    entries,
    isLoading,
    refreshEntries,
    removeEntry,
  };
}
