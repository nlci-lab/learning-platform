// Builds the whole public site into _site/ (ADR 0001): the master site at the base path and every
// course in courses/<id>/ at <base><id>/. Then checks that every internal link and image resolves.
//   node scripts/build-pages.mjs                       base /learning-platform/ (GitHub Pages)
//   PAGES_BASE=/ node scripts/build-pages.mjs          base / (local test)
// SITE_URL sets the origin used for canonical and external-link checks (default https://nlci-lab.github.io).
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

// Link check: every href/src that starts with the base must point to a file in _site.
const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
});
const problems = [];
let checked = 0;
for (const file of htmlFiles(out)) {
  const html = readFileSync(file, 'utf8');
  for (const [, attr, value] of html.matchAll(/\s(href|src|action)="([^"]*)"/g)) {
    if (!value.startsWith('/')) continue;                       // relative, external, #anchor, mailto
    const rel = file.slice(out.length);
    if (!value.startsWith(base)) { problems.push(`${rel}: ${attr}="${value}" is missing the base ${base}`); continue; }
    let path = decodeURI(value.slice(base.length).split(/[?#]/)[0]);
    if (path === '' || path.endsWith('/')) path += 'index.html';
    checked++;
    if (!existsSync(join(out, path))) problems.push(`${rel}: ${attr}="${value}" points to a missing file`);
  }
}
console.log(`\nLink check: ${checked} internal links and images, ${problems.length} problems.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`Site ready in _site/ (master site + ${courses.join(', ')}).`);
