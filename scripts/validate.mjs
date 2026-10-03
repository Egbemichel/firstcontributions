// Validates every file in contributors/. Exits with an error if any file is invalid.
import { loadContributors } from '../lib/contributors.mjs';

const entries = await loadContributors();
let failed = 0;
for (const { file, errors } of entries) {
  if (!errors.length) continue;
  failed++;
  console.error(`✗ ${file}`);
  for (const error of errors) console.error(`  - ${error}`);
}
console.log(`${entries.length - failed}/${entries.length} contributor files are valid.`);
if (failed) process.exit(1);
