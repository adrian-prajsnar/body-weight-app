import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@body-weight-app/show-bmi';

export async function getShowBmiPreference(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  if (value === null) {
    return true;
  }
  return value === 'true';
}

export async function setShowBmiPreference(show: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, show ? 'true' : 'false');
}
