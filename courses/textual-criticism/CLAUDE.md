# Textual Criticism course: rules

These rules add to the root `CLAUDE.md`. The course came from the `nlci-lab/textual-criticism` repo (ROADMAP Phase 5); its own decisions are in `docs/adr/` here.

- **Subject:** the manuscripts, the printed editions and their apparatus, and how to weigh the evidence, for Bible translators and consultants who meet the UBS apparatus in Paratext. Many read on a phone over slow, costly data.
- **Witness profiles** (`src/content/witnesses/*.md`): one common core plus one kind-specific block (ADR 0002). Every fact field names its sources by id; unverified claims go in `unverified` and are shown in their own box, never mixed into the core (ADR 0004).
- **Siglum lookup** follows what Paratext prints (ADR 0003): superscripts equal plain forms, single letters are case-sensitive, bare numbers are GA numbers. Short links like `/B/` and `/p66/` are built from the witness data.
- **Images** (ADR 0005): at most one self-hosted CNTR page photo per profile, credited, with the Bridgeman note; other images are linked, not copied.
- **Recommendations, not rulings.** Worked examples and micro modules end with a recommendation; the project's Review Committee decides. Follow the text policy page.
- **Scholars: evidence, not conclusions** (root rule). Cite scholars for data, never adopt their conclusions about the reliability of Scripture as the site's own voice.
- **Platform parts** come from `@cohorts/platform`: the layout (through `src/layouts/Base.astro`), Feedback, Lightbox, Thumb, Cite, Cover, the micro module page and the glossary data. Micro modules are YAML in `src/content/modules/`; a step can show collation cards with the `collation` embed (`src/components/CollationEmbed.astro`). The glossary is `src/content/glossary.yaml` and `glossary-groups.yaml`.
- **Course-only code** stays here: witness profiles and tiles, collation cards, coverage bars, sigla search, the Decide step and the reference-book layout (`src/layouts/Context.astro`).
- **The old site** at `nlci-lab.github.io/textual-criticism/` is left as it is for now and will be archived later (decided 2026-11-24). Public page comments (giscus) were dropped in the move; readers use the feedback box.
