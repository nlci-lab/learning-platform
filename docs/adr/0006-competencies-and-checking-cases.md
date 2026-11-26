# Competencies and checking cases

Status: accepted (2026-11-26).

Courses are starting to serve translators who are preparing to check translations. Two things are missing from the content model: a way to say which skill a piece of content builds, and a way to practise checking itself. This record adds both, as data (ADR 0002), with a path into Moodle (ADR 0003).

## Competencies

A **competency** is one skill a consultant uses, stated in plain words. The list lives once, in `platform/data/competencies.yaml`, because every course shares it; it holds no course content. Each competency has a stable id, a domain (D1 exegesis, D2 translation principles, D3 checking practice, D4 language, culture and community, D5 mentoring and facilitation, D6 project and quality, D7 tools and machine drafts, D8 character, faith and relationships), the areas of the Forum of Bible Agencies International statement it serves (2024 revision), a statement, and sources. The list has a version number; a changed meaning gets a new id, never a quiet edit.

Guides, micro modules and cases gain two optional fields: `competencies` (ids from the list) and `requires` (ids of content to work through first). The platform tests (`npm test`) fail on an unknown id in either field, and print which competencies no content covers yet.

Competencies describe practice on the site. They are not a certification: recognising consultants belongs to the programmes that train them.

## Checking cases

A **case** is one practice checking task. It is a YAML file in a course's `src/content/cases/`. It gives a passage, a short situation (the team, the language, the stage of work), and a **back translation** in segments. The back translation is written by us and has planted problems. Kinds of problem: addition, omission, change of meaning, unnatural wording, a figure of speech read literally, a wrong interpretation, a back-translation artefact (the draft is right; the back translation misleads), and none (a segment that is fine, so readers learn not to see problems everywhere).

A case is one of three kinds: **worked** (the analysis is shown step by step), **open** (the reader finds the problems first, then opens the model analysis), or **triage** (the reader decides which problems matter most in limited time). Each case has hints, a model analysis, and questions to the team for each problem. Practice questions use the five question types of ADR 0004, so a case exports to Moodle as a quiz with essay and multichoice questions.

**Provenance.** Every case says where its back translation came from: `constructed` (written by us) or `team-anonymised` (from a real team's draft). The schema rejects a `team-anonymised` case without a `permission` reference. Until a consent policy exists, all cases are `constructed`.

**Assessed cases.** A case marked `assessed: true` keeps its answers (problems, model analysis, feedback) out of the public file, in a companion file `<id>.key.yaml` that git ignores and that is shared with mentors only. The schema rejects an assessed case whose public file holds answers.

**Review.** A case's model analysis speaks with the site's voice on exegesis, so a case is published only after review: `review: draft | reviewed | published`. No reviewer names are stored on the public site.

**Scripture text.** A case quotes Bible text only from versions whose terms allow it, with the notice the content licence requires, and never ESV text. Copyrighted reference works (for example Barnwell's *Bible Translation*) are cited, never copied.

## Pages

A case page reads without JavaScript: the situation, the back translation, then each problem, hint and the model analysis inside "Show" boxes. JavaScript adds a find-the-problems mode that hides the answers until the reader has marked segments. Cases sit under `practice/` beside micro modules.

## Not decided here

The Moodle mapping of a whole case (quiz or Lesson), audio for oral checking, and any AI features. AI limits and data handling are for ADR 0007.
