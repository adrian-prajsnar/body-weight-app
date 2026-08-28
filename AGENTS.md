# Body Weight Tracker — Agent Guide

Personal Android app (Expo SDK 54). Supabase-backed, auth required.

## Stack

- Expo + React Native + TypeScript
- Supabase (`@supabase/supabase-js`) — auth + database
- React Navigation (auth stack + bottom tabs)
- EAS Build for APK

## File naming

**Always use kebab-case** for files and folders. React component names stay PascalCase.

## Project layout

```
app.tsx
src/
  screens/              # login-screen, sign-up-screen, dashboard-screen, ...
  components/
  hooks/
  context/              # supabase-auth-context, weight-entries-context
  navigation/           # root-navigator, auth-navigator, main-tab-navigator
  supabase/             # client.ts, weight-sync.ts (all data I/O)
  theme/
  stats.ts, format.ts, types.ts
supabase/schema.sql
```

## Data

- **No local weight storage** — all entries read/write via `src/supabase/weight-sync.ts`
- AsyncStorage is only used by Supabase for auth session persistence
- One entry per date per user; save overwrites same day
- RLS enforces `user_id = auth.uid()`

## Auth

- App blocked until signed in (`root-navigator.tsx`)
- Login and sign-up are separate screens
- Sign out on dashboard

## Before finishing

```bash
npx tsc --noEmit
npx expo-doctor
```

Never commit `.env` or personal data.
