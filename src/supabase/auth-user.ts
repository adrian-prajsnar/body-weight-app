import { t } from '../i18n';
import { supabase } from './client';

export async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) {
    throw new Error(t('errors.mustBeSignedIn'));
  }
  return data.session.user.id;
}
