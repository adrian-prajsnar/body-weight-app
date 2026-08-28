-- Run this in Supabase: SQL Editor → New query → paste → Run

create table if not exists public.weight_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  weight_kg numeric(6, 2) not null check (weight_kg >= 20 and weight_kg <= 300),
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_date)
);

alter table public.weight_entries enable row level security;

create policy "weight_entries_select_own"
  on public.weight_entries
  for select
  using (auth.uid() = user_id);

create policy "weight_entries_insert_own"
  on public.weight_entries
  for insert
  with check (auth.uid() = user_id);

create policy "weight_entries_update_own"
  on public.weight_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "weight_entries_delete_own"
  on public.weight_entries
  for delete
  using (auth.uid() = user_id);

-- Table-level grants (required for API access; RLS policies alone are not enough).
grant select, insert, update, delete on table public.weight_entries to authenticated;
grant select, insert, update, delete on table public.weight_entries to service_role;

-- Lets signed-in users delete their own auth account (weight_entries cascade via FK).
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_own_account() to authenticated;
