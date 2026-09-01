import { t } from '../i18n';
import { supabase } from './client';

export async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error(t('errors.mustBeSignedIn'));
  }
  return data.user.id;
}
