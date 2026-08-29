import { createContext, ReactNode, useContext } from 'react';
import { useUserProfile } from '../hooks/use-user-profile';
import { HeightEntry } from '../types';

type UserProfileContextValue = {
  heightEntries: HeightEntry[];
  currentHeightCm: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isSaving: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateHeight: (heightCm: number) => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const value = useUserProfile();
  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useSharedUserProfile(): UserProfileContextValue {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useSharedUserProfile must be used within UserProfileProvider');
  }
  return context;
}
