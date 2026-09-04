# Body Weight Tracker — Agent Guide

Personal Android app (Expo SDK 54). Supabase-backed, auth required.

## Stack

- Expo + React Native + TypeScript
- Supabase (`@supabase/supabase-js`) — auth + database
- React Navigation (auth stack + bottom tabs)
- `expo-localization` + `i18n-js` — English and Polish
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
  i18n/                 # language-context.tsx, locales/en.ts, locales/pl.ts
  theme/                # tokens.ts (palettes), theme-context.tsx, styles.ts
  stats.ts, height.ts, format.ts, types.ts
supabase/schema.sql          # bootstrap for NEW projects only
supabase/grants.sql          # safe to re-run anytime
supabase/migrations/         # one dated .sql file per change on live databases
supabase/migration-template.sql
```

## Database migrations

**Never delete or break existing user data.** Entries belong to real users.

Before touching production: follow **Production safety checklist** in [`README.md`](README.md). Local dev uses the same Supabase project as the APK; use a `+dev` email for sign-in in development (`src/dev-auth-guard.ts` enforces this when `__DEV__` is true).

- **New Supabase project:** run `supabase/schema.sql` once.
- **Project with data (you and friends):** add `supabase/migrations/YYYY-MM-DD-description.sql` (copy `supabase/migration-template.sql`). **Do not** re-run `schema.sql` on production to apply changes.

### Rules for every migration

1. **Additive first** — `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` (nullable or with a default), new indexes/policies/grants.
2. **Never** on live data tables: `DROP TABLE`, `TRUNCATE`, unscoped `DELETE`, or `DROP COLUMN` until data was copied elsewhere and the app no longer reads the column.
3. **Copy before reshape** — `INSERT … SELECT` with `ON CONFLICT DO NOTHING` (see `migrate-height-entries.sql`). Prefer several safe steps over one destructive step.
4. **Policies** — `DROP POLICY IF EXISTS` then `CREATE POLICY` does not delete rows; safe when permissions change.
5. **`grants.sql`** — safe to re-run anytime.
6. **CHECK constraints** — tightening can reject existing rows; migrate or widen data first, then add the stricter check.
7. **Keep `schema.sql` in sync** after a migration so new projects match production — but apply live changes only via `supabase/migrations/`.
8. **Verify** — in migration comments, note `SELECT count(*)` (or similar) before and after on affected tables.

When changing app code that reads/writes Supabase, ensure the migration ships **before** or **with** the app update so users never hit missing columns or tables.

## Data

- **No local weight storage** — all entries read/write via `src/supabase/weight-sync.ts`
- Height history in `height_entries` via `src/supabase/height-sync.ts` (one row per effective date; upsert overwrites same day). Weight can be logged without height. BMI is computed in the app from height effective on each weigh-in date (`getHeightAtDate` in `src/height.ts`); if no height covers that date, BMI shows as `"-"`
- AsyncStorage is only used by Supabase for auth session persistence, the BMI display preference (`src/storage/bmi-display-preference.ts`), the theme preference (`src/storage/theme-preference.ts`), the language preference (`src/storage/language-preference.ts`), and the unit preference (`src/storage/unit-preference.ts`)
- One weight entry per date per user; save overwrites same day
- RLS enforces `user_id = auth.uid()`

## Localization

- Supported locales: English (`en`) and Polish (`pl`)
- Profile → Appearance: System / English / Polski (stored in `@body-weight-app/language`)
- System follows the device locale; non-Polish devices default to English
- Components use `useTranslation()` from `src/i18n/language-context.tsx`
- Non-React modules use `t()` from `src/i18n/index.ts`
- Do not hardcode user-facing strings in components
- Date formatting uses `getDateLocale()` from `src/i18n/resolve-locale.ts` (not `undefined`)

## Theming

- All colors come from `src/theme/tokens.ts` (light + dark palettes). Never hardcode a hex value in a component.
- Components call `const styles = useAppStyles()` from `src/theme/styles.ts`. For props that cannot take a stylesheet (`placeholderTextColor`, `ActivityIndicator`, icons), read `useColors()`.
- Custom fonts mean `fontWeight` is ignored on Android — always set `fontFamily` from `fontFamily` in tokens.
- Scheme follows the device unless overridden on the profile screen.

## Auth

- App blocked until signed in (`root-navigator.tsx`)
- Login and sign-up are separate screens
- Sign out on profile screen

## Releases

Versions are managed by [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`.

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:` (minor), `fix:` (patch), `feat!:` or `BREAKING CHANGE:` (major). `chore:`, `ci:`, and `docs:` do not trigger a release.
- Husky runs commitlint on each local commit.
- CI bumps `app.json`, `package.json`, Android `versionCode`, and iOS `buildNumber`, then tags the release (e.g. `v1.1.0`).
- Tag the current `1.0.0` baseline once before the first automated release: `git tag v1.0.0 && git push origin v1.0.0`.
- After merging releasable commits, build a new APK/IPA so users get the bumped version shown on Profile.

## Before finishing

```bash
npx tsc --noEmit
npx expo-doctor
```

Never commit `.env` or personal data.
