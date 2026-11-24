// Internal link check for the assembled site (used by build-pages.mjs; tested in check-links.test.mjs).
// Every href, src or action that starts with "/" must carry the base path and resolve to a regular file
// inside the output folder. A link to a folder counts only if the folder has an index.html.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

// href="…", href='…', href=… and spaces around "=" (HTML allows all of them).
const ATTR = /\s(href|src|action)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

const htmlFiles = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
});

const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

export function checkLinks(outDir, base) {
  const root = resolve(outDir);
  const problems = [];
  let checked = 0;
  for (const file of htmlFiles(root)) {
    const html = readFileSync(file, 'utf8');
    const where = file.slice(root.length);
    for (const m of html.matchAll(ATTR)) {
      const attr = m[1];
      const raw = (m[2] ?? m[3] ?? m[4] ?? '').replace(/&amp;/g, '&');
      if (!raw.startsWith('/') || raw.startsWith('//')) continue;   // relative, external, #anchor, mailto
      // Resolve "." and ".." the way a browser does, before checking the base.
      let pathname;
      try { pathname = decodeURIComponent(new URL(raw, 'https://site.invalid').pathname); }
      catch { problems.push(`${where}: ${attr}="${raw}" is not a valid URL`); continue; }
      if (!pathname.startsWith(base)) { problems.push(`${where}: ${attr}="${raw}" is outside the base ${base}`); continue; }
      checked++;
      let target = resolve(root, '.' + sep + pathname.slice(base.length));
      if (target !== root && !target.startsWith(root + sep)) { problems.push(`${where}: ${attr}="${raw}" points outside the site`); continue; }
      if (isDir(target)) target = join(target, 'index.html');
      if (!isFile(target)) problems.push(`${where}: ${attr}="${raw}" points to a missing file`);
    }
  }
  return { checked, problems };
}
