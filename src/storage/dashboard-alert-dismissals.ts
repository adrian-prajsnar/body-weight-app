import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@body-weight-app/dashboard-alert-dismissals';

export type DashboardAlertId = 'missingBirthDate' | 'missingHeight';

const VALID_IDS: DashboardAlertId[] = ['missingBirthDate', 'missingHeight'];

function isDashboardAlertId(value: string): value is DashboardAlertId {
  return VALID_IDS.includes(value as DashboardAlertId);
}

export async function getDismissedDashboardAlerts(): Promise<DashboardAlertId[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is DashboardAlertId => typeof item === 'string' && isDashboardAlertId(item));
  } catch {
    return [];
  }
}

export async function dismissDashboardAlert(id: DashboardAlertId): Promise<void> {
  const dismissed = await getDismissedDashboardAlerts();
  if (dismissed.includes(id)) {
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, id]));
}
