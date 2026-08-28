import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { WeightBackup, WeightEntry } from './types';

const TOKEN_KEY = '@body-weight/google-access-token';
const EXPIRES_KEY = '@body-weight/google-expires-at';
const FILE_ID_KEY = '@body-weight/google-drive-file-id';
const BACKUP_FILE_NAME = 'body-weight-backup.json';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

type GoogleAuthTokens = {
  accessToken: string;
  expiresIn?: number;
};

type GoogleDriveConfig = {
  androidClientId?: string;
  webClientId?: string;
};

function sortEntries(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

function buildBackup(entries: WeightEntry[]): WeightBackup {
  return {
    exportedAt: new Date().toISOString(),
    entries: sortEntries(entries),
  };
}

export function getGoogleDriveConfig(): GoogleDriveConfig {
  const extra = Constants.expoConfig?.extra as GoogleDriveConfig | undefined;
  return {
    androidClientId: extra?.androidClientId,
    webClientId: extra?.webClientId,
  };
}

export function isGoogleDriveConfigured(): boolean {
  const config = getGoogleDriveConfig();
  return Boolean(config.androidClientId || config.webClientId);
}

export function getGoogleDriveScopes(): string[] {
  return [DRIVE_SCOPE];
}

export async function storeGoogleDriveTokens(tokens: GoogleAuthTokens): Promise<void> {
  const expiresIn = tokens.expiresIn ?? 3600;
  await AsyncStorage.setItem(TOKEN_KEY, tokens.accessToken);
  await AsyncStorage.setItem(EXPIRES_KEY, String(Date.now() + expiresIn * 1000));
}

export async function clearGoogleDriveAuth(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, EXPIRES_KEY, FILE_ID_KEY]);
}

export async function isGoogleDriveConnected(): Promise<boolean> {
  return (await getGoogleDriveAccessToken()) !== null;
}

export async function getGoogleDriveAccessToken(): Promise<string | null> {
  const [token, expiresAt] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(EXPIRES_KEY),
  ]);

  if (!token || !expiresAt) {
    return null;
  }

  if (Date.now() >= Number(expiresAt)) {
    return null;
  }

  return token;
}

async function getOrFindDriveFileId(token: string): Promise<string | null> {
  const storedFileId = await AsyncStorage.getItem(FILE_ID_KEY);
  if (storedFileId) {
    return storedFileId;
  }

  const query = encodeURIComponent(`name='${BACKUP_FILE_NAME}' and trashed=false`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { files?: { id: string }[] };
  const fileId = data.files?.[0]?.id;
  if (!fileId) {
    return null;
  }

  await AsyncStorage.setItem(FILE_ID_KEY, fileId);
  return fileId;
}

async function uploadContent(token: string, fileId: string, payload: string): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: payload,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to upload backup to Google Drive.');
  }
}

async function createDriveFile(token: string, payload: string): Promise<string> {
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: BACKUP_FILE_NAME,
      mimeType: 'application/json',
    }),
  });

  if (!createResponse.ok) {
    throw new Error('Failed to create Google Drive backup file.');
  }

  const created = (await createResponse.json()) as { id?: string };
  if (!created.id) {
    throw new Error('Failed to create Google Drive backup file.');
  }

  await uploadContent(token, created.id, payload);
  await AsyncStorage.setItem(FILE_ID_KEY, created.id);
  return created.id;
}

export async function uploadBackupToGoogleDrive(entries: WeightEntry[]): Promise<void> {
  const token = await getGoogleDriveAccessToken();
  if (!token) {
    throw new Error('Google Drive not connected. Sign in again.');
  }

  const payload = JSON.stringify(buildBackup(entries), null, 2);
  const fileId = await getOrFindDriveFileId(token);

  if (fileId) {
    try {
      await uploadContent(token, fileId, payload);
      return;
    } catch {
      await AsyncStorage.removeItem(FILE_ID_KEY);
    }
  }

  await createDriveFile(token, payload);
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

export async function downloadBackupFromGoogleDrive(): Promise<WeightEntry[]> {
  const token = await getGoogleDriveAccessToken();
  if (!token) {
    throw new Error('Google Drive not connected. Sign in again.');
  }

  const fileId = await getOrFindDriveFileId(token);
  if (!fileId) {
    throw new Error('No Google Drive backup found.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download Google Drive backup.');
  }

  return parseBackup(await response.text());
}
