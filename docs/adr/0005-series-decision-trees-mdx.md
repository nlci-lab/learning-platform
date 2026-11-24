# Series, decision trees and MDX guides

Some teaching is a path, not a set of separate pages: "Making textual decisions" walks one passage through five ways a team can decide a variant, each building on the last. So guides can now belong to a **series** (`src/content/series.yaml`, plus `series: { id, part }` on each guide). A series has a path in the course, such as `learn/decisions/`. Its parts are served there, each with "Part n of N" and previous and next links, and the series page lists them in order. Guides that are not in a series stay at `guides/<id>/`. Pages link to every guide through `getGuidePaths()`, so neither kind of address is hard-coded.

A **decision tree** (`src/content/trees/<id>.yaml`) is content too: question, step and outcome nodes, linked by options. The schema rejects a broken tree: a missing target, a node that cannot be reached, a question with fewer than two options, or an outcome with options. The component renders it as linked sections, so it works without JavaScript; JavaScript shows one node at a time.

Guides may be **MDX**. Markdown stays the default, but a course guide sometimes needs a course component in the text: a collation card or a decision tree. MDX allows that while the guide stays a schema-checked content file, so new teaching does not go back into page code. Existing `.astro` guide pages (in Textual Criticism) can move to MDX one at a time.

Costs: one more dependency (`@astrojs/mdx`), and MDX files can import code, so a content pull request with an `import` line needs a code review.
