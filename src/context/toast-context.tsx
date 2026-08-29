import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, Pressable, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../theme/styles';

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

const TOAST_TITLES: Record<ToastType, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
};

const TOAST_CARD_STYLES: Record<ToastType, ViewStyle> = {
  success: styles.toastCardSuccess,
  error: styles.toastCardError,
  info: styles.toastCardInfo,
};

const TOAST_TITLE_STYLES: Record<ToastType, TextStyle> = {
  success: styles.toastTitleSuccess,
  error: styles.toastTitleError,
  info: styles.toastTitleInfo,
};

const TOAST_MESSAGE_STYLES: Record<ToastType, TextStyle> = {
  success: styles.toastMessageSuccess,
  error: styles.toastMessageError,
  info: styles.toastMessageInfo,
};

function ToastBanner({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onDismiss();
      }
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      dismiss();
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [dismiss, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.toastContainer,
        { top: insets.top + 8, opacity, transform: [{ translateY }] },
      ]}
    >
      <Pressable
        style={[styles.toastCard, TOAST_CARD_STYLES[toast.type]]}
        onPress={dismiss}
      >
        <Text style={[styles.toastTitle, TOAST_TITLE_STYLES[toast.type]]}>
          {TOAST_TITLES[toast.type]}
        </Text>
        <Text style={[styles.toastMessage, TOAST_MESSAGE_STYLES[toast.type]]}>
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
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

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      <View style={styles.toastRoot}>
        {children}
        {toast ? (
          <ToastBanner key={toast.id} toast={toast} onDismiss={() => setToast(null)} />
        ) : null}
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
