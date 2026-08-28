import { WeightEntry } from '../types';
import { supabase } from './client';

type WeightEntryRow = {
  entry_date: string;
  weight_kg: number;
};

function mapRow(row: WeightEntryRow): WeightEntry {
  return {
    date: row.entry_date,
    weightKg: Number(row.weight_kg),
  };
}

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('You must be signed in.');
  }
  return data.user.id;
}

export async function getEntries(): Promise<WeightEntry[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('weight_entries')
    .select('entry_date, weight_kg')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function saveEntry(date: string, weightKg: number): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase.from('weight_entries').upsert(
    {
      user_id: userId,
      entry_date: date,
      weight_kg: weightKg,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,entry_date' },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteEntry(date: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase
    .from('weight_entries')
    .delete()
    .eq('user_id', userId)
    .eq('entry_date', date);

  if (error) {
    throw new Error(error.message);
  }
}
