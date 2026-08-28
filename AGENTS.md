# Body Weight Tracker — Agent Guide

Personal Android app (Expo SDK 54). Keep changes small, readable, and consistent with existing patterns.

## Stack

- Expo + React Native + TypeScript
- Local storage only (`AsyncStorage`) — no backend, no auth
- React Navigation (bottom tabs)
- EAS Build for APK

Docs: [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)

## File naming

**Always use kebab-case** for files and folders:

```
app.tsx
screen-header.tsx
dashboard-screen.tsx
use-weight-entries.ts
```

- Single-word root modules are fine: `stats.ts`, `format.ts`, `types.ts`
- React component **names** stay PascalCase (`ScreenHeader`, `DashboardScreen`)
- Hook files: `use-*.ts` (e.g. `use-weight-entries.ts`)

## Project layout

```
app.tsx                 # Navigation shell
index.ts                # Expo entry
src/
  screens/              # One screen per file
  components/           # Reusable UI
  hooks/
  context/
  navigation/
  theme/
  stats.ts              # Pure date/stats logic (no UI)
  format.ts             # Formatting and parsing
  storage.ts            # AsyncStorage + export trigger
  export.ts             # Backup file I/O
  types.ts
```

## Coding rules

1. **Business logic in `src/`**, not in components — stats, dates, storage stay testable and UI-free.
2. **Minimal diffs** — no drive-by refactors or new dependencies without reason.
3. **Reuse** existing components (`screen-header`, `stats-summary`, `history-list`, etc.) before adding new ones.
4. **Shared state** via `weight-entries-context` — refresh entries after save/delete so all tabs stay in sync.
5. **Validate input** — weight 20–300 kg, 2 decimals; date ranges must have start ≤ end.
6. **No secrets in source** — no `.env` keys, signing files, or personal weight data in git.
7. **Comments** only for non-obvious logic; prefer clear names over comments.

## Data

- One entry per date (`YYYY-MM-DD`); save overwrites same day.
- Backup: `body-weight-backup.json` auto-exported on change (Android SAF).
- Averages use **logged days only**, not empty calendar days.

## UI conventions

- Page titles fixed at top via `screen-header` (outside `ScrollView`).
- Shared styles in `src/theme/styles.ts`.
- Dashboard default period: **This week** (Monday-start weeks).

## Before finishing

```bash
npx tsc --noEmit
npx expo-doctor
```

Fix type errors. Do not commit personal backup JSON or `node_modules`.

## Out of scope

- Cloud sync, accounts, charts, iOS, app store publishing
- Over-abstracting for a single-user app
