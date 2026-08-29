import { HeightEntry } from '../types';
import { getUserId } from './auth-user';
import { supabase } from './client';
import { toSupabaseError } from './errors';

type HeightEntryRow = {
  effective_date: string;
  height_cm: number;
};

function mapRow(row: HeightEntryRow): HeightEntry {
  return {
    effectiveDate: row.effective_date,
    heightCm: Number(row.height_cm),
  };
}

export async function getHeightEntries(): Promise<HeightEntry[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('height_entries')
    .select('effective_date, height_cm')
    .eq('user_id', userId)
    .order('effective_date', { ascending: false });

  if (error) {
    throw toSupabaseError(error);
  }

  return (data ?? []).map(mapRow);
}

export async function saveHeight(effectiveDate: string, heightCm: number): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase.from('height_entries').upsert(
    {
      user_id: userId,
      effective_date: effectiveDate,
      height_cm: heightCm,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,effective_date' },
  );

  if (error) {
    throw toSupabaseError(error);
  }
}
