import { Text, TextStyle, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { formatKg } from '../format';
import { getHeightAtDate } from '../height';
import { useTranslation } from '../i18n/language-context';
import { HeightEntry } from '../types';
import { useAppStyles } from '../theme/styles';
import { BmiBadge } from './bmi-badge';

type WeightWithBmiProps = {
  weightKg: number;
  entryDate: string;
  heightEntries: HeightEntry[];
  weightStyle?: TextStyle;
  compactBmi?: boolean;
  layout?: 'inline' | 'stacked';
};

export function WeightWithBmi({
  weightKg,
  entryDate,
  heightEntries,
  weightStyle,
  compactBmi = false,
  layout = 'inline',
}: WeightWithBmiProps) {
  const styles = useAppStyles();
  const { showBmi } = useSharedBmiDisplay();
  const { t } = useTranslation();
  const heightCm = getHeightAtDate(heightEntries, entryDate);
  const bmi = showBmi && heightCm !== null ? calculateBmi(weightKg, heightCm) : null;
  const weightLabel = `${formatKg(weightKg)} ${t('common.kg')}`;

  if (layout === 'stacked') {
    return (
      <View style={styles.weightWithBmiStacked}>
        <Text style={[styles.historyWeight, weightStyle]}>{weightLabel}</Text>
        {bmi ? <BmiBadge bmi={bmi} compact={compactBmi} /> : null}
      </View>
    );
  }

  return (
    <View style={styles.weightWithBmiInline}>
      <Text style={[styles.historyWeight, weightStyle]}>{weightLabel}</Text>
      {bmi ? <BmiBadge bmi={bmi} compact={compactBmi} /> : null}
    </View>
  );
}
