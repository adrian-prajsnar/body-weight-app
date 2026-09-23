import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useContentFrameWidth } from '../hooks/use-content-frame-width';
import { useAppStyles } from '../theme/styles';

type ContentFrameProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function ContentFrame({ children, style }: ContentFrameProps) {
  const styles = useAppStyles();
  const frameWidth = useContentFrameWidth();

  return (
    <View
      style={[
        styles.contentFrame,
        typeof frameWidth === 'number' ? { width: frameWidth, maxWidth: frameWidth } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
