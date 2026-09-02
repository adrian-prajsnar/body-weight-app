import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import {
  BmiDetailsModal,
  BmiDetailsPayload,
  PeriodBmiDetails,
  WeighInBmiDetails,
} from '../components/bmi-details-modal';
import { useAppStyles } from '../theme/styles';

type BmiDetailsContextValue = {
  openWeighIn: (details: Omit<WeighInBmiDetails, 'type'>) => void;
  openPeriod: (details: Omit<PeriodBmiDetails, 'type'>) => void;
};

const BmiDetailsContext = createContext<BmiDetailsContextValue | null>(null);

export function BmiDetailsProvider({ children }: { children: ReactNode }) {
  const styles = useAppStyles();
  const [details, setDetails] = useState<BmiDetailsPayload | null>(null);

  const openWeighIn = useCallback((payload: Omit<WeighInBmiDetails, 'type'>) => {
    setDetails({ type: 'weighIn', ...payload });
  }, []);

  const openPeriod = useCallback((payload: Omit<PeriodBmiDetails, 'type'>) => {
    setDetails({ type: 'period', ...payload });
  }, []);

  const close = useCallback(() => {
    setDetails(null);
  }, []);

  return (
    <BmiDetailsContext.Provider value={{ openWeighIn, openPeriod }}>
      <View style={styles.overlayRoot}>
        {children}
        <BmiDetailsModal details={details} onClose={close} />
      </View>
    </BmiDetailsContext.Provider>
  );
}

export function useBmiDetails(): BmiDetailsContextValue {
  const context = useContext(BmiDetailsContext);
  if (!context) {
    throw new Error('useBmiDetails must be used within BmiDetailsProvider');
  }
  return context;
}
