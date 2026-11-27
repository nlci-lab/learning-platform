// Build-time pass: writes previews.json at the site root, the data for link previews (LinkPreview.astro).
// One entry per page, keyed by its path under the base ("guides/search/"): its heading and its meta description.
// One entry per anchor that carries data-preview (glossary terms: "glossary/#exegesis"), and per h2/h3 section
// with an id, from the first paragraph after it ("guides/search/#limits").
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name === 'index.html') yield p;
  }
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m);
const text = (html) => decode(html.replace(/<span class="visually-hidden">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const clip = (s, n = 320) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s);
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? decode(m[1]) : null; };

export function pagePreviews(html, path) {
  const out = {};
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? text(h1[1]) : text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '').split(' · ')[0];
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (title) out[path] = { t: title, d: desc ? clip(decode(desc[1])) : '' };
  const main = html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  for (const m of main.matchAll(/<[a-z0-9]+\b[^>]*\sdata-preview="[^"]*"[^>]*>/g)) {
    const id = attr(m[0], 'id');
    if (id) out[`${path}#${id}`] = { t: attr(m[0], 'data-preview-title') ?? title, d: clip(attr(m[0], 'data-preview')), in: title };
  }
  for (const m of main.matchAll(/<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    const id = attr(m[2], 'id');
    if (id && !out[`${path}#${id}`]) out[`${path}#${id}`] = { t: text(m[3]), d: clip(text(m[4])), in: title };
  }
  return out;
}

export default function previews() {
  return {
    name: 'link-previews',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const all = {};
        for await (const f of htmlFiles(root)) {
          const rel = relative(root, f).split(sep).slice(0, -1).join('/');
          Object.assign(all, pagePreviews(await readFile(f, 'utf8'), rel ? rel + '/' : ''));
        }
        await writeFile(join(root, 'previews.json'), JSON.stringify(all));
        logger.info(`link previews: ${Object.keys(all).length} entries`);
      },
    },
  };
}
