# Body Weight Tracker

A minimal Android app for logging daily body weight, with metric (kg) or imperial (lb) display and data stored in Supabase.

## Features

- Sign in / sign up (required — no access without login)
- Profile page — email, height history (effective dates), sign out, delete account
- Log one weight per day (editing the same date overwrites the previous value); **height required first**; metric or imperial units in Profile
- Dashboard averages: this week, last week, this month, and more
- Compare periods week/month/year or custom ranges
- Cloud database via Supabase (free tier)

## Development

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key
npx expo start -c
```

## Supabase setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project and wait for it to provision

### 2. Create the database tables

1. **SQL Editor** → **New query**
2. Paste and run [`supabase/schema.sql`](supabase/schema.sql) once (new projects only)

**Already have data?** Do not re-run `schema.sql` to apply changes. Add a new file under [`supabase/migrations/`](supabase/migrations/) instead — see **Database migrations** in [`AGENTS.md`](AGENTS.md).

**Already set up `weight_entries`?** Run only [`supabase/migrate-height-entries.sql`](supabase/migrate-height-entries.sql) to add `height_entries` without touching existing weight policies.

**Migrating from an older schema** (if `user_profiles` had a `height_cm` column):

```sql
insert into public.height_entries (user_id, effective_date, height_cm, updated_at)
select user_id, updated_at::date, height_cm, updated_at
from public.user_profiles
where height_cm is not null
on conflict (user_id, effective_date) do nothing;
```

### Troubleshooting: "permission denied for table weight_entries"

Your tables exist but API roles lack access. Run [`supabase/grants.sql`](supabase/grants.sql) in the SQL Editor (safe to run again anytime).

```sql
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on table public.weight_entries to authenticated;
grant select, insert, update, delete on table public.height_entries to authenticated;
grant select, insert, update, delete on table public.user_profiles to authenticated;
```

If you already ran an older schema without `height_entries`, run the full `supabase/schema.sql` or the migration block above.

### 3. Enable email sign-in and confirmation

1. **Authentication** → **Providers** → **Email** → enabled
2. Turn on **Confirm email** (recommended)
3. **Authentication** → **URL Configuration**:
   - **Site URL**: `body-weight-app://auth/callback`
   - **Redirect URLs** — add both:
     - `body-weight-app://auth/callback`
     - `exp://127.0.0.1:8081/--/auth/callback` (Expo Go on your PC; adjust port if Expo uses another)

Supabase sends confirmation and password-reset emails on the free tier (built-in mailer). For better delivery later, you can add custom SMTP under **Authentication** → **SMTP**.

### 4. Add API keys to `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Get these from **Project Settings** → **API**.

Restart Expo: `npx expo start -c`

### 5. Create your account

1. Open the app → **Create account**
2. Check your email and tap **Confirm your mail**
3. Return to the app → **Sign in**

**Password reset:** Login → **Forgot password?** → open the email link on your phone → set a new password in the app.

All weight data is stored in Supabase only.

## Build APK

Cloud build (download link on your phone):

```bash
npx eas-cli login
npx eas-cli env:push --environment production
npx eas-cli build -p android --profile production
```

`env:push` uploads `EXPO_PUBLIC_*` values from your local `.env` to EAS so the APK can reach Supabase. The build fails early if they are missing.

Local build on your PC (copy the APK to your phone):

```bash
npx eas-cli build -p android --profile production --local
```

Before friends sign up, confirm Supabase **Authentication → URL Configuration** includes `body-weight-app://auth/callback`.

## Privacy

- Each user only sees their own entries (Supabase row-level security)
- Friends or others need their own accounts — data is never shared
- Never commit `.env` to git
