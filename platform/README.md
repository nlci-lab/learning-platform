# @cohorts/platform

Shared code for the master site and every course. No course-specific code goes here (see the root `CLAUDE.md`). Most of it was taken from the Textual Criticism site and made generic (ROADMAP Phase 1). That site itself was left unchanged.

## Exports

| Export | What |
|---|---|
| `config` | `SiteConfig`, `defineSite()`, `levelName()`: name, menu, accent, footer, feedback form, level names |
| `url` | `url()`: every internal link goes through it |
| `paths` | Where the platform pages live in a course (`guides/`, `guides/<id>/`, `learn/`, `practice/<id>/`, `background/`, `glossary/`, `search/`) |
| `schemas` | Zod schemas: sourced facts (`source`, `sourced()`, `unverified`, `checkSourceIds()`, `citer()`), questions, micro modules, guides, glossary |
| `content` | `courseCollections()` for a course's `src/content.config.ts` |
| `data` | `getModules()`, `getGuides()`, `getGlossary()`, and `getStaticPaths` helpers. Drafts show only in `astro dev` |
| `markdown` | `md()`, `mdInline()`, `plain()`. In content data and in guide Markdown, `[text](~/learn/)` is an internal link that gets the base path |
| `search` | The `search.json` route and `searchIndex()` |
| `integration` | Astro integration: `~/` internal links in Markdown pages; external links open in a new tab, safely and accessibly |
| `layouts/Base.astro` | Page shell: header, menu, theme switch, under-construction strip, footer |
| `components/*` | `Question`, `GuideCard`, `Tags`, `Cite`, `Sources`, `Unverified`, `Feedback`, `Figure`, `Thumb` + `Lightbox`, `Cover` |
| `pages/*` | `GuidesPage`, `GuidePage`, `ModulePage`, `LearnPage`, `GlossaryPage`, `SearchPage`, `ComingSoonPage`: mounted by thin route files in a course |
| `styles/base.css` | Base styles and theme tokens. `--accent` comes from the course config |

## Setting up a course

`astro.config.mjs`: `integrations: [platform()]` (from `@cohorts/platform/integration`).

`src/content.config.ts`:

```ts
import { courseCollections } from '@cohorts/platform/content';
export const collections = courseCollections();
```

Route files (see `courses/logos/src/pages/` for the full set): `learn/index.astro`, `practice/[id].astro`, `guides/[id].astro`, `glossary.astro`, `search.astro`, `search.json.ts`. Each is three to six lines that pass the course config to a platform page.

Content files:

| File | Holds |
|---|---|
| `src/content/modules/<id>.yaml` | One micro module (format: ADR 0004; examples in `fixtures/modules/`) |
| `src/content/guides/<id>.md` | One guide: front matter per the `guide` schema (including `summary`, its description, and `tags`, its hashtags), body in Markdown |
| `src/content/glossary.yaml` | A list of entries: `id, term, plain, group, source, checked` |
| `src/content/glossary-groups.yaml` | A list of groups: `id, title, intro, order, style (sign or word)` |

A step that needs a course widget names it (`embed: { name: collation, args: {...} }`), and the course page passes the component: `<ModulePage ... embeds={{ collation: Collation }} />`. A missing component fails the build.

## Tests

`npm test` (at the root or in this folder) checks the fixtures in `fixtures/modules/` against the schema, checks that bad data is rejected, and tests the two link passes. It needs Node 22.18 or later, which runs TypeScript directly.

Type-checking: the platform has no Astro app of its own, so `courses/logos/tsconfig.json` includes `platform/src` and `npm run check` checks it there.

## Course-only code

Textual Criticism keeps its witness profiles, sigla lookup, collation cards, coverage bars, the Decide step and its reference-book layout in `courses/textual-criticism/`: they are specific to that course. Its giscus comments were dropped in the move.
