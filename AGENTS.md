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
  context/              # supabase-auth-context, weight-entries-context, user-profile-context
  navigation/           # root-navigator, auth-navigator, main-tab-navigator
  supabase/             # client.ts, weight-sync.ts, height-sync.ts (all data I/O)
  theme/                # tokens.ts (palettes), theme-context.tsx, styles.ts
  stats.ts, height.ts, format.ts, types.ts
supabase/schema.sql
supabase/grants.sql
```

## Data

- **No local weight storage** — all entries read/write via `src/supabase/weight-sync.ts`
- Height history in `height_entries` via `src/supabase/height-sync.ts` (one row per effective date; upsert overwrites same day)
- BMI uses height effective on each weight entry date (`src/height.ts` → `getHeightAtDate`)
- AsyncStorage is only used by Supabase for auth session persistence, the BMI display preference (`src/storage/bmi-display-preference.ts`), and the theme preference (`src/storage/theme-preference.ts`)
- One weight entry per date per user; save overwrites same day
- RLS enforces `user_id = auth.uid()`

## Theming

- All colors come from `src/theme/tokens.ts` (light + dark palettes). Never hardcode a hex value in a component.
- Components call `const styles = useAppStyles()` from `src/theme/styles.ts`. For props that cannot take a stylesheet (`placeholderTextColor`, `ActivityIndicator`, icons), read `useColors()`.
- Custom fonts mean `fontWeight` is ignored on Android — always set `fontFamily` from `fontFamily` in tokens.
- Scheme follows the device unless overridden on the profile screen.

## Auth

- App blocked until signed in (`root-navigator.tsx`)
- Login and sign-up are separate screens
- Sign out on profile screen

## Before finishing

```bash
npx tsc --noEmit
npx expo-doctor
```

Never commit `.env` or personal data.
