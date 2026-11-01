// Downloads the blog markdown repo ONCE at build time and writes it to
// src/data/github-blogs.json, so the site never calls GitHub at request time.
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

// Load .env.local for local runs (on Vercel the vars already exist)
for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined)
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const OWNER = process.env.NEXT_PUBLIC_REPO_OWNER;
const REPO = process.env.NEXT_PUBLIC_REPO_NAME;
const TOKEN = process.env.BLOG_GITHUB_TOKEN;
const OUT = join('src', 'data', 'github-blogs.json');

const git = (args, cwd) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });

function fail(msg) {
  console.error(`[sync-github-blogs] ${msg}`);
  process.exit(process.env.VERCEL ? 1 : 0);
}

if (!process.env.BLOG_REPO_URL && (!OWNER || !REPO))
  fail('NEXT_PUBLIC_REPO_OWNER / NEXT_PUBLIC_REPO_NAME are not set.');

const url =
  process.env.BLOG_REPO_URL ??
  (TOKEN
    ? `https://x-access-token:${TOKEN}@github.com/${OWNER}/${REPO}.git`
    : `https://github.com/${OWNER}/${REPO}.git`);

const tmp = mkdtempSync(join(tmpdir(), 'blogs-'));
try {
  // Full history (no --depth) so we can read each file's last commit date locally.
  git(['clone', '--quiet', '--branch', 'main', url, tmp]);

  const entries = git(['ls-tree', '-r', '-z', 'HEAD'], tmp)
    .split('\0')
    .filter(Boolean)
    .map((e) => {
      const [meta, path] = e.split('\t');
      const [, type, sha] = meta.split(' ');
      return { type, sha, path };
    })
    .filter((e) => e.type === 'blob' && e.path.endsWith('.md'));

  const posts = entries.map(({ path, sha }) => ({
    path,
    sha,
    raw: readFileSync(join(tmp, path), 'utf8'),
    date: git(['log', '-1', '--format=%cI', '--', path], tmp).trim() || null,
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(posts));
  console.log(`[sync-github-blogs] saved ${posts.length} posts -> ${OUT}`);
} catch (err) {
  fail(`sync failed: ${err.message?.replace(TOKEN ?? '@@', '***')}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}