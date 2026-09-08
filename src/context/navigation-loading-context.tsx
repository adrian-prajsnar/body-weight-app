import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type NavigationLoadingContextValue = {
  isNavigationBlocked: boolean;
  setScreenLoading: (loading: boolean) => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextValue | null>(null);

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  const setScreenLoading = useCallback((loading: boolean) => {
    setIsNavigationBlocked(loading);
  }, []);

  const value = useMemo(
    () => ({
      isNavigationBlocked,
      setScreenLoading,
    }),
    [isNavigationBlocked, setScreenLoading],
  );

  return (
    <NavigationLoadingContext.Provider value={value}>{children}</NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within NavigationLoadingProvider');
  }
  return context;
}
