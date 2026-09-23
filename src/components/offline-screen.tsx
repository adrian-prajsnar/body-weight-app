import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors, useTheme } from '../theme/theme-context';

type OfflineScreenProps = {
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function OfflineScreen({ isRefreshing, onRefresh }: OfflineScreenProps) {
  const styles = useAppStyles();
  const colors = useColors();
  const { scheme } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient
        colors={[colors.accentSoft, colors.background]}
        style={styles.authBackdrop}
        pointerEvents="none"
      />
      <View style={[styles.centered, styles.authContent]}>
        <View style={styles.authFrame}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.authBrand}>
            <View style={[styles.emptyStateIcon, { width: 72, height: 72, marginBottom: 0 }]}>
              <Ionicons name="cloud-offline-outline" size={36} color={colors.textSubtle} />
            </View>
            <Text style={[styles.title, { textAlign: 'center' }]}>{t('navigation.offlineTitle')}</Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>
              {t('navigation.offlineSubtitle')}
            </Text>
          </Animated.View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { alignSelf: 'stretch' },
              pressed && styles.buttonPressed,
              isRefreshing && { opacity: 0.7 },
            ]}
            onPress={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="refresh" size={18} color={colors.onAccent} />
                <Text style={styles.primaryButtonText}>{t('navigation.offlineRefresh')}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
