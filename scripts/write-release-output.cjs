const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  process.exit(0);
}

fs.writeFileSync(path.join(__dirname, '..', '.release-version'), `${version}\n`);
