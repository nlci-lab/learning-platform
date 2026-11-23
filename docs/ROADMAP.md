# Roadmap

## Phase 0: scaffold (done)

npm workspaces, working rules (`CLAUDE.md`), ADRs, a minimal platform layout, the master site and an empty Logos course that build and run.

## Phase 1: platform v0 (done)

Copy the generic pieces out of the Textual Criticism site, leaving that site untouched:

- the base layout, with name, menu and colours set per course
- styles
- micro modules (rebuilt to read steps and questions from data)
- feedback, lightbox, figures and citations
- glossary, Learn and Practice pages, and search
- the sourced-fact schema helpers and the external-links integration

Define the question schema (ADR 0003, 0004).

Left for later: a feedback form for each course (the Textual Criticism form belongs to that site), and adding Learn, Glossary and Search to the Logos menu once they have content.

## Phase 2: Logos course

Decide the audience, the Logos version and the content types, for example features and tools, workflows and keyboard shortcuts. Write the first guides, and two micro modules across the four difficulty levels.

Before publishing, confirm Faithlife's guidelines on screenshots and use of the Logos name.

## Phase 3: build and deploy

One workflow builds the master site and every course into one GitHub Pages site, with a link check and Lighthouse. Creating the nlci-lab repo and pushing need the user's go-ahead.

## Phase 4: Moodle proof (when the LMS decision comes)

Export one module as SCORM and its questions as Moodle XML, then test the import on a Moodle test site.

## Phase 5: bring in Textual Criticism

Move it to `courses/textual-criticism/` with its git history, switch it to platform components, and leave redirect pages at the old URL.

## Open

- A name for the master site. "Courses" is a placeholder.
