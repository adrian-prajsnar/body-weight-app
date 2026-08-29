import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
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
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { AuthStackParamList } from '../navigation/types';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation, route }: Props) {
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we will send a link to choose a new password.
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={() => void handleResetPassword()}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => void handleResetPassword()}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Send reset link</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Login', { email: email.trim() || undefined })}>
          <Text style={styles.linkText}>Back to sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
