import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkPullRequest, formatReport, COMMENT_MARKER } from '../lib/check.mjs';

async function prRoot(files) {
  const root = await mkdtemp(path.join(tmpdir(), 'pr-'));
  await mkdir(path.join(root, 'contributors'));
  for (const [name, content] of Object.entries(files)) await writeFile(path.join(root, name), content);
  return root;
}

const added = (filename) => ({ status: 'added', filename });

test('a valid file from its owner can be merged automatically', async () => {
  const root = await prRoot({ 'contributors/octocat.yml': 'github: octocat\nname: Mona\n' });
  const result = await checkPullRequest({ root, changed: [added('contributors/octocat.yml')], author: 'OctoCat', association: 'NONE' });
  assert.equal(result.ok, true);
  assert.equal(result.autoMergeable, true);
  const report = formatReport(result, { author: 'OctoCat', siteUrl: 'https://example.org/', autoMerge: true });
  assert.ok(report.startsWith(COMMENT_MARKER));
  assert.match(report, /merged automatically/);
});

test("contributors can't edit someone else's file", async () => {
  const root = await prRoot({ 'contributors/someone.yml': 'github: someone\nname: Someone\n' });
  const result = await checkPullRequest({ root, changed: [added('contributors/someone.yml')], author: 'octocat', association: 'NONE' });
  assert.equal(result.ok, false);
  assert.match(result.problems.get('contributors/someone.yml')[0], /only add or edit your own file/);
});

test('maintainers can edit any file, but their PRs are not auto-merged when touching code', async () => {
  const root = await prRoot({ 'contributors/someone.yml': 'github: someone\nname: Someone\n' });
  const changed = [{ status: 'modified', filename: 'contributors/someone.yml' }, { status: 'modified', filename: 'lib/render.mjs' }];
  const result = await checkPullRequest({ root, changed, author: 'admin', association: 'MEMBER' });
  assert.equal(result.ok, true);
  assert.equal(result.autoMergeable, false);
  assert.equal(result.notes.length, 1);
});

test('a file created outside contributors/ gets a hint', async () => {
  const root = await prRoot({ 'octocat.yml': 'github: octocat\nname: Mona\n' });
  const result = await checkPullRequest({ root, changed: [added('octocat.yml')], author: 'octocat', association: 'NONE' });
  assert.equal(result.ok, false);
  assert.match(result.problems.get('octocat.yml')[0], /inside the `contributors` folder/);
});

test('validation errors are listed in the report', async () => {
  const root = await prRoot({ 'contributors/octocat.yml': 'github: octocat\n' });
  const result = await checkPullRequest({ root, changed: [added('contributors/octocat.yml')], author: 'octocat', association: 'NONE' });
  const report = formatReport(result, { author: 'octocat', siteUrl: 'https://example.org/', autoMerge: false });
  assert.match(report, /`name` is missing/);
  assert.match(report, /Edit file/);
});

test('removing your own file is allowed', async () => {
  const root = await prRoot({});
  const changed = [{ status: 'removed', filename: 'contributors/octocat.yml' }];
  const result = await checkPullRequest({ root, changed, author: 'octocat', association: 'NONE' });
  assert.equal(result.ok, true);
});
