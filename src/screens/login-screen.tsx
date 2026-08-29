import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { formatSignInError, isEmailNotConfirmedError } from '../auth-errors';
import { PasswordField } from '../components/password-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { AuthStackParamList } from '../navigation/types';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { signIn, resendConfirmationEmail } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      showError('Enter your email and password.');
      return;
    }

    setShowEmailNotConfirmed(false);
    setIsBusy(true);
    try {
      await signIn(email.trim(), password);
      showSuccess('Signed in successfully.');
    } catch (error) {
      if (isEmailNotConfirmedError(error)) {
        setShowEmailNotConfirmed(true);
      }
      showError(formatSignInError(error));
    } finally {
      setIsBusy(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      showError('Enter your email address first.');
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(email.trim());
      showSuccess('Confirmation email sent. Check your inbox.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not resend email.';
      showError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Body Weight Tracker</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setShowEmailNotConfirmed(false);
            }}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
          />

          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={() => void handleSignIn()}
            placeholder="Password"
          />

          <Pressable
            style={styles.authInlineLink}
            onPress={() => navigation.navigate('ForgotPassword', { email: email.trim() || undefined })}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>

          {showEmailNotConfirmed ? (
            <View style={styles.authNotice}>
              <Text style={styles.authNoticeText}>
                Your email is not confirmed yet. Open the link we sent, then sign in again.
              </Text>
              <Pressable
                style={[styles.secondaryButton, isResending && styles.buttonDisabled]}
                onPress={() => void handleResendConfirmation()}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator color="#2563EB" />
                ) : (
                  <Text style={styles.secondaryButtonText}>Resend confirmation email</Text>
                )}
              </Pressable>
            </View>
          ) : null}

          <Pressable
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => void handleSignIn()}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign in</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>No account? Create one</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
