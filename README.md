# cohorts-cit

A shared course platform and the course sites built on it, for Bible translators and consultants.

| Course | Path | Status |
|---|---|---|
| Logos Bible Software | `courses/logos/` → `/logos/` | In preparation |
| Textual Criticism | joins later (now in its own repo) | Live separately |

## Working on it

```sh
npm install
npm run dev:site     # master site, http://localhost:4320
npm run dev:logos    # Logos course, http://localhost:4322
npm run build        # build every workspace
npm run check        # type-check every workspace (the platform is checked through the Logos course)
npm test             # platform schema and link tests
```

Needs Node 22.18 or later (`.nvmrc`). CI runs check, test and build on every push and pull request.

On Git Bash for Windows, prefix builds that set `SITE_BASE` with `MSYS_NO_PATHCONV=1` so the base path is not rewritten.

## Structure

- `platform/`: shared layouts, components, styles and schemas (`@cohorts/platform`)
- `site/`: the master site that lists the courses
- `courses/<name>/`: one Astro app per course
- `docs/adr/`: decisions and why

See `CLAUDE.md` for the working rules, and `docs/ROADMAP.md` for the phases.

## Licence

Code: MIT (`LICENSE`). Course text and data: CC BY-SA 4.0 (`LICENSE-CONTENT.md`).
