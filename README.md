# Body Weight Tracker

A minimal Android app for logging daily body weight in kilograms (2 decimal places), viewing averages over custom periods, and auto-exporting backups to a folder you choose.

## Features

- Log one weight per day (editing the same date overwrites the previous value)
- View averages for 7 days, 30 days, 1 year, or a custom day count
- Auto-export `body-weight-backup.json` on every save, edit, or delete
- Import a backup file to restore entries

## Development

```bash
npm install
npm run android
```

## Build APK (install on your phone)

1. Install dependencies: `npm install`
2. Log in to Expo: `npx eas login`
3. Configure the project (first time only): `npx eas build:configure`
4. Build APK: `npx eas build -p android --profile preview`
5. Download the APK from the Expo build page and install it on your Android phone

You may need to allow installation from unknown sources in Android settings.

## Backup format

```json
{
  "exportedAt": "2026-08-27T14:30:00.000Z",
  "entries": [
    { "date": "2026-08-27", "weightKg": 65.25 }
  ]
}
```

On first save, the app asks you to pick a backup folder. After that, every change rewrites `body-weight-backup.json` in that folder.

## Publish to GitHub (private)

Git is initialized and changes are committed locally. To create the private repo and push:

```bash
gh auth login
gh repo create body-weight-app --private --source=. --remote=origin --push
```

If `body-weight-app` is already taken on your account, use another name and update the remote URL.

## Notes

- Weight data stays on your phone and in your chosen backup folder
- Personal weight entries are not stored in this GitHub repo
