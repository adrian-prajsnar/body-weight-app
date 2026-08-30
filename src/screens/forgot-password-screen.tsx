import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { AuthLayout } from '../components/auth-layout';
import { EmailField } from '../components/email-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { AuthStackParamList } from '../navigation/types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation, route }: Props) {
  const styles = useAppStyles();
  const colors = useColors();
  const { resetPassword } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [isBusy, setIsBusy] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showError('Enter your email address.');
      return;
    }

    setIsBusy(true);
    try {
      await resetPassword(email.trim());
      showSuccess('If an account exists, we sent a reset link. Open it on this phone.');
      navigation.navigate('Login', { email: email.trim() });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not send reset email.';
      showError(message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We will email you a link to choose a new password"
      footer={
        <Pressable
          onPress={() =>
            navigation.navigate('Login', { email: email.trim() || undefined })
          }
        >
          <Text style={styles.linkText}>Back to sign in</Text>
        </Pressable>
      }
    >
      <EmailField
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
        onSubmitEditing={() => void handleResetPassword()}
      />

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => void handleResetPassword()}
        disabled={isBusy}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryButtonText}>Send reset link</Text>
        )}
      </Pressable>
    </AuthLayout>
  );
}
