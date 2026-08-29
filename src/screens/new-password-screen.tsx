import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { PasswordField } from '../components/password-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { styles } from '../theme/styles';

export function NewPasswordScreen() {
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Choose a new password</Text>
        <Text style={styles.subtitle}>You opened a password reset link. Set a new password below.</Text>

        <View style={styles.card}>
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
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => void handleSavePassword()}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Save password</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
