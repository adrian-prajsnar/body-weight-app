import { Text, View } from 'react-native';
import { DateField } from './date-field';
import { useTranslation } from '../i18n/language-context';
import { fromDateKey } from '../format';
import { HeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { spacing } from '../theme/tokens';
import { HeightHistoryPreview } from './height-timeline';

type HeightSectionProps = {
  birthDate: string | null;
  onBirthDateChange: (date: Date | null) => void;
  birthDateAutoOpen?: boolean;
  minimumBirthDate: Date;
  maximumBirthDate: Date;
  heightEntries: HeightEntry[];
  onOpenHeightHistory: () => void;
};

export function HeightSection({
  birthDate,
  onBirthDateChange,
  birthDateAutoOpen = false,
  minimumBirthDate,
  maximumBirthDate,
  heightEntries,
  onOpenHeightHistory,
}: HeightSectionProps) {
  const styles = useAppStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.accountRow}>
      <View style={{ gap: spacing.lg }}>
        <DateField
          label={t('profile.birthDate')}
          value={birthDate ? fromDateKey(birthDate) : null}
          onChange={onBirthDateChange}
          optional
          autoOpen={birthDateAutoOpen}
          maximumDate={maximumBirthDate}
          minimumDate={minimumBirthDate}
        />

        <View style={{ gap: spacing.sm }}>
          <Text style={styles.accountLabel}>{t('profile.height')}</Text>
          <HeightHistoryPreview heightEntries={heightEntries} onShowAll={onOpenHeightHistory} />
        </View>
      </View>
    </View>
  );
}
