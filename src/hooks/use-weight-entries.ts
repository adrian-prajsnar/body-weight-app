import { useCallback, useEffect, useState } from 'react';
import { deleteEntry as deleteStoredEntry, getEntries } from '../storage';
import { WeightEntry } from '../types';

export function useWeightEntries() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshEntries = useCallback(async () => {
    const loaded = await getEntries();
    setEntries(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshEntries();
  }, [refreshEntries]);

  const removeEntry = useCallback(
    async (date: string) => {
      await deleteStoredEntry(date);
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
