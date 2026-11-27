# learning-platform: working rules

This monorepo holds a shared course platform and the course sites built on it. Read this file at the start of every session. A course's own `CLAUDE.md` (in `courses/<name>/`) adds rules for that course.

## Layout

| Path | What |
|---|---|
| `platform/` | `@cohorts/platform`: shared layouts, components, styles, content schemas and (later) exporters. No course-specific code. |
| `site/` | `@cohorts/site`: the master site at `/`, which lists the courses |
| `courses/<name>/` | One Astro app per course: `course.config.ts` and content. Served at `/<name>/` |
| `courses/logos/`, `courses/textual-criticism/` | The two courses so far. Each has its own `CLAUDE.md` with course rules |
| `docs/adr/` | Decisions and why. Read them before changing structure |

Run from the repo root: `npm install`, then `npm run dev:site` (port 4320), `npm run dev:logos` (port 4322) or `npm run dev:tc` (port 4323). `npm run build` builds every workspace. `npm run check` type-checks them. `npm test` checks the platform schemas against the fixtures.

## Git

- Commit locally when a piece of work is done. **Never push** unless the user says so in this session.
- Creating GitHub repos, enabling Pages and pushing need the user's explicit go-ahead.

## Platform and courses

- Generic code goes in `platform/`. Course-specific code stays in its course. If something is needed by a second course, move it to the platform.
- A platform change must build every course (`npm run build` at the root) before it is committed.
- Every internal link goes through the platform's `url()` helper. The base path is a build setting (`SITE_BASE`), never hard-coded.
- Link between courses where a topic meets: `courseUrl('logos', 'guides/search/')` or `hubUrl()` in code, `~hub/logos/guides/search/` in Markdown. These resolve only in the full build (`npm run build:pages`), which checks them.
- Pages must read with JavaScript off. JavaScript only enhances them.

## Content rules (ADR 0002, 0003)

- **Content is data, not code.** Guides, glossary entries, micro modules and questions live in content files validated by a schema. Pages render them. This keeps a later move into Moodle an export step, not a rebuild.
- **Stable IDs.** Every course, module, step and question has an `id` that never changes once published.
- **Sourced facts.** A fact goes into a field only with a source we can name. Anything without one is marked unverified and shown as such.
- **Scholars: evidence, not conclusions.** Cite scholars for data. Never adopt their conclusions about the reliability of Scripture as the site's own voice.
- **Generic audience.** The sites are for Bible translators and consultants in general. Do not mention or link a specific training course or cohort from the public pages.
- Do not reproduce copyrighted material beyond short quotations for teaching, with attribution.

## Writing

Plain, direct English for readers who may use English as a second language. Short sentences, active voice, terms explained on first use or linked to the glossary.
