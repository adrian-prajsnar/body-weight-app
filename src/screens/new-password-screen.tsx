import { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { AuthLayout } from '../components/auth-layout';
import { PasswordField } from '../components/password-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { useTranslation } from '../i18n/language-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function NewPasswordScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
  const { updatePassword } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleSavePassword = async () => {
    if (!password) {
      showError(t('auth.enterNewPassword'));
      return;
    }

    if (password.length < 8) {
      showError(t('auth.passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      showError(t('auth.passwordsMismatch'));
      return;
    }

    setIsBusy(true);
    try {
      await updatePassword(password);
      showSuccess(t('auth.passwordUpdated'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.couldNotUpdatePassword');
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.chooseNewPassword')}
      subtitle={t('auth.newPasswordSubtitle')}
    >
      <PasswordField
        label={t('auth.newPassword')}
        value={password}
        onChangeText={setPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        placeholder={t('auth.passwordMinPlaceholder')}
      />

      <PasswordField
        label={t('auth.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => void handleSavePassword()}
        placeholder={t('auth.repeatPassword')}
      />

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => void handleSavePassword()}
        disabled={isBusy}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryButtonText}>{t('auth.savePassword')}</Text>
        )}
      </Pressable>
    </AuthLayout>
  );
}
