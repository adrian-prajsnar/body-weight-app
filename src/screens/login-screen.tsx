import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { formatSignInError, isEmailNotConfirmedError } from '../auth-errors';
import { AuthLayout } from '../components/auth-layout';
import { EmailField } from '../components/email-field';
import { PasswordField } from '../components/password-field';
import { useSupabaseAuth } from '../context/supabase-auth-context';
import { useToast } from '../context/toast-context';
import { useTranslation } from '../i18n/language-context';
import { AuthStackParamList } from '../navigation/types';
import { useAppStyles } from '../theme/styles';
import { useColors } from '../theme/theme-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const styles = useAppStyles();
  const colors = useColors();
  const { t } = useTranslation();
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
      showError(t('auth.enterEmailPassword'));
      return;
    }

    setShowEmailNotConfirmed(false);
    setIsBusy(true);
    try {
      await signIn(email.trim(), password);
      showSuccess(t('auth.signedIn'));
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
      showError(t('auth.enterEmailFirst'));
      return;
    }

    setIsResending(true);
    try {
      await resendConfirmationEmail(email.trim());
      showSuccess(t('auth.confirmationSent'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.couldNotResend');
      showError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.welcomeBack')}
      subtitle={t('auth.signInSubtitle')}
      footer={
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>{t('auth.noAccount')}</Text>
        </Pressable>
      }
    >
      <EmailField
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setShowEmailNotConfirmed(false);
        }}
      />

      <PasswordField
        label={t('auth.password')}
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={() => void handleSignIn()}
        placeholder={t('auth.password')}
      />

      <Pressable
        style={styles.authInlineLink}
        onPress={() =>
          navigation.navigate('ForgotPassword', { email: email.trim() || undefined })
        }
      >
        <Text style={styles.linkText}>{t('auth.forgotPassword')}</Text>
      </Pressable>

      {showEmailNotConfirmed ? (
        <View style={styles.authNotice}>
          <Text style={styles.authNoticeText}>{t('auth.emailNotConfirmed')}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              isResending && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => void handleResendConfirmation()}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color={colors.accent} />
            ) : (
              <Text style={styles.secondaryButtonText}>{t('auth.resendConfirmation')}</Text>
            )}
          </Pressable>
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => void handleSignIn()}
        disabled={isBusy}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryButtonText}>{t('auth.signIn')}</Text>
        )}
      </Pressable>
    </AuthLayout>
  );
}
