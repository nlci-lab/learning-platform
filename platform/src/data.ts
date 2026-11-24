// Reading a course's content collections, with the checks a schema cannot do on one file alone.
// Drafts are left out of production builds and shown in `astro dev`.
import { getCollection, type CollectionEntry } from 'astro:content';
import { PATHS } from './paths';

const live = <T extends { data: { draft?: boolean } }>(e: T) => import.meta.env.DEV || !e.data.draft;

/** Micro modules, easiest first. Fails the build if two questions in the course share an id (ADR 0002). */
export async function getModules() {
  const all = (await getCollection('modules')).filter(live);
  const seen = new Map<string, string>();
  for (const m of all) for (const s of m.data.steps) {
    const id = s.question?.id;
    if (!id) continue;
    if (seen.has(id)) throw new Error(`Question id "${id}" is used in module "${seen.get(id)}" and module "${m.data.id}". Question ids must be unique in a course.`);
    seen.set(id, m.data.id);
  }
  const ord = (m: ModuleEntry) => m.data.order ?? Number.MAX_SAFE_INTEGER;
  return all.sort((a, b) => ord(a) - ord(b) || a.data.level - b.data.level || a.data.title.localeCompare(b.data.title, 'en'));
}

/** Guides, easiest first. Fails the build if `before` or `related` names a guide that does not exist. */
export async function getGuides() {
  const all = (await getCollection('guides')).filter(live);
  const ids = new Set(all.map((g) => g.data.id));
  for (const { data: g } of all) for (const ref of [g.before, ...g.related].filter(Boolean) as string[]) {
    if (!ids.has(ref)) throw new Error(`Guide "${g.id}" links to guide "${ref}", which does not exist (or is a draft).`);
  }
  // Series parts: the series must exist and part numbers must be unique within it.
  const seriesIds = new Set((await getCollection('series')).map((s) => s.data.id));
  const parts = new Map<string, string>();
  for (const { data: g } of all) if (g.series) {
    if (!seriesIds.has(g.series.id)) throw new Error(`Guide "${g.id}" is part of series "${g.series.id}", which is not in series.yaml.`);
    const key = `${g.series.id}#${g.series.part}`;
    if (parts.has(key)) throw new Error(`Guides "${parts.get(key)}" and "${g.id}" are both part ${g.series.part} of series "${g.series.id}".`);
    parts.set(key, g.id);
  }
  return all.sort((a, b) => a.data.level - b.data.level || a.data.title.localeCompare(b.data.title, 'en'));
}

/** Where each guide lives: a series part at <series path><id>/, any other guide at guides/<id>/. */
export async function getGuidePaths() {
  const series = new Map((await getCollection('series')).map((s) => [s.data.id, s.data]));
  const out = new Map<string, string>();
  for (const { data: g } of await getGuides()) {
    const s = g.series && series.get(g.series.id);
    out.set(g.id, s ? `${s.path}${g.id}/` : PATHS.guide(g.id));
  }
  return out;
}

/** A series with its parts in order. Undefined if there is no such series. */
export async function getSeries(id: string) {
  const s = (await getCollection('series')).find((x) => x.data.id === id)?.data;
  if (!s) return undefined;
  const parts = (await getGuides()).filter((g) => g.data.series?.id === id).sort((a, b) => a.data.series!.part - b.data.series!.part);
  return { ...s, parts };
}

/** All glossary entries in file order, each with its group's style. */
export async function getGlossaryEntries() {
  const style = new Map((await getCollection('glossaryGroups')).map((g) => [g.data.id, g.data.style]));
  return (await getCollection('glossary')).map((e) => ({ ...e.data, style: style.get(e.data.group) ?? 'word' }));
}

/** Glossary groups in order, each with its entries (file order). Fails the build on an unknown group. */
export async function getGlossary() {
  const groups = (await getCollection('glossaryGroups')).map((g) => g.data).sort((a, b) => a.order - b.order);
  const entries = (await getCollection('glossary')).map((e) => e.data);
  const ids = new Set(groups.map((g) => g.id));
  for (const e of entries) if (!ids.has(e.group)) throw new Error(`Glossary entry "${e.id}" names group "${e.group}", which is not in glossary-groups.yaml.`);
  return groups.map((g) => ({ ...g, entries: entries.filter((e) => e.group === g.id) }));
}

export type ModuleEntry = CollectionEntry<'modules'>;
export type GuideEntry = CollectionEntry<'guides'>;

/** getStaticPaths for src/pages/practice/[id].astro */
export async function moduleStaticPaths() {
  return (await getModules()).map((entry) => ({ params: { id: entry.data.id }, props: { entry } }));
}
/** getStaticPaths for src/pages/guides/[id].astro: every guide that is not part of a series. */
export async function guideStaticPaths() {
  return (await getGuides()).filter((g) => !g.data.series).map((entry) => ({ params: { id: entry.data.id }, props: { entry } }));
}
/** getStaticPaths for a series' part pages, e.g. src/pages/learn/decisions/[id].astro. */
export function seriesStaticPaths(seriesId: string) {
  return async () => (await getGuides()).filter((g) => g.data.series?.id === seriesId).map((entry) => ({ params: { id: entry.data.id }, props: { entry } }));
}
