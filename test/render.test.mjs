import assert from 'node:assert/strict';
import { test } from 'node:test';
import config from '../site.config.mjs';
import { parseContributionUrl } from '../lib/contributors.mjs';
import { renderIndex, renderProfile } from '../lib/render.mjs';

const contributor = {
  github: 'octocat',
  name: '<script>alert(1)</script>',
  bio: 'Hello & welcome',
  website: 'https://example.org/"onmouseover="x',
  contributions: [{ ...parseContributionUrl('https://github.com/a/b/pull/1'), title: 'Fix <b>bug</b>', status: 'merged' }],
};

test('user content is escaped', () => {
  const page = renderIndex({ config, contributors: [contributor] }) + renderProfile({ config, contributor });
  assert.ok(!page.includes('<script>alert'));
  assert.ok(!page.includes('<b>bug'));
  assert.ok(!page.includes('"onmouseover'));
  assert.ok(page.includes('Hello &amp; welcome'));
});

test('profile shows contributions and an edit link', () => {
  const page = renderProfile({ config, contributor });
  assert.match(page, /Merged/);
  assert.ok(page.includes(`https://github.com/${config.repo}/edit/${config.branch}/contributors/octocat.yml`));
});
