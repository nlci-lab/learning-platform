# Content is data, rendered by the platform

Guides, glossary entries, micro modules and their questions are stored as content files (Markdown with front matter, or YAML/JSON) and validated by schemas from the platform at build time. A malformed entry fails the build. Pages and components render the data. They do not hold the content.

In the Textual Criticism site, micro-module questions are written directly in `.astro` pages. That works for one site but cannot be reused, checked or exported. Here, a micro module is a list of steps, and each step has a question with options, an answer and feedback, all in data.

Every course, module, step and question has a stable `id`. Once published, an id never changes, so later exports (ADR 0003) can update what was imported before instead of duplicating it.
