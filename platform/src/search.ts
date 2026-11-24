// Search index for a course, built with the site and fetched by the search page on first use.
// Course route (src/pages/search.json.ts):  export { GET } from '@cohorts/platform/search';
import type { APIRoute } from 'astro';
import { getModules, getGuides, getGlossary, getGuidePaths } from './data';
import { plain } from './markdown';
import { PATHS } from './paths';
import GithubSlugger from 'github-slugger';

// Same heading ids as Astro's Markdown (github-slugger).
const slugger = new GithubSlugger();

export interface SearchEntry { kind: 'Micro module' | 'Guide' | 'Glossary' | 'Section'; title: string; ctx: string; href: string; text: string }

export async function searchIndex(): Promise<SearchEntry[]> {
  const out: SearchEntry[] = [];
  for (const { data: m } of await getModules()) {
    const words = [m.title, m.topic, m.question, m.skill, m.lead, ...m.steps.flatMap((s) => [s.title, s.body ?? '', s.question?.prompt ?? ''])];
    out.push({ kind: 'Micro module', title: m.title, ctx: m.skill, href: PATHS.module(m.id), text: plain(words.join(' ')).toLowerCase() });
  }
  const guidePaths = await getGuidePaths();
  for (const g of await getGuides()) {
    const d = g.data;
    // The body is indexed too (Markdown stripped, capped so the index stays small). For MDX, drop the
    // import/export lines and component tags first; they are code, not text.
    const source = (g.body ?? '').replace(/^\s*(import|export)\s.*$/gm, ' ').replace(/<\/?[A-Z][^>]*>/g, ' ');
    const body = plain(source.replace(/^#+\s.*$/gm, ' ')).slice(0, 4000);
    const tags = d.tags.map((t) => `#${t} ${t.replace(/-/g, ' ')}`).join(' ');
    out.push({ kind: 'Guide', title: d.title, ctx: `${d.summary} ${d.tags.map((t) => '#' + t).join(' ')}`, href: guidePaths.get(d.id)!, text: plain([d.title, d.cover, d.summary, ...d.learn].join(' ')).toLowerCase() + ' ' + tags + ' ' + body.toLowerCase() });
    // Markdown guides carry their headings; for MDX, read the ## and ### lines from the source.
    slugger.reset();
    const headings = (g.rendered?.metadata?.headings as { depth: number; slug: string; text: string }[] | undefined)
      ?? [...source.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)].map((m) => ({ depth: m[1].length, text: plain(m[2]), slug: slugger.slug(plain(m[2])) }));
    for (const h of headings) {
      if (h.depth === 2 || h.depth === 3)
        out.push({ kind: 'Section', title: h.text, ctx: `Section in “${d.title}”`, href: `${guidePaths.get(d.id)}#${h.slug}`, text: `${h.text} ${d.title}`.toLowerCase() });
    }
  }
  for (const grp of await getGlossary()) for (const t of grp.entries) {
    out.push({ kind: 'Glossary', title: t.term, ctx: plain(t.plain), href: `${PATHS.glossary}#${t.id}`, text: plain(`${t.term} ${t.plain}`).toLowerCase() });
  }
  return out;
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await searchIndex()), { headers: { 'Content-Type': 'application/json' } });
