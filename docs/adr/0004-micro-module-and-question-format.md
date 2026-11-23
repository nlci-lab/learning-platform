# Micro modules and questions are YAML, one module per file

A micro module is one YAML file in a course's `src/content/modules/`. It holds the module's details (title, topic, skill, level 1–4, minutes, sources) and a list of steps. A step has an id, a title, optional Markdown teaching text, an optional named widget (`embed`) and an optional question. The platform schema (`platform/src/schemas.ts`) checks every file at build time; a bad file fails the build.

Questions use only the five types in ADR 0003: `multichoice` (one or several right options, each option with its own feedback), `truefalse`, `shortanswer` (a list of accepted answers), `matching` (pairs, plus extra wrong matches) and `essay` (with a model answer). Field names follow what a Moodle question needs, so an exporter maps them field by field. Ids of modules, steps and questions are stable (ADR 0002), and question ids are unique within a course.

Why YAML and not Markdown with front matter: a module is mostly structure (steps, options, feedback), with short texts. YAML keeps that structure visible and lets each text field stay Markdown.

Why `embed`: some steps need a course-specific widget, for example the collation card in Textual Criticism. The data names the widget and its arguments; the course's page supplies the component. The module stays data, and the platform holds no course code. An export to Moodle will need a fallback for each embed (a picture or a link), decided when the exporter is built.

Every question reads without JavaScript: the reader sees the question and a "Show the answer" box with every answer and its feedback. JavaScript adds checking and opens the steps one by one.

The Textual Criticism site's Mark 1:2 module, ported to this format, is kept in `platform/fixtures/` as a test until that site joins (ROADMAP Phase 5).

Levels are shown as a number and a name, "Level 1 · First steps". The names describe the material, not the reader, so an experienced consultant who is new to a tool is not called a novice. A site sets the names in its config (`levels`). Without names, pages show "Level 1" to "Level 4".
