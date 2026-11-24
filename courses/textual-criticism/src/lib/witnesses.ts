import { getCollection, type CollectionEntry } from 'astro:content';
import { buildIndex } from './sigla';

type Witness = CollectionEntry<'witnesses'>['data'];

const ORDER: Record<string, number> = { papyrus: 0, majuscule: 1, minuscule: 2, lectionary: 3, version: 5, father: 6 };
const rank = (w: Witness) => (w.greek_ms ? ORDER[w.greek_ms.category] : ORDER[w.kind] ?? 9);

/** All witnesses in UBS citation order: papyri, majuscules, minuscules, lectionaries, versions, fathers (oldest first), then groups. */
export async function allWitnesses() {
  const all = (await getCollection('witnesses')).map((e) => e.data);
  return all.sort((a, b) => {
    const ka = rank(a), kb = rank(b);
    if (ka !== kb) return ka - kb;
    if (a.kind === 'father' && b.kind === 'father') return (a.date?.from ?? 1e9) - (b.date?.from ?? 1e9);
    return (a.greek_ms?.ntvmr_doc_id ?? 1e9) - (b.greek_ms?.ntvmr_doc_id ?? 1e9);
  });
}

/** Aliases plus the forms an apparatus prints for a father (Ir, Or, Eus…), so lookup finds them (ADR 0003). */
export function lookupAliases(w: Witness): string[] {
  return [...w.aliases, ...(w.father?.cited_as.map((c) => c.form) ?? [])];
}

/** Alias key -> profile, checked for collisions at build time. */
export async function aliasIndex() {
  const all = await allWitnesses();
  return buildIndex(all.map((w) => ({ id: w.id, siglum: w.siglum, names: w.names, aliases: lookupAliases(w), ga: w.greek_ms?.ga, scope: w.siglum_scope })));
}
