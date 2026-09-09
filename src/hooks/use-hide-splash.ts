import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { useSupabaseAuth } from '../context/supabase-auth-context';

export function useHideSplashWhenReady(fontsLoaded: boolean) {
  const { isLoading: isAuthLoading } = useSupabaseAuth();
  const hasHiddenRef = useRef(false);

  useEffect(() => {
    if (!fontsLoaded || isAuthLoading || hasHiddenRef.current) {
      return;
    }

    hasHiddenRef.current = true;
    void SplashScreen.hideAsync();
  }, [fontsLoaded, isAuthLoading]);
}
