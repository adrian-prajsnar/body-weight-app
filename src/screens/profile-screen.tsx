import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { AppCard } from '../components/app-card';
import { ErrorCard } from '../components/error-card';
import { ProfileDetailsSkeleton } from '../components/profile-details-skeleton';
import { ScreenHeader } from '../components/screen-header';
import { SegmentedControl, SegmentedOption } from '../components/segmented-control';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useToast } from '../context/toast-context';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import {
  formatHeightCm,
  heightCmToParts,
  HEIGHT_RANGE_MESSAGE,
  parseHeightCm,
} from '../format';
import { useSharedUserProfile } from '../context/user-profile-context';
import { ThemePreference } from '../storage/theme-preference';
import { useAppStyles } from '../theme/styles';
import { useColors, useTheme } from '../theme/theme-context';

const THEME_OPTIONS: SegmentedOption<ThemePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

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

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const styles = useAppStyles();
  const colors = useColors();

  return (
    <View style={styles.profileRow}>
      <View style={styles.profileRowIcon}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
      </View>
      <View style={styles.profileRowText}>
        <Text style={styles.accountLabel}>{label}</Text>
        <Text style={styles.accountValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const { preference, setPreference } = useTheme();
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
  const { scrollY, onScroll } = useScrollHeader();
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
      <ScreenHeader
        title="Profile"
        subtitle={user?.email ?? 'Your personal information'}
        scrollY={scrollY}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void refreshProfile()} />
        }
      >
        {error && !isLoading ? (
          <ErrorCard message={error} onRetry={() => void refreshProfile()} />
        ) : null}

        <AppCard title="Account" isBusy={isRefreshing || isSaving}>
          {isLoading ? (
            <ProfileDetailsSkeleton />
          ) : (
            <>
              <ProfileRow icon="mail-outline" label="Email" value={user?.email ?? '—'} />
              <ProfileRow
                icon="calendar-outline"
                label="Member since"
                value={formatMemberSince(user?.created_at)}
              />
              <ProfileRow
                icon="list-outline"
                label="Weight entries"
                value={entries.length === 1 ? '1 entry' : `${entries.length} entries`}
              />

              <View style={styles.divider} />

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
                        placeholderTextColor={colors.textSubtle}
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
                        placeholderTextColor={colors.textSubtle}
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
                    style={({ pressed }) => [
                      styles.primaryButton,
                      isSaving && styles.buttonDisabled,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => void handleSaveHeight()}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color={colors.onAccent} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Save height</Text>
                    )}
                  </Pressable>
                ) : null}
              </View>
            </>
          )}
        </AppCard>

        <AppCard title="Appearance" delay={60}>
          <Text style={styles.settingHint}>Choose how the app looks on this device.</Text>
          <SegmentedControl
            options={THEME_OPTIONS}
            value={preference}
            onChange={(next) => void setPreference(next)}
          />

          <View style={styles.divider} />

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
              trackColor={{ false: colors.borderStrong, true: colors.accentBorder }}
              thumbColor={canShowBmi && showBmi ? colors.accent : colors.surfaceMuted}
            />
          </View>
        </AppCard>

        <AppCard title="Session" delay={120}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={handleSignOut}
          >
            <Text style={styles.secondaryButtonText}>Sign out</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Delete account</Text>
          </Pressable>
        </AppCard>
      </Animated.ScrollView>
    </View>
  );
}
