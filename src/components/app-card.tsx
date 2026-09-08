import { ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LoadingCardOverlay } from './loading-card-overlay';
import { useAppStyles } from '../theme/styles';
import { radius } from '../theme/tokens';

type AppCardProps = {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  isBusy?: boolean;
  elevated?: boolean;
  delay?: number;
  animateEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function AppCard({
  title,
  subtitle,
  right,
  isBusy = false,
  elevated = false,
  delay = 0,
  animateEntry = true,
  style,
  children,
}: AppCardProps) {
  const styles = useAppStyles();
  const hasHeader = Boolean(title || subtitle || right);
  const entering = animateEntry ? FadeInDown.duration(320).delay(delay) : undefined;

  return (
    <Animated.View
      entering={entering}
      style={styles.loadingCard}
    >
      {isBusy ? (
        <LoadingCardOverlay
          style={{ borderRadius: elevated ? radius.xl : radius.lg }}
        />
      ) : null}
      <View style={[elevated ? styles.cardElevated : styles.card, style]}>
        {hasHeader ? (
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1, gap: 2 }}>
              {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
              {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
            </View>
            {right}
          </View>
        ) : null}
        {children}
      </View>
    </Animated.View>
  );
}
