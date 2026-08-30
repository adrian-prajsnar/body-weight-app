import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

type PendingConfirm = ConfirmOptions & { id: number };

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const styles = useAppStyles();
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const idRef = useRef(0);

  const close = useCallback((result: boolean) => {
    setPending(null);
    resolverRef.current?.(result);
    resolverRef.current = null;
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      idRef.current += 1;
      resolverRef.current = resolve;
      setPending({ ...options, id: idRef.current });
    });
  }, []);

  const cancelLabel = pending?.cancelLabel ?? t('common.cancel');
  const confirmLabel = pending?.confirmLabel ?? t('common.confirm');

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      <View style={styles.overlayRoot}>
        {children}
        {pending ? (
          <Modal
            visible
            transparent
            animationType="fade"
            onRequestClose={() => close(false)}
          >
            <Pressable
              style={styles.modalBackdropCentered}
              onPress={() => close(false)}
            >
              <Pressable
                style={styles.confirmDialogCard}
                onPress={(event) => event.stopPropagation()}
              >
                <Text style={styles.confirmDialogTitle}>{pending.title}</Text>
                <Text style={styles.confirmDialogMessage}>{pending.message}</Text>
                <View style={styles.confirmDialogActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmDialogButton,
                      styles.secondaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => close(false)}
                  >
                    <Text style={styles.secondaryButtonText}>{cancelLabel}</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmDialogButton,
                      pending.destructive
                        ? styles.confirmDialogDestructiveButton
                        : styles.primaryButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => close(true)}
                  >
                    <Text
                      style={
                        pending.destructive
                          ? styles.confirmDialogDestructiveButtonText
                          : styles.primaryButtonText
                      }
                    >
                      {confirmLabel}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        ) : null}
      </View>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}
