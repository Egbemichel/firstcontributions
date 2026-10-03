// Checks a pull request's contributor files and writes a Markdown report for the bot comment.
// Run by .github/workflows/check-contribution.yml. Expects GITHUB_TOKEN, GITHUB_REPOSITORY,
// PR_NUMBER, PR_AUTHOR, PR_ASSOCIATION and the pull request head checked out in PR_ROOT.
import { appendFile, writeFile } from 'node:fs/promises';
import config from '../site.config.mjs';
import { checkPullRequest, formatReport } from '../lib/check.mjs';

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_OUTPUT, PR_NUMBER, PR_AUTHOR, PR_ASSOCIATION, AUTO_MERGE } = process.env;
const root = process.env.PR_ROOT ?? 'pr';
const reportPath = process.env.REPORT_PATH ?? 'report.md';

async function listChangedFiles() {
  const files = [];
  for (let page = 1; page <= 30; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}/files?per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) throw new Error(`Listing pull request files failed: ${res.status} ${await res.text()}`);
    const batch = await res.json();
    files.push(...batch);
    if (batch.length < 100) break;
  }
  return files;
}

const changed = await listChangedFiles();
const result = await checkPullRequest({ root, changed, author: PR_AUTHOR, association: PR_ASSOCIATION });
const report = formatReport(result, { author: PR_AUTHOR, siteUrl: config.siteUrl, autoMerge: AUTO_MERGE === 'true' });

await writeFile(reportPath, report);
console.log(report);
if (GITHUB_OUTPUT) {
  await appendFile(GITHUB_OUTPUT, `ok=${result.ok}\nautomerge=${result.autoMergeable}\n`);
}
