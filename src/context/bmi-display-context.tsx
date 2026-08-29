import { createContext, ReactNode, useContext } from 'react';
import { useBmiDisplayPreference } from '../hooks/use-bmi-display-preference';

type BmiDisplayContextValue = {
  showBmi: boolean;
  isLoading: boolean;
  setShowBmi: (value: boolean) => Promise<void>;
};

const BmiDisplayContext = createContext<BmiDisplayContextValue | null>(null);

export function BmiDisplayProvider({ children }: { children: ReactNode }) {
  const value = useBmiDisplayPreference();
  return <BmiDisplayContext.Provider value={value}>{children}</BmiDisplayContext.Provider>;
}

export function useSharedBmiDisplay(): BmiDisplayContextValue {
  const context = useContext(BmiDisplayContext);
  if (!context) {
    throw new Error('useSharedBmiDisplay must be used within BmiDisplayProvider');
  }
  return context;
}
