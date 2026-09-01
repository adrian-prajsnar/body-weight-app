import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useUnits } from '../context/unit-context';
import {
  formatHeight,
  getHeightRangeMessage,
  heightToInputParts,
  parseHeightInput,
} from '../format';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type FixedHeightSectionProps = {
  heightCm: number | null;
  isSaving: boolean;
  onSave: (heightCm: number) => Promise<void>;
  onInvalidHeight: () => void;
};

export function FixedHeightSection({
  heightCm,
  isSaving,
  onSave,
  onInvalidHeight,
}: FixedHeightSectionProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { units } = useUnits();

  const [isEditing, setIsEditing] = useState(false);
  const [heightPrimaryInput, setHeightPrimaryInput] = useState('');
  const [heightSecondaryInput, setHeightSecondaryInput] = useState('');

  const startEditing = () => {
    const parts = heightToInputParts(heightCm, units);
    setHeightPrimaryInput(parts.primary);
    setHeightSecondaryInput(parts.secondary);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setHeightPrimaryInput('');
    setHeightSecondaryInput('');
  };

  const handleSave = async () => {
    const parsed = parseHeightInput(units, heightPrimaryInput, heightSecondaryInput);
    if (parsed === null) {
      onInvalidHeight();
      return;
    }

    await onSave(parsed);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const parsed = parseHeightInput(units, heightPrimaryInput, heightSecondaryInput);
    if (parsed === null) {
      return;
    }

    const parts = heightToInputParts(parsed, units);
    setHeightPrimaryInput(parts.primary);
    setHeightSecondaryInput(parts.secondary);
  }, [units]);

  return (
    <>
      <View style={styles.filterFieldHeader}>
        {!isEditing ? (
          <Pressable onPress={startEditing} hitSlop={8} disabled={isSaving}>
            <Text style={styles.linkText}>
              {heightCm === null ? t('common.add') : t('common.edit')}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={cancelEditing} hitSlop={8} disabled={isSaving}>
            <Text style={styles.linkText}>{t('common.cancel')}</Text>
          </Pressable>
        )}
      </View>

      {heightCm === null && !isEditing ? (
        <Text style={styles.settingHint}>{t('profile.heightRequiredHint')}</Text>
      ) : null}

      {isEditing ? (
        <View style={{ gap: 12 }}>
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

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              isSaving && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.primaryButtonText}>{t('profile.saveHeight')}</Text>
            )}
          </Pressable>
        </View>
      ) : heightCm !== null ? (
        <Text style={styles.accountValue}>{formatHeight(heightCm, units)}</Text>
      ) : null}
    </>
  );
}
