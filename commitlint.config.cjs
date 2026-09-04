/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // semantic-release commits include changelog lines that exceed body-max-line-length
  ignores: [(message) => /^chore\(release\):/.test(message)],
};
