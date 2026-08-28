# Body Weight Tracker

A minimal Android app for logging daily body weight in kilograms (2 decimal places), with data stored in Supabase.

## Features

- Sign in / sign up (required — no access without login)
- Account page — profile info, sign out, delete account
- Log one weight per day (editing the same date overwrites the previous value)
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

### 2. Create the database table

1. **SQL Editor** → **New query**
2. Paste and run [`supabase/schema.sql`](supabase/schema.sql)

If you already ran an older version of the schema, run this in the SQL Editor:

```sql
grant select, insert, update, delete on table public.weight_entries to authenticated;
grant select, insert, update, delete on table public.weight_entries to service_role;
```

Also run the `delete_own_account` function block at the bottom of `supabase/schema.sql` if you have not already.

### 3. Enable email sign-in

1. **Authentication** → **Providers** → **Email** → enabled
2. For personal use, disable **Confirm email** so you can sign in immediately

### 4. Add API keys to `.env`

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Get these from **Project Settings** → **API**.

Restart Expo: `npx expo start -c`

### 5. Create your account

Open the app → **Create account** → sign in. All weight data is stored in Supabase only.

## Build APK

```bash
npx eas login
npx eas build:configure
npx eas build -p android --profile preview
```

## Privacy

- Each user only sees their own entries (Supabase row-level security)
- Friends or others need their own accounts — data is never shared
- Never commit `.env` to git
