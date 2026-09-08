import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { useNavigationLoading } from '../context/navigation-loading-context';

export function useScreenLoading(isLoading: boolean) {
  const isFocused = useIsFocused();
  const { setScreenLoading } = useNavigationLoading();

  useEffect(() => {
    if (!isFocused) {
      setScreenLoading(false);
      return;
    }

    setScreenLoading(isLoading);
  }, [isFocused, isLoading, setScreenLoading]);
}
