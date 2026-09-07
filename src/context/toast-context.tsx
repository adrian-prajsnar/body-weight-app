import { Ionicons } from '@expo/vector-icons';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeOutUp, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n/language-context';
import { AppStyles, useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';
import { Palette, spacing } from '../theme/tokens';

export type ToastType = 'success' | 'error' | 'info';

type ToastOptions = {
  type: ToastType;
  message: string;
};

type ToastState = ToastOptions & {
  id: number;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 3200;

const TOAST_ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

function toastVariant(styles: AppStyles, type: ToastType) {
  switch (type) {
    case 'success':
      return {
        card: styles.toastCardSuccess,
        title: styles.toastTitleSuccess,
        message: styles.toastMessageSuccess,
      };
    case 'error':
      return {
        card: styles.toastCardError,
        title: styles.toastTitleError,
        message: styles.toastMessageError,
      };
    default:
      return {
        card: styles.toastCardInfo,
        title: styles.toastTitleInfo,
        message: styles.toastMessageInfo,
      };
  }
}

function toastIconColor(colors: Palette, type: ToastType): string {
  switch (type) {
    case 'success':
      return colors.success;
    case 'error':
      return colors.danger;
    default:
      return colors.accent;
  }
}

function ToastBanner({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const toastTop = insets.top + spacing.sm;
  const variant = toastVariant(styles, toast.type);

  const toastTitle =
    toast.type === 'success'
      ? t('toasts.success')
      : toast.type === 'error'
        ? t('toasts.error')
        : t('toasts.info');

  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View
      pointerEvents="box-none"
      entering={SlideInUp.springify().damping(18).mass(0.6)}
      exiting={FadeOutUp.duration(180)}
      style={[styles.toastContainer, { top: toastTop }]}
    >
      <Pressable style={[styles.toastCard, variant.card]} onPress={onDismiss}>
        <Ionicons
          name={TOAST_ICONS[toast.type]}
          size={20}
          color={toastIconColor(colors, toast.type)}
        />
        <View style={styles.toastTextGroup}>
          <Text style={[styles.toastTitle, variant.title]}>{toastTitle}</Text>
          <Text style={[styles.toastMessage, variant.message]}>{toast.message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const styles = useAppStyles();
  const [toast, setToast] = useState<ToastState | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((options: ToastOptions) => {
    idRef.current += 1;
    setToast({ ...options, id: idRef.current });
  }, []);

  const showSuccess = useCallback(
    (message: string) => showToast({ type: 'success', message }),
    [showToast],
  );

  const showError = useCallback(
    (message: string) => showToast({ type: 'error', message }),
    [showToast],
  );

  const showInfo = useCallback(
    (message: string) => showToast({ type: 'info', message }),
    [showToast],
  );

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      <View style={styles.toastRoot}>
        {children}
        {toast ? <ToastBanner key={toast.id} toast={toast} onDismiss={dismiss} /> : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
