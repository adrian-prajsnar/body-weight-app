import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const accent = '#4F46E5';
const accentSoft = '#EEF2FF';
const splashBackground = '#F6F7F9';

/** Rising geometric W. Keep in sync with src/components/brand-logo.tsx and website/src/components/brand-logo.astro. */
const MARK_POINTS = [
  [5, 7.5],
  [11, 19],
  [16, 12.5],
  [22.5, 24.8],
  [27, 7.5],
];
const MARK_STROKE_AT_32 = 3.6;

function wPolyline(size, { stroke = accent, inset = 0 } = {}) {
  const inner = size - inset * 2;
  const scale = inner / 32;
  const points = MARK_POINTS.map(([x, y]) => `${inset + x * scale},${inset + y * scale}`).join(' ');
  const strokeWidth = MARK_STROKE_AT_32 * scale;
  return `<polyline points="${points}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function svg({ width, height, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

function renderPng(svgMarkup, width) {
  const resvg = new Resvg(svgMarkup, {
    fitTo: { mode: 'width', value: width },
  });
  return resvg.render().asPng();
}

async function writePng(relativePath, buffer) {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
}

const iconTile = (size, radius) =>
  `<rect width="${size}" height="${size}" rx="${radius}" fill="${accentSoft}"/>${wPolyline(size)}`;

const assets = [
  {
    path: 'assets/icon.png',
    width: 1024,
    svg: svg({
      width: 1024,
      height: 1024,
      body: iconTile(1024, 226),
    }),
  },
  {
    path: 'assets/favicon.png',
    width: 48,
    svg: svg({
      width: 48,
      height: 48,
      body: iconTile(48, 10),
    }),
  },
  {
    path: 'assets/splash-icon.png',
    width: 512,
    svg: svg({
      width: 512,
      height: 512,
      body: `<rect width="512" height="512" fill="${splashBackground}"/>${wPolyline(512, { inset: 48 })}`,
    }),
  },
  {
    path: 'assets/android-icon-foreground.png',
    width: 1024,
    svg: svg({
      width: 1024,
      height: 1024,
      body: wPolyline(1024, { inset: 168 }),
    }),
  },
  {
    path: 'assets/android-icon-background.png',
    width: 1024,
    svg: svg({
      width: 1024,
      height: 1024,
      body: `<rect width="1024" height="1024" fill="${accentSoft}"/>`,
    }),
  },
  {
    path: 'assets/android-icon-monochrome.png',
    width: 1024,
    svg: svg({
      width: 1024,
      height: 1024,
      body: wPolyline(1024, { inset: 168, stroke: '#000000' }),
    }),
  },
  {
    path: 'website/public/app-icon.png',
    width: 1024,
    svg: svg({
      width: 1024,
      height: 1024,
      body: iconTile(1024, 226),
    }),
  },
  {
    path: 'website/public/favicon.png',
    width: 48,
    svg: svg({
      width: 48,
      height: 48,
      body: iconTile(48, 10),
    }),
  },
];

for (const asset of assets) {
  const png = renderPng(asset.svg, asset.width);
  await writePng(asset.path, png);
  console.log(`wrote ${asset.path}`);
}
