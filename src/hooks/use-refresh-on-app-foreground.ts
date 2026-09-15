import { useEffect } from 'react';
import { AppState } from 'react-native';

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

      void refresh().catch(() => undefined);
    });

    return () => {
      subscription.remove();
    };
  }, [enabled, refresh]);
}
