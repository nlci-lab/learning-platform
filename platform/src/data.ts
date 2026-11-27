// Reading a course's content collections, with the checks a schema cannot do on one file alone.
// Drafts are left out of production builds and shown in `astro dev`.
import { getCollection, type CollectionEntry } from 'astro:content';
import { checkSeries, guidePath, seriesParts } from './series';

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

/** Guides, easiest first. Fails the build if `before` or `related` names a guide that does not exist,
    or on a series problem (see series.ts). Cached for the length of a production build. */
export function getGuides() {
  if (import.meta.env.PROD) return (guidesCache ??= loadGuides());
  return loadGuides();
}
let guidesCache: ReturnType<typeof loadGuides> | undefined;
async function loadGuides() {
  const all = (await getCollection('guides')).filter(live);
  const ids = new Set(all.map((g) => g.data.id));
  for (const { data: g } of all) for (const ref of [g.before, ...g.related].filter(Boolean) as string[]) {
    if (!ids.has(ref)) throw new Error(`Guide "${g.id}" links to guide "${ref}", which does not exist (or is a draft).`);
  }
  const series = (await getCollection('series')).map((s) => s.data);
  checkSeries(series, all.map((g) => g.data));
  const sorted = all.sort((a, b) => a.data.level - b.data.level || a.data.title.localeCompare(b.data.title, 'en'));
  const bySeries = new Map(series.map((x) => [x.id, x]));
  const paths = new Map(sorted.map((g) => [g.data.id, guidePath(g.data, bySeries)]));
  return Object.assign(sorted, { series, paths });
}

/** Where each guide lives: a series part at <series path><id>/, any other guide at guides/<id>/. */
export async function getGuidePaths() {
  return (await getGuides()).paths;
}

/** A series with its live parts in reading order. Undefined if there is no such series.
    Show a part's number as its position in `parts` (1-based), not its `series.part`, so drafts leave no gap. */
export async function getSeries(id: string) {
  const all = await getGuides();
  const s = all.series.find((x) => x.id === id);
  if (!s) return undefined;
  const parts = seriesParts(id, all.map((g) => g.data)).map((d) => all.find((g) => g.data.id === d.id)!);
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

/** Checking cases (ADR 0006). A case not yet reviewed is a draft: shown in `astro dev`, left out of
    production builds. Fails the build if two questions in the course's cases share an id. */
export async function getCases() {
  const all = (await getCollection('cases')).filter((c) => import.meta.env.DEV || c.data.review !== 'draft');
  const seen = new Map<string, string>();
  for (const c of all) for (const q of c.data.questions) {
    if (seen.has(q.id)) throw new Error(`Question id "${q.id}" is used in case "${seen.get(q.id)}" and case "${c.data.id}".`);
    seen.set(q.id, c.data.id);
  }
  const ord = (c: CaseEntry) => c.data.order ?? Number.MAX_SAFE_INTEGER;
  return all.sort((a, b) => ord(a) - ord(b) || a.data.level - b.data.level || a.data.title.localeCompare(b.data.title, 'en'));
}
export type CaseEntry = CollectionEntry<'cases'>;
/** getStaticPaths for src/pages/cases/[id].astro */
export async function caseStaticPaths() {
  return (await getCases()).map((entry) => ({ params: { id: entry.data.id }, props: { entry } }));
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
