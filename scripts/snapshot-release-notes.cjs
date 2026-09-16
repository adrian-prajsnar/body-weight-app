const fs = require('fs');
const path = require('path');
const {
  NOTES_DIR,
  formatNotesFile,
  loadChangelogVersions,
  notesPath,
  translateToPolish,
} = require('./user-facing-notes.cjs');

async function snapshotVersion(entry, { translate }) {
  fs.mkdirSync(NOTES_DIR, { recursive: true });

  const englishPath = notesPath(entry.version, 'en');
  if (fs.existsSync(englishPath)) {
    console.log(`Kept existing English notes for ${entry.version}`);
  } else {
    fs.writeFileSync(
      englishPath,
      formatNotesFile({ version: entry.version, date: entry.date, body: entry.body }),
      'utf8',
    );
    console.log(`Wrote customer-facing English notes for ${entry.version}`);
  }

  const polishPath = notesPath(entry.version, 'pl');
  if (fs.existsSync(polishPath)) {
    console.log(`Kept existing Polish notes for ${entry.version}`);
    return;
  }

  if (!translate) {
    throw new Error(
      `Missing Polish notes for ${entry.version} (${path.basename(polishPath)}). Re-run with DeepL or add an override file.`,
    );
  }

  const englishBody = fs.existsSync(englishPath)
    ? require('./user-facing-notes.cjs').parseNotesFile(fs.readFileSync(englishPath, 'utf8')).body
    : entry.body;

  const translated = await translateToPolish(englishBody);
  fs.writeFileSync(
    polishPath,
    formatNotesFile({ version: entry.version, date: entry.date, body: translated }),
    'utf8',
  );
  console.log(`Wrote Polish notes for ${entry.version}`);
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const force = args.includes('--force');
  const versionArg = args.find((arg) => !arg.startsWith('--'));
  const versions = loadChangelogVersions();

  if (versions.length === 0) {
    throw new Error('CHANGELOG.md has no version sections');
  }

  const selected = all
    ? versions
    : versions.filter((entry) => entry.version === versionArg);

  if (!all && !versionArg) {
    throw new Error(
      'Usage: node scripts/snapshot-release-notes.cjs <version> | --all [--force]',
    );
  }

  if (selected.length === 0) {
    throw new Error(`No CHANGELOG section found for ${versionArg}`);
  }

  if (force) {
    for (const entry of selected) {
      for (const locale of ['en', 'pl']) {
        const filePath = notesPath(entry.version, locale);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  }

  for (const entry of selected) {
    await snapshotVersion(entry, { translate: true });
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
