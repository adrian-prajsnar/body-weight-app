import { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { usesHeightTimeline } from '../height';
import { useTranslation } from '../i18n/language-context';
import {
  getStillGrowingPreference,
  setStillGrowingPreference,
} from '../storage/still-growing-preference';
import { HeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { FixedHeightSection } from './fixed-height-section';
import { HeightHistoryPreview } from './height-timeline';

type HeightSectionProps = {
  heightEntries: HeightEntry[];
  currentHeightCm: number | null;
  isLoading: boolean;
  isSaving: boolean;
  onSaveFixedHeight: (heightCm: number) => Promise<void>;
  onInvalidHeight: () => void;
  onConsolidateToFixedHeight: () => Promise<void>;
  onOpenHeightHistory: () => void;
};

export function HeightSection({
  heightEntries,
  currentHeightCm,
  isLoading,
  isSaving,
  onSaveFixedHeight,
  onInvalidHeight,
  onConsolidateToFixedHeight,
  onOpenHeightHistory,
}: HeightSectionProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const [stillGrowing, setStillGrowing] = useState(false);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    void getStillGrowingPreference().then((value) => {
      setStillGrowing(value);
      setPreferenceLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!preferenceLoaded || isLoading) {
      return;
    }

    if (usesHeightTimeline(heightEntries) && !stillGrowing) {
      setStillGrowing(true);
      void setStillGrowingPreference(true);
    }
  }, [heightEntries, isLoading, preferenceLoaded, stillGrowing]);

  const handleStillGrowingChange = (value: boolean) => {
    if (value) {
      setStillGrowing(true);
      void setStillGrowingPreference(true);
      return;
    }

    void (async () => {
      try {
        if (usesHeightTimeline(heightEntries)) {
          await onConsolidateToFixedHeight();
        }
        setStillGrowing(false);
        await setStillGrowingPreference(false);
      } catch {
        // User cancelled consolidation or save failed — keep timeline mode.
      }
    })();
  };

  return (
    <View style={styles.accountRow}>
      <Text style={styles.accountLabel}>{t('profile.height')}</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{t('profile.stillGrowing')}</Text>
          <Text style={styles.settingHint}>{t('profile.stillGrowingHint')}</Text>
        </View>
        <Switch
          value={stillGrowing}
          onValueChange={handleStillGrowingChange}
          disabled={isSaving || isLoading}
          trackColor={{ false: colors.borderStrong, true: colors.accentBorder }}
          thumbColor={stillGrowing ? colors.accent : colors.surfaceMuted}
        />
      </View>

      {stillGrowing ? (
        <HeightHistoryPreview heightEntries={heightEntries} onShowAll={onOpenHeightHistory} />
      ) : (
        <FixedHeightSection
          heightCm={currentHeightCm}
          isSaving={isSaving}
          onSave={onSaveFixedHeight}
          onInvalidHeight={onInvalidHeight}
        />
      )}
    </View>
  );
}
