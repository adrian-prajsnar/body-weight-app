import AsyncStorage from '@react-native-async-storage/async-storage';
import { exportAll } from './export';
import { WeightEntry } from './types';

const ENTRIES_KEY = '@body-weight/entries';

function sortEntries(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEntries(): Promise<WeightEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as WeightEntry[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortEntries(
      parsed.filter(
        (entry) =>
          typeof entry.date === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
          typeof entry.weightKg === 'number' &&
          Number.isFinite(entry.weightKg),
      ),
    );
  } catch {
    return [];
  }
}

async function persistEntries(entries: WeightEntry[]): Promise<void> {
  const sorted = sortEntries(entries);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(sorted));

  try {
    await exportAll(sorted);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backup export failed.';
    throw new Error(message);
  }
}

export async function saveEntry(date: string, weightKg: number): Promise<void> {
  const entries = await getEntries();
  const nextEntries = entries.filter((entry) => entry.date !== date);
  nextEntries.push({ date, weightKg });
  await persistEntries(nextEntries);
}

export async function deleteEntry(date: string): Promise<void> {
  const entries = await getEntries();
  await persistEntries(entries.filter((entry) => entry.date !== date));
}

export async function replaceEntries(entries: WeightEntry[]): Promise<void> {
  await persistEntries(entries);
}
