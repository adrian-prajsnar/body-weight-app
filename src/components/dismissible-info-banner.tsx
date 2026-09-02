import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type DismissibleInfoBannerProps = {
  message: string;
  actionLabel: string;
  onAction: () => void;
  onDismiss: () => void;
};

export function DismissibleInfoBanner({
  message,
  actionLabel,
  onAction,
  onDismiss,
}: DismissibleInfoBannerProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <View style={styles.infoBanner}>
      <View style={styles.infoBannerHeader}>
        <Text style={styles.infoBannerText}>{message}</Text>
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('dashboard.dismissAlert')}
        >
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </Pressable>
      </View>
      <Pressable onPress={onAction} hitSlop={4}>
        <Text style={styles.infoBannerLink}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
