// Looks up the title and status of issues and pull requests listed by contributors.

const CONCURRENCY = 8;

function statusOf(item) {
  if (item.pull_request) {
    if (item.pull_request.merged_at) return 'merged';
    if (item.state === 'closed') return 'closed';
    return item.draft ? 'draft' : 'open';
  }
  if (item.state === 'open') return 'open';
  return item.state_reason === 'not_planned' ? 'not-planned' : 'completed';
}

async function fetchItem({ owner, repo, number }, token) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const item = await res.json();
  return {
    title: item.title,
    type: item.pull_request ? 'pull' : 'issue',
    status: statusOf(item),
    date: item.pull_request?.merged_at ?? item.closed_at ?? item.created_at,
  };
}

/** Adds title/status/date to each contribution. Failed lookups keep only what the URL tells us. */
export async function enrichContributions(contributors, { token, offline = false } = {}) {
  const all = contributors.flatMap((c) => c.contributions);
  if (offline) return;

  const cache = new Map();
  for (const c of all) if (!cache.has(c.url)) cache.set(c.url, c);
  const unique = [...cache.values()];
  const details = new Map();

  let next = 0;
  let failures = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, unique.length) }, async () => {
      while (next < unique.length) {
        const item = unique[next++];
        try {
          details.set(item.url, await fetchItem(item, token));
        } catch (err) {
          failures++;
          console.warn(`::warning::Could not load ${item.url}: ${err.message}`);
        }
      }
    }),
  );

  for (const c of all) Object.assign(c, details.get(c.url));
  console.log(`Loaded ${unique.length - failures}/${unique.length} contributions from GitHub.`);
}
