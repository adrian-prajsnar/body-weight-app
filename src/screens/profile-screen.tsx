import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ErrorCard } from '../components/error-card';
import { ProfileDetailsSkeleton } from '../components/profile-details-skeleton';
import { LoadingCardOverlay } from '../components/loading-card-overlay';
import { ScreenHeader } from '../components/screen-header';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useToast } from '../context/toast-context';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import {
  formatHeightCm,
  heightCmToParts,
  HEIGHT_RANGE_MESSAGE,
  parseHeightCm,
} from '../format';
import { useSharedUserProfile } from '../context/user-profile-context';
import { styles } from '../theme/styles';

function formatMemberSince(isoDate: string | undefined): string {
  if (!isoDate) {
    return '—';
  }

  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.accountRow}>
      <Text style={styles.accountLabel}>{label}</Text>
      <Text style={styles.accountValue}>{value}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const { session, signOut, deleteAccount } = useSupabaseAuth();
  const { entries } = useSharedWeightEntries();
  const {
    currentHeightCm,
    isLoading,
    isRefreshing,
    isSaving,
    error,
    refreshProfile,
    updateHeight,
  } = useSharedUserProfile();
  const { showBmi, setShowBmi } = useSharedBmiDisplay();
  const { showError, showInfo, showSuccess } = useToast();
  const user = session?.user;
  const canShowBmi = currentHeightCm !== null;

  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [metersInput, setMetersInput] = useState('');
  const [centimetersInput, setCentimetersInput] = useState('');

  const startEditingHeight = () => {
    const parts = heightCmToParts(currentHeightCm);
    setMetersInput(parts.meters);
    setCentimetersInput(parts.centimeters);
    setIsEditingHeight(true);
  };

  const cancelEditingHeight = () => {
    setIsEditingHeight(false);
    setMetersInput('');
    setCentimetersInput('');
  };

  const handleSaveHeight = async () => {
    const heightCm = parseHeightCm(metersInput, centimetersInput);
    if (heightCm === null) {
      showError(HEIGHT_RANGE_MESSAGE);
      return;
    }

    try {
      await updateHeight(heightCm);
      setIsEditingHeight(false);
      showSuccess('Height saved.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Save failed.';
      showError(message);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await signOut();
              showInfo('Signed out.');
            } catch (signOutError) {
              const message =
                signOutError instanceof Error ? signOutError.message : 'Sign out failed.';
              showError(message);
            }
          })();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account, profile, and all weight entries. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await deleteAccount();
                showSuccess('Account deleted.');
              } catch (deleteError) {
                const message =
                  deleteError instanceof Error ? deleteError.message : 'Could not delete account.';
                showError(message);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Profile" subtitle="Your personal information" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshProfile()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshProfile()} />
        ) : null}

        <View style={styles.loadingCard}>
          {isRefreshing || isSaving ? <LoadingCardOverlay /> : null}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile</Text>
            {isLoading ? (
              <ProfileDetailsSkeleton />
            ) : (
              <>
                <ProfileRow label="Email" value={user?.email ?? '—'} />
                <ProfileRow label="Member since" value={formatMemberSince(user?.created_at)} />
                <ProfileRow
                  label="Weight entries"
                  value={entries.length === 1 ? '1 entry' : `${entries.length} entries`}
                />

                <View style={styles.accountRow}>
                  <View style={styles.filterFieldHeader}>
                    <Text style={styles.accountLabel}>Height</Text>
                    {!isEditingHeight ? (
                      <Pressable onPress={startEditingHeight} hitSlop={8} disabled={isSaving}>
                        <Text style={styles.linkText}>
                          {currentHeightCm === null ? 'Add' : 'Edit'}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable onPress={cancelEditingHeight} hitSlop={8} disabled={isSaving}>
                        <Text style={styles.linkText}>Cancel</Text>
                      </Pressable>
                    )}
                  </View>

                  {isEditingHeight ? (
                    <View style={styles.heightInputRow}>
                      <View style={styles.heightInputGroup}>
                        <Text style={styles.fieldLabel}>Meters</Text>
                        <TextInput
                          style={styles.input}
                          value={metersInput}
                          onChangeText={setMetersInput}
                          keyboardType="number-pad"
                          placeholder="1"
                          placeholderTextColor="#9CA3AF"
                          maxLength={2}
                          editable={!isSaving}
                        />
                      </View>
                      <View style={styles.heightInputGroup}>
                        <Text style={styles.fieldLabel}>Centimeters</Text>
                        <TextInput
                          style={styles.input}
                          value={centimetersInput}
                          onChangeText={setCentimetersInput}
                          keyboardType="number-pad"
                          placeholder="75"
                          placeholderTextColor="#9CA3AF"
                          maxLength={2}
                          editable={!isSaving}
                        />
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.accountValue}>{formatHeightCm(currentHeightCm)}</Text>
                  )}

                  {isEditingHeight ? (
                    <Pressable
                      style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
                      onPress={() => void handleSaveHeight()}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.primaryButtonText}>Save height</Text>
                      )}
                    </Pressable>
                  ) : null}
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Display</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Show BMI on weight records</Text>
              <Text style={styles.settingHint}>
                {canShowBmi
                  ? 'BMI uses your height on each entry date.'
                  : 'Add your height above to enable BMI labels.'}
              </Text>
            </View>
            <Switch
              value={canShowBmi && showBmi}
              onValueChange={(value) => {
                void setShowBmi(value);
              }}
              disabled={!canShowBmi}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={canShowBmi && showBmi ? '#2563EB' : '#F9FAFB'}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>
          <Pressable style={styles.secondaryButton} onPress={handleSignOut}>
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Text style={styles.dangerButtonText}>Delete account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
