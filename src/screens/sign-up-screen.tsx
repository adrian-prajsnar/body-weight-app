import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { AuthStackParamList } from '../navigation/types';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    setIsBusy(true);
    const trimmedEmail = email.trim();
    try {
      await signUp(trimmedEmail, password);
      ToastAndroid.show('Account created successfully. Sign in to continue.', ToastAndroid.LONG);
      navigation.navigate('Login', { email: trimmedEmail });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed.';
      Alert.alert('Sign up failed', message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start tracking your weight</Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 8 characters"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.fieldLabel}>Confirm password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Repeat password"
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => void handleSignUp()}
            disabled={isBusy}
          >
            <Text style={styles.primaryButtonText}>
              {isBusy ? 'Creating account...' : 'Create account'}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
