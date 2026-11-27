# AI: what it may read, where it runs, and what it may never do

Status: accepted (2026-11-27).

We plan to try two AI features with people preparing to check translations:

- a **tutor** that gives hints and asks questions while someone works through our material, and
- a **team partner** that helps like a well-read member of a translation team: it suggests questions, flags possible problems and points to sources.

Both are experiments. This record sets the limits before either is built. It covers data, hosting, grounding, behaviour and testing. It does not choose a model or a vendor.

## The Learning Hub stays as it is

The sites never call an AI service. Pages still read and work with JavaScript off, and nothing on a page depends on AI. An AI feature runs as a separate service that the Hub may link to. It reads Hub content the way any reader can, by its stable ids (ADR 0002).

## Four kinds of data

| Kind | Examples | May AI read it? |
|---|---|---|
| Public content | Guides, micro modules, practice cases with worked answers, glossary | Yes |
| Curated resources | Reference works listed in `platform/data/ai-resources.yaml` with a licence that allows this use | Yes, only those listed |
| Private teaching data | Answer keys of assessed cases (ADR 0006), mentor notes, learner records | No |
| Unpublished team drafts | A team's draft, back translation or notes | Only the team partner, only at stage 2 (below) |

Copyrighted works we hold only for checking and citation are never given to an AI service. A work joins the curated list only when its licence allows it; each entry records the licence and who checked it.

**Bible texts need a licence that allows AI use.** Permission to quote a Bible version on the site does not cover AI. For example, Biblica lets websites quote the NIV within its General Use Guidelines, but says that any use of its text with artificial intelligence, machine learning, language models or chatbots needs a licence from Biblica that expressly permits it (biblica.com/permissions, read 2026-11-27). So the NIV, and any version under similar terms, is never given to an AI service, nor shown in an AI answer, without such a licence. Where an AI feature needs a Bible text, it uses one whose licence allows this (for example a text under an open licence that permits it), and the curated list records which.

## Where it runs

Either on a model we host ourselves, or with a provider whose contract says it keeps no data and does not train on it. No key, token or endpoint is stored in this repo. Learners' conversations are stored only in our own system, deleted on request, and deleted after 90 days at the latest.

## Grounding

The AI keeps two things apart: the **authorities** it relies on, and the **material it is looking at**.

- **Authorities** are only the public content and the curated resources. Every claim about meaning, language or background names the content id or resource it comes from, so a reader can check it in one step. When the authorities do not support an answer, the AI says it does not know. It does not fill the gap from its general training.
- **Material under study** is the passage, case or draft the person is working on. The AI may point to a place in it (a verse, or a segment of a back translation) to show what its comment is about. At stage 2 that material may be a team's draft; a reference to a place in a draft is used only inside the stage-2 setting, and the draft is never treated as an authority or stored beyond what that setting allows.

## What it may never do

- Give the answer to an assessed case or question.
- Grade, score, or count as evidence of anyone's progress.
- Decide for a team, or change a draft. It suggests and flags; people decide.
- Speak for the site on doctrine. On questions of faith or interpretation it points to sources and to people.
- Present its words as a person's. Its output is always marked as coming from AI.

## The team partner in two stages

**Stage 1.** The partner works only on our own practice cases, which hold no real drafts. Its answers are measured against a fixed test set (below).

**Stage 2.** The partner may read a team's unpublished draft only when all of these hold: it runs on a model we host ourselves, so the draft never leaves our control; the team and its project leadership have agreed in writing; and stage 1 has passed its test.

## Testing before use

A fixed **test set** of known passages, kept as data beside the cases, with answers checked by people. It is run before any use and again whenever the model, the prompt or the resources change. It measures:

- that every claim cites a real source that supports it,
- that the AI says "I don't know" where the sources are silent,
- that it never reveals an assessed answer, and
- that it stays within the limits above.

The tutor pilot also has go/no-go rules, fixed before it starts: the tutor goes on only if people who used it score no lower without it than people who did not, mentors rate at least 90% of sampled replies as hints rather than answers, and no data rule is broken. Any breach stops the pilot at once.

No test makes errors impossible. The aim is that errors are rare, easy to see, and caught by people.

## AI tools used to build the Hub

*Added 2026-11-27.*

We also use AI tools while we write and check the Hub, for example a coding assistant that drafts content and reviewer agents that check drafts. The data rules above apply to them too: a copyrighted work held only for checking is not given to an AI service just because the work is for us and not for learners. In detail:

| Material | May a writing or review tool read it? |
|---|---|
| Public content of the Hub | Yes |
| Open-licensed works whose licence allows this use (for example unfoldingWord's Translation Academy, ULT and UST, and public-domain Bibles) | Yes. Credit them as their licence requires. |
| Works listed in `platform/data/ai-resources.yaml` with a licence that allows AI use | Yes |
| Material the team holds the copyright to, such as its own chapters and its own back translations | Yes, once the team agrees. Record that agreement and the parts it covers in the curated list. |
| Copyrighted works held only for checking and citation: published books, translation handbooks, and team material that is mostly an adaptation of such a book | No. A person reads them and writes notes in their own words. A tool may then work from those notes. |
| NET Bible notes | No, unless the publisher grants a licence for AI use (root rules) |
| Bible versions whose terms exclude AI use, such as the NIV | No. A person checks quotations from these versions. |
| Private teaching data and teams' unpublished drafts | No (see above) |

Where a book mixes the team's own chapters with adapted copyrighted chapters, we split it by chapter: only the team's own chapters may go to a tool. The split is recorded in the curated list.

A reviewer tool that suspects copied wording from a work it may not read flags the passage for a person to compare. It does not open the work.

Earlier internal notes, made before this section, used AI to read such a work. They stay internal. Content drawn from them is rewritten in our own words and checked by a person, and new work follows this section.

## Not decided here

The model and the provider; the design of the services; how the curated list is chosen beyond its licence rule; and the consent policy for real drafts, which this record requires but does not write.
