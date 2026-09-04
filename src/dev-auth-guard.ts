import { Session } from '@supabase/supabase-js';
import { t } from './i18n';

const DEV_EMAIL_MARKER = '+dev';

export function isDevAuthGuardActive(): boolean {
  return __DEV__;
}

export function isDevAllowedEmail(email: string): boolean {
  return email.trim().toLowerCase().includes(DEV_EMAIL_MARKER);
}

export function assertDevAllowedEmail(email: string): void {
  if (!isDevAuthGuardActive()) {
    return;
  }

  if (!isDevAllowedEmail(email)) {
    throw new Error(t('auth.devEmailRequired'));
  }
}

export function isDevAllowedSession(session: Session | null): boolean {
  if (!session || !isDevAuthGuardActive()) {
    return true;
  }

  return isDevAllowedEmail(session.user.email ?? '');
}
