// Series rules as plain functions (no astro:content), so they can be unit-tested. data.ts uses them.
import { PATHS } from './paths.ts';

type S = { id: string; path: string };
type G = { id: string; series?: { id: string; part: number } };

// Top-level addresses the platform already uses; a series may not live inside them.
const RESERVED = [PATHS.guides, 'practice/', PATHS.glossary, PATHS.search];

/** Throws on: duplicate series ids or paths, a reserved or nested path, an unknown series, duplicate part numbers. */
export function checkSeries(series: S[], guides: G[]): void {
  const ids = new Set<string>();
  const paths = new Map<string, string>();
  for (const s of series) {
    if (ids.has(s.id)) throw new Error(`Series "${s.id}" is listed twice in series.yaml.`);
    ids.add(s.id);
    if (RESERVED.some((r) => s.path === r || s.path.startsWith(r))) throw new Error(`Series "${s.id}" uses path "${s.path}", which the platform already uses (${RESERVED.join(', ')}).`);
    for (const [p, other] of paths) {
      if (p === s.path) throw new Error(`Series "${s.id}" and "${other}" both use path "${s.path}".`);
      if (p.startsWith(s.path) || s.path.startsWith(p)) throw new Error(`Series "${s.id}" (${s.path}) and "${other}" (${p}) are nested; give each its own path.`);
    }
    paths.set(s.path, s.id);
  }
  const parts = new Map<string, string>();
  for (const g of guides) if (g.series) {
    if (!ids.has(g.series.id)) throw new Error(`Guide "${g.id}" is part of series "${g.series.id}", which is not in series.yaml.`);
    const key = `${g.series.id}#${g.series.part}`;
    if (parts.has(key)) throw new Error(`Guides "${parts.get(key)}" and "${g.id}" are both part ${g.series.part} of series "${g.series.id}".`);
    parts.set(key, g.id);
  }
}

/** Where a guide lives: a series part at <series path><id>/, any other guide at guides/<id>/. */
export function guidePath(g: G, series: Map<string, S>): string {
  const s = g.series && series.get(g.series.id);
  return s ? `${s.path}${g.id}/` : PATHS.guide(g.id);
}

/** The parts of one series in reading order. Shown part numbers are positions in this list, so a hidden
    draft never leaves a gap ("Part 3 of 2"). */
export function seriesParts<T extends G>(seriesId: string, guides: T[]): T[] {
  return guides.filter((g) => g.series?.id === seriesId).sort((a, b) => a.series!.part - b.series!.part);
}
