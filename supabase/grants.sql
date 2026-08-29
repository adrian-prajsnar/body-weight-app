-- Run in Supabase: SQL Editor → New query → Run
-- Fixes: "permission denied" and sets up height history
-- Safe to run multiple times (policies may already exist).

grant usage on schema public to authenticated, anon;

grant select, insert, update, delete on table public.weight_entries to authenticated;
grant select, insert, update, delete on table public.weight_entries to service_role;

grant select, insert, update, delete on table public.height_entries to authenticated;
grant select, insert, update, delete on table public.height_entries to service_role;

grant select, insert, update, delete on table public.user_profiles to authenticated;
grant select, insert, update, delete on table public.user_profiles to service_role;

-- Migrate legacy height from user_profiles (run once if you used the old schema):
-- insert into public.height_entries (user_id, effective_date, height_cm, updated_at)
-- select user_id, updated_at::date, height_cm, updated_at
-- from public.user_profiles
-- where height_cm is not null
-- on conflict (user_id, effective_date) do nothing;
