import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../i18n';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useRefreshOnAppForeground } from './use-refresh-on-app-foreground';
import { getCurrentHeight } from '../height';
import { getHeightEntries, saveFixedHeight, saveHeight, deleteHeight } from '../supabase/height-sync';
import { HeightEntry } from '../types';

export function useUserProfile() {
  const { isAuthenticated } = useSupabaseAuth();
  const [heightEntries, setHeightEntries] = useState<HeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEffectiveDate, setDeletingEffectiveDate] = useState<string | null>(null);
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

  useRefreshOnAppForeground(refreshProfile, isAuthenticated);

  const saveHeightEntry = useCallback(
    async (effectiveDate: string, heightCm: number) => {
      setIsSaving(true);
      try {
        await saveHeight(effectiveDate, heightCm);
        await refreshProfile();
      } finally {
        setIsSaving(false);
      }
    },
    [refreshProfile],
  );

  const saveFixedHeightEntry = useCallback(
    async (heightCm: number) => {
      setIsSaving(true);
      try {
        await saveFixedHeight(heightCm);
        await refreshProfile();
      } finally {
        setIsSaving(false);
      }
    },
    [refreshProfile],
  );

  const updateHeightEntry = useCallback(
    async (previousEffectiveDate: string, effectiveDate: string, heightCm: number) => {
      setIsSaving(true);
      try {
        if (previousEffectiveDate !== effectiveDate) {
          await deleteHeight(previousEffectiveDate);
        }
        await saveHeight(effectiveDate, heightCm);
        await refreshProfile();
      } finally {
        setIsSaving(false);
      }
    },
    [refreshProfile],
  );

  const removeHeightEntry = useCallback(
    async (effectiveDate: string) => {
      setDeletingEffectiveDate(effectiveDate);
      try {
        await deleteHeight(effectiveDate);
        await refreshProfile();
      } catch (deleteError) {
        throw deleteError instanceof Error
          ? deleteError
          : new Error(t('profile.deleteHeightFailed'));
      } finally {
        setDeletingEffectiveDate(null);
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
    deletingEffectiveDate,
    error,
    refreshProfile,
    saveHeightEntry,
    saveFixedHeightEntry,
    updateHeightEntry,
    removeHeightEntry,
  };
}
