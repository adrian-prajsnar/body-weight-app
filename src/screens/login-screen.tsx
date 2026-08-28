import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { AuthStackParamList } from '../navigation/types';
import { styles } from '../theme/styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { signIn } = useSupabaseAuth();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [password, setPassword] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }

    setIsBusy(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed.';
      Alert.alert('Sign in failed', message);
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
        <Text style={styles.title}>Body Weight Tracker</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={[styles.primaryButton, isBusy && styles.buttonDisabled]}
            onPress={() => void handleSignIn()}
            disabled={isBusy}
          >
            <Text style={styles.primaryButtonText}>{isBusy ? 'Signing in...' : 'Sign in'}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>No account? Create one</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
