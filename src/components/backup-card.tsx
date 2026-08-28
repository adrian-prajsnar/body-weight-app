import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  chooseBackupFolder,
  clearLocalBackupFolder,
  getBackupStatus,
  importFromFile,
} from '../export';
import {
  clearGoogleDriveAuth,
  downloadBackupFromGoogleDrive,
  getGoogleDriveConfig,
  getGoogleDriveScopes,
  isGoogleDriveConfigured,
  storeGoogleDriveTokens,
} from '../google-drive';
import { replaceEntries } from '../storage';
import { BackupStatus } from '../types';
import { styles } from '../theme/styles';

WebBrowser.maybeCompleteAuthSession();

type BackupCardProps = {
  onEntriesChanged: () => Promise<void>;
  warning?: string | null;
  onWarningChange?: (message: string | null) => void;
};

export function BackupCard({
  onEntriesChanged,
  warning,
  onWarningChange,
}: BackupCardProps) {
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    configured: false,
    googleDriveConnected: false,
  });

  const driveConfig = getGoogleDriveConfig();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: driveConfig.androidClientId,
    webClientId: driveConfig.webClientId,
    scopes: getGoogleDriveScopes(),
  });

  const refreshBackupStatus = useCallback(async () => {
    setBackupStatus(await getBackupStatus());
  }, []);

  useEffect(() => {
    void refreshBackupStatus();
  }, [refreshBackupStatus]);

  useEffect(() => {
    if (response?.type !== 'success' || !response.authentication?.accessToken) {
      return;
    }

    void (async () => {
      await storeGoogleDriveTokens({
        accessToken: response.authentication!.accessToken!,
        expiresIn: response.authentication!.expiresIn ?? undefined,
      });
      await clearLocalBackupFolder();
      await refreshBackupStatus();
      onWarningChange?.(null);
      Alert.alert('Google Drive', 'Connected. Backups will sync on every save.');
    })();
  }, [onWarningChange, refreshBackupStatus, response]);

  const handleConnectGoogleDrive = async () => {
    if (!isGoogleDriveConfigured()) {
      Alert.alert(
        'Google Drive setup required',
        'Add your Google OAuth client IDs to app.json under extra.androidClientId and extra.webClientId, then rebuild the app. See README for setup steps.',
      );
      return;
    }

    if (!request) {
      Alert.alert('Google Drive', 'Google sign-in is not ready yet. Try again in a moment.');
      return;
    }

    await promptAsync();
  };

  const handleDisconnectGoogleDrive = async () => {
    await clearGoogleDriveAuth();
    await refreshBackupStatus();
    onWarningChange?.(null);
    Alert.alert('Google Drive', 'Disconnected.');
  };

  const handleRestoreFromGoogleDrive = async () => {
    try {
      const imported = await downloadBackupFromGoogleDrive();
      await replaceEntries(imported);
      await onEntriesChanged();
      await refreshBackupStatus();
      onWarningChange?.(null);
      Alert.alert('Restore complete', `Restored ${imported.length} entries from Google Drive.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restore failed.';
      Alert.alert('Restore failed', message);
    }
  };

  const handleChooseBackupFolder = async () => {
    const selected = await chooseBackupFolder();
    if (!selected) {
      Alert.alert('Backup folder', 'Folder selection was cancelled.');
      return;
    }

    await refreshBackupStatus();
    onWarningChange?.(null);
    Alert.alert(
      'Local backup folder',
      'Folder updated. Use Downloads or another local folder — Google Drive folders are not supported here.',
    );
  };

  const handleImport = async () => {
    try {
      const imported = await importFromFile();
      await replaceEntries(imported);
      await onEntriesChanged();
      await refreshBackupStatus();
      onWarningChange?.(null);
      Alert.alert('Import complete', `Restored ${imported.length} entries.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed.';
      if (message !== 'Import cancelled.') {
        Alert.alert('Import failed', message);
      }
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Backup</Text>

      <Text style={styles.statsText}>
        Google Drive: {backupStatus.googleDriveConnected ? 'connected' : 'not connected'}
      </Text>
      <Text style={styles.statsText}>
        Local folder: {backupStatus.configured ? 'configured' : 'not set'}
      </Text>
      <Text style={styles.statsText}>
        Last export:{' '}
        {backupStatus.lastExportAt
          ? new Date(backupStatus.lastExportAt).toLocaleString()
          : 'never'}
      </Text>

      {warning ? <Text style={styles.warningText}>{warning}</Text> : null}

      <View style={styles.backupRow}>
        {backupStatus.googleDriveConnected ? (
          <>
            <Pressable style={styles.secondaryButton} onPress={() => void handleRestoreFromGoogleDrive()}>
              <Text style={styles.secondaryButtonText}>Restore from Drive</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => void handleDisconnectGoogleDrive()}>
              <Text style={styles.secondaryButtonText}>Disconnect Drive</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={() => void handleConnectGoogleDrive()}>
            <Text style={styles.secondaryButtonText}>Connect Google Drive</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryButton} onPress={() => void handleChooseBackupFolder()}>
          <Text style={styles.secondaryButtonText}>Local folder</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => void handleImport()}>
          <Text style={styles.secondaryButtonText}>Import file</Text>
        </Pressable>
      </View>
    </View>
  );
}
