import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@body-weight-app/still-growing';

export async function getStillGrowingPreference(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === 'true';
}

export async function setStillGrowingPreference(stillGrowing: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, stillGrowing ? 'true' : 'false');
}
