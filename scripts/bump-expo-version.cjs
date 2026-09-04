const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error('Usage: node scripts/bump-expo-version.cjs <version>');
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

const appJsonPath = path.join(root, 'app.json');
const appJson = readJson(appJsonPath);
appJson.expo.version = version;
writeJson(appJsonPath, appJson);

const packageJsonPath = path.join(root, 'package.json');
const packageJson = readJson(packageJsonPath);
packageJson.version = version;
writeJson(packageJsonPath, packageJson);

const lockPath = path.join(root, 'package-lock.json');
const lock = readJson(lockPath);
lock.version = version;
if (lock.packages?.['']) {
  lock.packages[''].version = version;
}
writeJson(lockPath, lock);

const appConfigPath = path.join(root, 'app.config.ts');
let appConfig = fs.readFileSync(appConfigPath, 'utf8');

const versionCodeMatch = appConfig.match(/versionCode:\s*(\d+)/);
const nextBuildNumber = versionCodeMatch ? Number.parseInt(versionCodeMatch[1], 10) + 1 : 1;

appConfig = appConfig.replace(/versionCode:\s*\d+/, `versionCode: ${nextBuildNumber}`);
appConfig = appConfig.replace(
  /buildNumber:\s*['"]?\d+['"]?/,
  `buildNumber: '${nextBuildNumber}'`,
);

fs.writeFileSync(appConfigPath, appConfig);

console.log(`Bumped app version to ${version} (build ${nextBuildNumber})`);
