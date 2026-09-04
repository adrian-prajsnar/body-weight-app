import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { useCallback, useState } from 'react';

function getIsOffline(
  isConnected: boolean | null,
  isInternetReachable: boolean | null,
): boolean {
  return isConnected === false || isInternetReachable === false;
}

export function useNetworkStatus() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await NetInfo.refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isChecking: isConnected === null,
    isOffline: getIsOffline(isConnected, isInternetReachable),
    isRefreshing,
    refresh,
  };
}
