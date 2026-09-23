import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sourcePath = path.join(root, 'src', 'theme', 'styles.ts');
const outDir = path.join(root, 'src', 'theme', 'styles');

const sections = [
  { file: 'screen.ts', exportName: 'createScreenStyles', start: 'screen:', end: 'authMain:' },
  {
    file: 'auth.ts',
    exportName: 'createAuthStyles',
    start: 'authMain:',
    end: 'content:',
  },
  {
    file: 'layout.ts',
    exportName: 'createLayoutStyles',
    start: 'content:',
    end: 'fieldLabel:',
  },
  {
    file: 'forms.ts',
    exportName: 'createFormStyles',
    start: 'fieldLabel:',
    end: 'statGrid:',
  },
  {
    file: 'dashboard.ts',
    exportName: 'createDashboardStyles',
    start: 'statGrid:',
    end: 'historyGroup:',
  },
  {
    file: 'lists.ts',
    exportName: 'createListStyles',
    start: 'historyGroup:',
    end: 'rangeRow:',
  },
  {
    file: 'profile.ts',
    exportName: 'createProfileStyles',
    start: 'rangeRow:',
    end: 'toastRoot:',
  },
  {
    file: 'overlays.ts',
    exportName: 'createOverlayStyles',
    start: 'toastRoot:',
    end: 'weightEntryRow:',
  },
  {
    file: 'entry-form.ts',
    exportName: 'createEntryFormStyles',
    start: 'weightEntryRow:',
    end: null,
  },
];

const source = fs.readFileSync(sourcePath, 'utf8');
const createStart = source.indexOf('return StyleSheet.create({');
const createEnd = source.lastIndexOf('  });');
const body = source.slice(createStart, createEnd);

function extractBlock(startMarker, endMarker) {
  const start = body.indexOf(`    ${startMarker}`);
  if (start === -1) {
    throw new Error(`Missing start marker: ${startMarker}`);
  }
  const end = endMarker ? body.indexOf(`    ${endMarker}`, start + 1) : body.length;
  if (end === -1) {
    throw new Error(`Missing end marker: ${endMarker}`);
  }
  return body.slice(start, end).trimEnd().replace(/,\s*$/, '');
}

const header = `import { Platform, StyleSheet } from 'react-native';
import { fontFamily, radius, spacing } from '../tokens';
import { StyleContext, cardSurface, floatingSurface, tabularNums } from './helpers';
`;

fs.mkdirSync(outDir, { recursive: true });

for (const section of sections) {
  const block = extractBlock(section.start, section.end);
  const content = `${header}
export function ${section.exportName}({ colors, scheme }: StyleContext) {
  return {
${block.replace(/^    /gm, '    ')},
  };
}
`;
  fs.writeFileSync(path.join(outDir, section.file), content);
}

console.log(`Wrote ${sections.length} style modules to ${outDir}`);
