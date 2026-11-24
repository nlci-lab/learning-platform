// Reading a course's content collections, with the checks a schema cannot do on one file alone.
// Drafts are left out of production builds and shown in `astro dev`.
import { getCollection, type CollectionEntry } from 'astro:content';

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
  return all.sort((a, b) => a.data.level - b.data.level || a.data.title.localeCompare(b.data.title));
}

/** Guides, easiest first. Fails the build if `before` or `related` names a guide that does not exist. */
export async function getGuides() {
  const all = (await getCollection('guides')).filter(live);
  const ids = new Set(all.map((g) => g.data.id));
  for (const { data: g } of all) for (const ref of [g.before, ...g.related].filter(Boolean) as string[]) {
    if (!ids.has(ref)) throw new Error(`Guide "${g.id}" links to guide "${ref}", which does not exist (or is a draft).`);
  }
  return all.sort((a, b) => a.data.level - b.data.level || a.data.title.localeCompare(b.data.title, 'en'));
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
/** getStaticPaths for src/pages/guides/[id].astro */
export async function guideStaticPaths() {
  return (await getGuides()).map((entry) => ({ params: { id: entry.data.id }, props: { entry } }));
}
