import { t } from './i18n';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
}

export function isEmailNotConfirmedError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message.includes('email not confirmed') || message.includes('email_not_confirmed');
}

function isInvalidCredentialsError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message.includes('invalid login credentials') || message.includes('invalid credentials');
}

export function formatSignInError(error: unknown): string {
  if (isEmailNotConfirmedError(error)) {
    return t('auth.confirmEmailFirst');
  }

  if (isInvalidCredentialsError(error)) {
    return t('auth.invalidCredentials');
  }

  return error instanceof Error ? error.message : t('auth.signInFailed');
}
