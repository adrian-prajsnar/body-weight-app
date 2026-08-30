import { t } from './i18n';

export function isEmailNotConfirmedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes('email not confirmed') || message.includes('email_not_confirmed');
}

export function formatSignInError(error: unknown): string {
  if (isEmailNotConfirmedError(error)) {
    return t('auth.confirmEmailFirst');
  }

  return error instanceof Error ? error.message : t('auth.signInFailed');
}
