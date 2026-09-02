import { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../i18n';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useRefreshOnAppForeground } from './use-refresh-on-app-foreground';
import { getCurrentHeight } from '../height';
import { getUserProfile, saveUserProfile } from '../supabase/profile-sync';
import { getHeightEntries, saveHeight, deleteHeight } from '../supabase/height-sync';
import { BiologicalSex, HeightEntry } from '../types';

export function useUserProfile() {
  const { isAuthenticated } = useSupabaseAuth();
  const [heightEntries, setHeightEntries] = useState<HeightEntry[]>([]);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingEffectiveDate, setDeletingEffectiveDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setHeightEntries([]);
      setBirthDate(null);
      setSex(null);
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
      const [loaded, profile] = await Promise.all([getHeightEntries(), getUserProfile()]);
      setHeightEntries(loaded);
      setBirthDate(profile.birthDate);
      setSex(profile.sex);
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

  const persistProfile = useCallback(
    async (nextBirthDate: string | null, nextSex: BiologicalSex | null) => {
      setIsSaving(true);
      try {
        await saveUserProfile({ birthDate: nextBirthDate, sex: nextSex });
        setBirthDate(nextBirthDate);
        setSex(nextSex);
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

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

  const saveBirthDateEntry = useCallback(
    async (nextBirthDate: string | null) => {
      await persistProfile(nextBirthDate, sex);
    },
    [persistProfile, sex],
  );

  const saveSexEntry = useCallback(
    async (nextSex: BiologicalSex | null) => {
      await persistProfile(birthDate, nextSex);
    },
    [persistProfile, birthDate],
  );

  const currentHeightCm = getCurrentHeight(heightEntries);

  return {
    heightEntries,
    birthDate,
    sex,
    currentHeightCm,
    isLoading,
    isRefreshing,
    isSaving,
    deletingEffectiveDate,
    error,
    refreshProfile,
    saveBirthDateEntry,
    saveSexEntry,
    saveHeightEntry,
    updateHeightEntry,
    removeHeightEntry,
  };
}
