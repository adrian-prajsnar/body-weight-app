import { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { AuthLayout } from '../components/auth-layout';
import { PasswordField } from '../components/password-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

export function NewPasswordScreen() {
  const styles = useAppStyles();
  const colors = useColors();
  const { updatePassword } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleSavePassword = async () => {
    if (!password) {
      showError('Enter a new password.');
      return;
    }

    if (password.length < 8) {
      showError('Use a password with at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    setIsBusy(true);
    try {
      await updatePassword(password);
      showSuccess('Password updated. You are signed in.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update password.';
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="You opened a password reset link. Set a new password below."
    >
      <PasswordField
        label="New password"
        value={password}
        onChangeText={setPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        placeholder="At least 8 characters"
      />

      <PasswordField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => void handleSavePassword()}
        placeholder="Repeat password"
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
          <Text style={styles.primaryButtonText}>Save password</Text>
        )}
      </Pressable>
    </AuthLayout>
  );
}
