import assert from 'node:assert/strict';
import { test } from 'node:test';
import config from '../site.config.mjs';
import { parseContributionUrl } from '../lib/contributors.mjs';
import { renderProfile } from '../lib/render.mjs';

const contributor = {
  github: 'octocat',
  name: 'Mona Lisa',
  bio: null,
  website: null,
  contributions: [{ ...parseContributionUrl('https://github.com/a/b/pull/1'), status: 'merged' }],
};

test('profile defaults to English', () => {
  const page = renderProfile({ config, contributor });
  assert.match(page, /<html lang="en">/);
  assert.match(page, /Merged/);
});

test('profile renders in French when locale is fr', () => {
  const page = renderProfile({ config, contributor, locale: 'fr' });
  assert.match(page, /<html lang="fr">/);
  assert.match(page, /Fusionnée/);
  assert.match(page, /Tous les contributeurs/);
});
