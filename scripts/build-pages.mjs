// Builds the whole public site into _site/ (ADR 0001): the master site at the base path and every
// course in courses/<id>/ at <base><id>/. Then checks that every internal link and image resolves.
//   node scripts/build-pages.mjs                       base /learning-platform/ (GitHub Pages)
//   PAGES_BASE=/ node scripts/build-pages.mjs          base / (local test)
// SITE_URL sets the site origin (default https://nlci-lab.github.io).
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkLinks } from './check-links.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.env.PAGES_BASE ?? '/learning-platform/').replace(/\/?$/, '/');
const site = process.env.SITE_URL ?? 'https://nlci-lab.github.io';
const out = join(root, '_site');

const courses = readdirSync(join(root, 'courses')).filter((d) => existsSync(join(root, 'courses', d, 'package.json')));

function build(dir, siteBase) {
  const pkg = JSON.parse(readFileSync(join(root, dir, 'package.json'), 'utf8')).name;
  console.log(`\n▶ ${pkg} at ${siteBase}`);
  execSync(`npm run build -w ${pkg}`, { cwd: root, stdio: 'inherit', env: { ...process.env, SITE_BASE: siteBase, SITE_URL: site } });
  return join(root, dir, 'dist');
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(build('site', base), out, { recursive: true });
for (const id of courses) cpSync(build(`courses/${id}`, `${base}${id}/`), join(out, id), { recursive: true });

// Every internal href/src/action must carry the base and resolve to a file in _site (scripts/check-links.mjs).
const { checked, problems } = checkLinks(out, base);
console.log(`\nLink check: ${checked} internal links and images, ${problems.length} problems.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Site ready in _site/ (master site + ${courses.join(', ')}).`);
