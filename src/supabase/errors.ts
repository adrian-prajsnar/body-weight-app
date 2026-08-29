export function toSupabaseError(error: { message: string }): Error {
  if (error.message.toLowerCase().includes('permission denied')) {
    return new Error(
      'Database permission error. In Supabase SQL Editor, run supabase/grants.sql from this project.',
    );
  }

  return new Error(error.message);
}
