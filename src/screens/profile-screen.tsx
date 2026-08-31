import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useEffect } from 'react';
import {
  ActivityIndicator,
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
import { useConfirm } from '../context/confirm-context';
import { useToast } from '../context/toast-context';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useSharedWeightEntries } from '../context/weight-entries-context';
import { useScrollHeader } from '../hooks/use-scroll-header';
import { useTranslation } from '../i18n/language-context';
import { getDateLocale } from '../i18n/resolve-locale';
import { useUnits } from '../context/unit-context';
import { UnitPreference } from '../storage/unit-preference';
import {
  formatHeight,
  getHeightRangeMessage,
  heightToInputParts,
  parseHeightInput,
} from '../format';
import { useSharedUserProfile } from '../context/user-profile-context';
import { LanguagePreference } from '../storage/language-preference';
import { ThemePreference } from '../storage/theme-preference';
import { useAppStyles } from '../theme/styles';
import { useColors, useTheme } from '../theme/theme-context';

function formatMemberSince(isoDate: string | undefined, localeTag: string): string {
  if (!isoDate) {
    return '—';
  }

  return new Date(isoDate).toLocaleDateString(localeTag, {
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
  const { t, locale, preference: languagePreference, setPreference: setLanguagePreference } =
    useTranslation();
  const { preference, setPreference } = useTheme();
  const { units, preference: unitPreference, setPreference: setUnitPreference } = useUnits();
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
  const { confirm } = useConfirm();
  const { scrollY, onScroll } = useScrollHeader();
  const user = session?.user;
  const canShowBmi = currentHeightCm !== null;
  const dateLocale = getDateLocale(locale);

  const languageOptions = useMemo<SegmentedOption<LanguagePreference>[]>(
    () => [
      { value: 'system', label: t('profile.languageSystem') },
      { value: 'en', label: t('profile.languageEnglish') },
      { value: 'pl', label: t('profile.languagePolish') },
    ],
    [t],
  );

  const themeOptions = useMemo<SegmentedOption<ThemePreference>[]>(
    () => [
      { value: 'system', label: t('profile.themeSystem') },
      { value: 'light', label: t('profile.themeLight') },
      { value: 'dark', label: t('profile.themeDark') },
    ],
    [t],
  );

  const unitOptions = useMemo<SegmentedOption<UnitPreference>[]>(
    () => [
      { value: 'system', label: t('profile.unitsSystem') },
      { value: 'metric', label: t('profile.unitsMetric') },
      { value: 'imperial', label: t('profile.unitsImperial') },
    ],
    [t],
  );

  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [heightPrimaryInput, setHeightPrimaryInput] = useState('');
  const [heightSecondaryInput, setHeightSecondaryInput] = useState('');

  const startEditingHeight = () => {
    const parts = heightToInputParts(currentHeightCm, units);
    setHeightPrimaryInput(parts.primary);
    setHeightSecondaryInput(parts.secondary);
    setIsEditingHeight(true);
  };

  const cancelEditingHeight = () => {
    setIsEditingHeight(false);
    setHeightPrimaryInput('');
    setHeightSecondaryInput('');
  };

  const handleSaveHeight = async () => {
    const heightCm = parseHeightInput(units, heightPrimaryInput, heightSecondaryInput);
    if (heightCm === null) {
      showError(getHeightRangeMessage(units));
      return;
    }

    try {
      await updateHeight(heightCm);
      setIsEditingHeight(false);
      showSuccess(t('profile.heightSaved'));
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : t('profile.saveFailed');
      showError(message);
    }
  };

  useEffect(() => {
    if (!isEditingHeight) {
      return;
    }

    const parsed = parseHeightInput(units, heightPrimaryInput, heightSecondaryInput);
    const heightCm = parsed ?? currentHeightCm;
    if (heightCm === null) {
      return;
    }

    const parts = heightToInputParts(heightCm, units);
    setHeightPrimaryInput(parts.primary);
    setHeightSecondaryInput(parts.secondary);
  }, [units]);

  const handleSignOut = () => {
    void confirm({
      title: t('profile.signOut'),
      message: t('profile.signOutConfirm'),
      confirmLabel: t('profile.signOut'),
      destructive: true,
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      void (async () => {
        try {
          await signOut();
          showInfo(t('profile.signedOut'));
        } catch (signOutError) {
          const message =
            signOutError instanceof Error ? signOutError.message : t('profile.signOutFailed');
          showError(message);
        }
      })();
    });
  };

  const handleDeleteAccount = () => {
    void confirm({
      title: t('profile.deleteAccount'),
      message: t('profile.deleteAccountConfirm'),
      confirmLabel: t('profile.deleteAccount'),
      destructive: true,
    }).then((confirmed) => {
      if (!confirmed) {
        return;
      }
      void (async () => {
        try {
          await deleteAccount();
          showSuccess(t('profile.accountDeleted'));
        } catch (deleteError) {
          const message =
            deleteError instanceof Error ? deleteError.message : t('profile.deleteFailed');
          showError(message);
        }
      })();
    });
  };

  const entryCountLabel =
    entries.length === 1
      ? t('history.entryCount_one')
      : t('history.entryCount_other', { count: entries.length });

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('profile.title')}
        subtitle={user?.email ?? t('profile.subtitleFallback')}
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

        <AppCard title={t('profile.account')} isBusy={isRefreshing || isSaving}>
          {isLoading ? (
            <ProfileDetailsSkeleton />
          ) : (
            <>
              <ProfileRow icon="mail-outline" label={t('auth.email')} value={user?.email ?? '—'} />
              <ProfileRow
                icon="calendar-outline"
                label={t('profile.memberSince')}
                value={formatMemberSince(user?.created_at, dateLocale)}
              />
              <ProfileRow
                icon="list-outline"
                label={t('profile.weightEntries')}
                value={entryCountLabel}
              />

              <View style={styles.divider} />

              <View style={styles.accountRow}>
                <View style={styles.filterFieldHeader}>
                  <Text style={styles.accountLabel}>{t('profile.height')}</Text>
                  {!isEditingHeight ? (
                    <Pressable onPress={startEditingHeight} hitSlop={8} disabled={isSaving}>
                      <Text style={styles.linkText}>
                        {currentHeightCm === null ? t('common.add') : t('common.edit')}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={cancelEditingHeight} hitSlop={8} disabled={isSaving}>
                      <Text style={styles.linkText}>{t('common.cancel')}</Text>
                    </Pressable>
                  )}
                </View>

                {isEditingHeight ? (
                  <View style={styles.heightInputRow}>
                    <View style={styles.heightInputGroup}>
                      <Text style={styles.fieldLabel}>
                        {units === 'imperial' ? t('profile.feet') : t('profile.meters')}
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={heightPrimaryInput}
                        onChangeText={setHeightPrimaryInput}
                        keyboardType="number-pad"
                        placeholder={units === 'imperial' ? '5' : '1'}
                        placeholderTextColor={colors.textSubtle}
                        maxLength={2}
                        editable={!isSaving}
                      />
                    </View>
                    <View style={styles.heightInputGroup}>
                      <Text style={styles.fieldLabel}>
                        {units === 'imperial' ? t('profile.inches') : t('profile.centimeters')}
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={heightSecondaryInput}
                        onChangeText={setHeightSecondaryInput}
                        keyboardType="number-pad"
                        placeholder={units === 'imperial' ? '10' : '75'}
                        placeholderTextColor={colors.textSubtle}
                        maxLength={2}
                        editable={!isSaving}
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={styles.accountValue}>{formatHeight(currentHeightCm, units)}</Text>
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
                      <Text style={styles.primaryButtonText}>{t('profile.saveHeight')}</Text>
                    )}
                  </Pressable>
                ) : null}
              </View>
            </>
          )}
        </AppCard>

        <AppCard title={t('profile.appearance')} delay={60}>
          <Text style={styles.settingHint}>{t('profile.languageHint')}</Text>
          <SegmentedControl
            options={languageOptions}
            value={languagePreference}
            onChange={(next) => void setLanguagePreference(next)}
          />

          <View style={styles.divider} />

          <Text style={styles.settingHint}>{t('profile.themeHint')}</Text>
          <SegmentedControl
            options={themeOptions}
            value={preference}
            onChange={(next) => void setPreference(next)}
          />

          <View style={styles.divider} />

          <Text style={styles.settingHint}>{t('profile.unitsHint')}</Text>
          <SegmentedControl
            options={unitOptions}
            value={unitPreference}
            onChange={(next) => void setUnitPreference(next)}
          />

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{t('profile.showBmi')}</Text>
              <Text style={styles.settingHint}>
                {canShowBmi ? t('profile.showBmiHint') : t('profile.showBmiDisabled')}
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

        <AppCard title={t('profile.session')} delay={120}>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={handleSignOut}
          >
            <Text style={styles.secondaryButtonText}>{t('profile.signOut')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>{t('profile.deleteAccount')}</Text>
          </Pressable>
        </AppCard>
      </Animated.ScrollView>
    </View>
  );
}
