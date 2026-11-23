# @cohorts/platform

Shared code for the master site and every course. No course-specific code goes here (see the root `CLAUDE.md`).

| Export | What |
|---|---|
| `@cohorts/platform/config` | `SiteConfig` and `defineSite()`: what a site tells the platform about itself |
| `@cohorts/platform/url` | `url()`: every internal link goes through it |
| `@cohorts/platform/layouts/Base.astro` | Page shell: header, menu, footer, base styles |
| `@cohorts/platform/styles/base.css` | Base styles and theme tokens |

Phase 1 adds the components and content schemas pulled out of the Textual Criticism site (see `docs/ROADMAP.md`).
