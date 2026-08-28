import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync, StorageAccessFramework } from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import {
  isGoogleDriveConnected,
  uploadBackupToGoogleDrive,
} from './google-drive';
import { BackupStatus, WeightBackup, WeightEntry } from './types';

const BACKUP_DIR_URI_KEY = '@body-weight/backup-dir-uri';
const BACKUP_FILE_URI_KEY = '@body-weight/backup-file-uri';
const LAST_EXPORT_AT_KEY = '@body-weight/last-export-at';
const BACKUP_FILE_NAME = 'body-weight-backup';

const CLOUD_FOLDER_MESSAGE =
  'Google Drive folders are not supported via folder picker. Connect Google Drive instead, or choose a local folder such as Downloads.';

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
  try {
    const files = await StorageAccessFramework.readDirectoryAsync(directoryUri);
    const match = files.find((uri) => decodeURIComponent(uri).includes(BACKUP_FILE_NAME));
    return match ?? null;
  } catch {
    return null;
  }
}

async function createBackupFileUri(directoryUri: string): Promise<string> {
  try {
    const createdFileUri = await StorageAccessFramework.createFileAsync(
      directoryUri,
      BACKUP_FILE_NAME,
      'application/json',
    );
    await AsyncStorage.setItem(BACKUP_FILE_URI_KEY, createdFileUri);
    return createdFileUri;
  } catch {
    throw new Error(CLOUD_FOLDER_MESSAGE);
  }
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

  return createBackupFileUri(directoryUri);
}

async function exportToLocalFolder(entries: WeightEntry[]): Promise<void> {
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
    const refreshedFileUri = await createBackupFileUri(directoryUri);
    await StorageAccessFramework.writeAsStringAsync(refreshedFileUri, payload, {
      encoding: 'utf8',
    });
  }
}

export async function getBackupStatus(): Promise<BackupStatus> {
  const [directoryUri, lastExportAt, googleDriveConnected] = await Promise.all([
    AsyncStorage.getItem(BACKUP_DIR_URI_KEY),
    AsyncStorage.getItem(LAST_EXPORT_AT_KEY),
    isGoogleDriveConnected(),
  ]);

  return {
    configured: Boolean(directoryUri),
    googleDriveConnected,
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

export async function clearLocalBackupFolder(): Promise<void> {
  await AsyncStorage.multiRemove([BACKUP_DIR_URI_KEY, BACKUP_FILE_URI_KEY]);
}

export async function exportAll(entries: WeightEntry[]): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  if (await isGoogleDriveConnected()) {
    await uploadBackupToGoogleDrive(entries);
    await AsyncStorage.setItem(LAST_EXPORT_AT_KEY, new Date().toISOString());
    return;
  }

  const directoryUri = await AsyncStorage.getItem(BACKUP_DIR_URI_KEY);
  if (!directoryUri) {
    throw new Error('No backup configured. Connect Google Drive or choose a local folder.');
  }

  await exportToLocalFolder(entries);
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
