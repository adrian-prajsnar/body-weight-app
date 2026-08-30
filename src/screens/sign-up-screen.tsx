import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { AuthLayout } from '../components/auth-layout';
import { EmailField } from '../components/email-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { PasswordField } from '../components/password-field';
import { useToast } from '../context/toast-context';
import { AuthStackParamList } from '../navigation/types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const styles = useAppStyles();
  const colors = useColors();
  const { signUp } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      showError('Enter your email and password.');
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
    const trimmedEmail = email.trim();
    try {
      const { needsEmailConfirmation } = await signUp(trimmedEmail, password);
      if (needsEmailConfirmation) {
        showSuccess('Account created. Check your email to confirm, then sign in.');
      } else {
        showSuccess('Account created. Sign in to continue.');
      }
      navigation.navigate('Login', { email: trimmedEmail });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed.';
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your weight in seconds"
      footer={
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Pressable>
      }
    >
      <EmailField value={email} onChangeText={setEmail} />

      <PasswordField
        label="Password"
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
        onSubmitEditing={() => void handleSignUp()}
        placeholder="Repeat password"
      />

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => void handleSignUp()}
        disabled={isBusy}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryButtonText}>Create account</Text>
        )}
      </Pressable>
    </AuthLayout>
  );
}
