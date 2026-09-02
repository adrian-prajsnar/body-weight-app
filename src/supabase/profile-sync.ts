import { getUserId } from './auth-user';
import { supabase } from './client';
import { withAuthRetry } from './with-auth-retry';

type UserProfileRow = {
  birth_date: string | null;
};

export async function getBirthDate(): Promise<string | null> {
  return withAuthRetry(async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('birth_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return (data as UserProfileRow | null)?.birth_date ?? null;
  });
}

export async function saveBirthDate(birthDate: string | null): Promise<void> {
  return withAuthRetry(async () => {
    const userId = await getUserId();
    const { error } = await supabase.from('user_profiles').upsert(
      {
        user_id: userId,
        birth_date: birthDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      throw error;
    }
  });
}
