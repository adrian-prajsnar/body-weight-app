-- One-time migration example — copy data before reshape, no drops on weight tables.
-- For new changes, add a dated file under supabase/migrations/ (see AGENTS.md).
-- Run once if you already had weight_entries / user_profiles from an older schema.

grant usage on schema public to authenticated, anon;

create table if not exists public.height_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  effective_date date not null,
  height_cm smallint not null check (height_cm >= 100 and height_cm <= 250),
  updated_at timestamptz not null default now(),
  primary key (user_id, effective_date)
);

alter table public.height_entries enable row level security;

drop policy if exists "height_entries_select_own" on public.height_entries;
drop policy if exists "height_entries_insert_own" on public.height_entries;
drop policy if exists "height_entries_update_own" on public.height_entries;
drop policy if exists "height_entries_delete_own" on public.height_entries;

create policy "height_entries_select_own"
  on public.height_entries
  for select
  using (auth.uid() = user_id);

create policy "height_entries_insert_own"
  on public.height_entries
  for insert
  with check (auth.uid() = user_id);

create policy "height_entries_update_own"
  on public.height_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "height_entries_delete_own"
  on public.height_entries
  for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on table public.height_entries to authenticated;
grant select, insert, update, delete on table public.height_entries to service_role;

-- Copy legacy height from user_profiles (only if height_cm column still exists):
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'user_profiles'
      and column_name = 'height_cm'
  ) then
    insert into public.height_entries (user_id, effective_date, height_cm, updated_at)
    select user_id, updated_at::date, height_cm, updated_at
    from public.user_profiles
    where height_cm is not null
    on conflict (user_id, effective_date) do nothing;
  end if;
end $$;
