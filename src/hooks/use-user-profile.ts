import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../i18n';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { getCurrentHeight } from '../height';
import { getHeightEntries, saveHeight } from '../supabase/height-sync';
import { getTodayDate, toDateKey } from '../format';
import { HeightEntry } from '../types';

export function useUserProfile() {
  const { isAuthenticated } = useSupabaseAuth();
  const [heightEntries, setHeightEntries] = useState<HeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setHeightEntries([]);
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
      const loaded = await getHeightEntries();
      setHeightEntries(loaded);
      setError(null);
      hasLoadedRef.current = true;
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : t('errors.couldNotLoadProfile');
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const updateHeight = useCallback(
    async (heightCm: number) => {
      setIsSaving(true);
      try {
        const effectiveDate = toDateKey(getTodayDate());
        await saveHeight(effectiveDate, heightCm);
        await refreshProfile();
      } finally {
        setIsSaving(false);
      }
    },
    [refreshProfile],
  );

  const currentHeightCm = getCurrentHeight(heightEntries);

  return {
    heightEntries,
    currentHeightCm,
    isLoading,
    isRefreshing,
    isSaving,
    error,
    refreshProfile,
    updateHeight,
  };
}
