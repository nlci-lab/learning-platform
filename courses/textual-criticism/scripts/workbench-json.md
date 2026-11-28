# Workbench files (`tc-workbench/1`)

The [workbench page](../src/pages/workbench/index.astro) downloads one JSON file per textual issue,
named `{reference}_{YYYY-MM-DD}.json` (for example `john-1-18_2026-11-28.json`). Each file stands
alone: it carries the "About this work" details too. Text is UTF-8, so Greek and Indic scripts are kept.
Empty fields are empty strings; tick boxes are `true`/`false`.

To collect a class's files into one spreadsheet:

```
node scripts/workbench-to-csv.mjs path/to/folder > results.csv
```

One row per file. Nested fields become dotted column names (`issue.weigh.confidence`); readings become
`reading.A.text`, `reading.A.support`, and so on.

## Fields

| Field | Meaning | Values |
|---|---|---|
| `schema` | File format | always `tc-workbench/1` |
| `saved` | When the file was made | ISO date-time, UTC |
| `about.name` | Who did the work | text |
| `about.bible` | The Bible or translation being compared | text |
| `about.language` | Its language | text |
| `about.baseText` | Its base text | text |
| **Step 1: Find the problem** |||
| `issue.reference` | The passage | text, e.g. `John 1:18` |
| `issue.kind` | Kind of variant (from *Which variants matter*) | `spelling`, `small-words`, `meaning`, `long-passage`, or empty |
| `issue.changesMeaning` | Changes the meaning in the user's language? | `yes`, `no`, `unsure`, or empty |
| `issue.ubsRating` | UBS rating | `A`, `B`, `C`, `D`, `diamond` (♦), `none` (not in the apparatus), or empty |
| `issue.problem` | The problem in the user's words | text |
| **Step 2: List the readings** |||
| `issue.sources.translations` · `.commentaries` · `.net` · `.apparatus` · `.cntr` | Places checked | `true`/`false` |
| `issue.sourceNotes` | Notes from those sources | text |
| `issue.readings[]` | One entry per reading | list |
| `issue.readings[].label` | Letter on the page | `A`, `B`, … |
| `issue.readings[].text` | The reading | text (Greek or other) |
| `issue.readings[].gloss` | Its meaning in the user's language | text |
| `issue.readings[].support` | Witnesses for it | text |
| `issue.readings[].inUbsText` | The UBS text prints it | `true`/`false` |
| **Step 3: External evidence** (the six questions of *Weighing the evidence*) |||
| `issue.external.{age,place,care,spread,independent,number}.favours` | Which reading this question favours | a reading letter, `even`, `unclear`, or empty |
| `issue.external.{…}.note` | Notes | text |
| **Step 4: Internal evidence** |||
| `issue.internal.{scribe,author}.favours` / `.note` | What a scribe would do; what the author would write | as above |
| `issue.internal.rules.{explains,harder,shorter,harmonization,style}` | Rules of thumb used | `true`/`false` |
| **Step 5: Weigh it up** |||
| `issue.weigh.original` | The reading that came first | a reading letter, `unclear`, or empty |
| `issue.weigh.confidence` | How sure the user is (not a UBS rating) | `sure`, `fairly-sure`, `unsure`, or empty |
| `issue.weigh.reasons` | Reasons | text |
| **Step 6: Decide for your translation** |||
| `issue.decide.ubs` | What the UBS text prints | text |
| `issue.decide.yourBible` | How the user's Bible handles it | text |
| `issue.decide.options` | Translation options | text |
| `issue.decide.actions.{footnote,brackets,wording,committee,consult,record,none}` | Suggested actions (as in the worked examples) | `true`/`false` |
| `issue.decide.verdict` | Verdict | text |
| `issue.decide.footnote` | Draft footnote | text |

If a field is added or renamed, change the `name` in the page, this table, and (for a breaking change)
the `schema` version together.
