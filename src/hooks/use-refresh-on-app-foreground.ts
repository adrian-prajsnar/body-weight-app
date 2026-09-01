import { useEffect } from 'react';
import { AppState } from 'react-native';
import { refreshSessionOnForeground } from '../supabase/app-lifecycle';

export function useRefreshOnAppForeground(
  refresh: () => Promise<void>,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }

      void refreshSessionOnForeground().then(refresh);
    });

    return () => {
      subscription.remove();
    };
  }, [enabled, refresh]);
}
