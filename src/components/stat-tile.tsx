import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useAppStyles } from '../theme/styles';

type StatTileProps = {
  label: string;
  value: string;
  unit?: string;
  badge?: ReactNode;
};

export function StatTile({ label, value, unit, badge }: StatTileProps) {
  const styles = useAppStyles();

  return (
    <View style={styles.statTile}>
      <Text style={styles.statTileLabel}>{label}</Text>
      <View style={styles.statTileValueRow}>
        <Text style={styles.statTileValue}>{value}</Text>
        {unit ? <Text style={styles.statTileUnit}>{unit}</Text> : null}
      </View>
      {badge}
    </View>
  );
}
