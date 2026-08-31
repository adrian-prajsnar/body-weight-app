import { Text, TextStyle, View } from 'react-native';
import { calculateBmi } from '../bmi';
import { useSharedBmiDisplay } from '../context/bmi-display-context';
import { useUnits } from '../context/unit-context';
import { formatWeightLabel } from '../format';
import { getHeightAtDate } from '../height';
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
  const { units } = useUnits();
  const { showBmi } = useSharedBmiDisplay();
  const heightCm = getHeightAtDate(heightEntries, entryDate);
  const bmi = showBmi && heightCm !== null ? calculateBmi(weightKg, heightCm) : null;
  const weightLabel = formatWeightLabel(weightKg, units);

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
