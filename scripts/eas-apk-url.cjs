const fs = require('fs');

const raw = fs.readFileSync(process.argv[2] || 'eas-android.json', 'utf8');
const startArray = raw.indexOf('[');
const startObject = raw.indexOf('{');
const start =
  startArray === -1
    ? startObject
    : startObject === -1
      ? startArray
      : Math.min(startArray, startObject);

if (start === -1) {
  console.error(raw);
  throw new Error('EAS build did not print JSON');
}

const data = JSON.parse(raw.slice(start));
const build = Array.isArray(data) ? data[0] : data;
const url = build?.artifacts?.applicationArchiveUrl || build?.artifacts?.buildUrl;

if (build?.status && build.status !== 'FINISHED') {
  throw new Error(`EAS build status is ${build.status}`);
}

if (!url) {
  console.error(JSON.stringify(build, null, 2));
  throw new Error('EAS build JSON has no APK URL');
}

process.stdout.write(url);
