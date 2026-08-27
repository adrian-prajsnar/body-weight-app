import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync, StorageAccessFramework } from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { BackupStatus, WeightBackup, WeightEntry } from './types';

const BACKUP_DIR_URI_KEY = '@body-weight/backup-dir-uri';
const BACKUP_FILE_URI_KEY = '@body-weight/backup-file-uri';
const LAST_EXPORT_AT_KEY = '@body-weight/last-export-at';
const BACKUP_FILE_NAME = 'body-weight-backup';

function sortEntries(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

function buildBackup(entries: WeightEntry[]): WeightBackup {
  return {
    exportedAt: new Date().toISOString(),
    entries: sortEntries(entries),
  };
}

function parseBackup(raw: string): WeightEntry[] {
  const parsed = JSON.parse(raw) as WeightBackup;
  if (!parsed || !Array.isArray(parsed.entries)) {
    throw new Error('Invalid backup file format.');
  }

  return sortEntries(
    parsed.entries.filter(
      (entry) =>
        typeof entry.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
        typeof entry.weightKg === 'number' &&
        Number.isFinite(entry.weightKg),
    ),
  );
}

async function findBackupFileUri(directoryUri: string): Promise<string | null> {
  const files = await StorageAccessFramework.readDirectoryAsync(directoryUri);
  const match = files.find((uri) => decodeURIComponent(uri).includes(BACKUP_FILE_NAME));
  return match ?? null;
}

export async function getBackupStatus(): Promise<BackupStatus> {
  const [directoryUri, lastExportAt] = await Promise.all([
    AsyncStorage.getItem(BACKUP_DIR_URI_KEY),
    AsyncStorage.getItem(LAST_EXPORT_AT_KEY),
  ]);

  return {
    configured: Boolean(directoryUri),
    lastExportAt: lastExportAt ?? undefined,
  };
}

export async function chooseBackupFolder(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted || !permissions.directoryUri) {
    return false;
  }

  await AsyncStorage.setItem(BACKUP_DIR_URI_KEY, permissions.directoryUri);
  await AsyncStorage.removeItem(BACKUP_FILE_URI_KEY);
  return true;
}

async function resolveBackupFileUri(directoryUri: string): Promise<string> {
  const storedFileUri = await AsyncStorage.getItem(BACKUP_FILE_URI_KEY);
  if (storedFileUri) {
    return storedFileUri;
  }

  const existingFileUri = await findBackupFileUri(directoryUri);
  if (existingFileUri) {
    await AsyncStorage.setItem(BACKUP_FILE_URI_KEY, existingFileUri);
    return existingFileUri;
  }

  const createdFileUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    BACKUP_FILE_NAME,
    'application/json',
  );
  await AsyncStorage.setItem(BACKUP_FILE_URI_KEY, createdFileUri);
  return createdFileUri;
}

export async function exportAll(entries: WeightEntry[]): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  let directoryUri = await AsyncStorage.getItem(BACKUP_DIR_URI_KEY);
  if (!directoryUri) {
    const selected = await chooseBackupFolder();
    if (!selected) {
      throw new Error('Backup folder not selected.');
    }
    directoryUri = await AsyncStorage.getItem(BACKUP_DIR_URI_KEY);
    if (!directoryUri) {
      throw new Error('Backup folder not configured.');
    }
  }

  const payload = JSON.stringify(buildBackup(entries), null, 2);
  const fileUri = await resolveBackupFileUri(directoryUri);

  try {
    await StorageAccessFramework.writeAsStringAsync(fileUri, payload, {
      encoding: 'utf8',
    });
  } catch {
    await AsyncStorage.removeItem(BACKUP_FILE_URI_KEY);
    const refreshedFileUri = await resolveBackupFileUri(directoryUri);
    await StorageAccessFramework.writeAsStringAsync(refreshedFileUri, payload, {
      encoding: 'utf8',
    });
  }

  await AsyncStorage.setItem(LAST_EXPORT_AT_KEY, new Date().toISOString());
}

export async function importFromFile(): Promise<WeightEntry[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    throw new Error('Import cancelled.');
  }

  const raw = await readAsStringAsync(result.assets[0].uri);
  return parseBackup(raw);
}
