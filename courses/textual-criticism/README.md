# Textual Criticism: an introductory resource for Bible translators

An introductory resource on textual criticism for Bible translators and consultants. It covers both Testaments: the New Testament first, the Old Testament (Hebrew Bible, BHS/BHQ) being added. It started as a guide for those who meet sigla like `א`, `B`, `𝔓⁶⁶`, `ƒ¹³` or `Byz` in the UBS Greek New Testament apparatus in Paratext and need to know, in under a minute, what each witness is and why it matters.

Part of the Learning Hub (`nlci-lab/learning-platform`), at https://nlci-lab.github.io/learning-platform/textual-criticism/. It moved here from `nlci-lab/textual-criticism` with its history in November 2026; the old site there is left as it is for now and will be archived later.

## Why Astro

Astro content collections validate every witness file against a schema at build time, so a bad entry fails the build. The output is plain static HTML that reads without JavaScript. See [docs/adr/0001-astro-static-site.md](docs/adr/0001-astro-static-site.md).

## Working on it

From the repo root:

```sh
npm install
npm run dev:tc       # http://localhost:4323
npm run build:pages  # every site as GitHub Pages serves it; this course at /learning-platform/textual-criticism/
```

On Git Bash for Windows, prefix builds that set a base path with `MSYS_NO_PATHCONV=1`. Shared parts (layout, feedback, image viewer, micro module page, glossary data) come from `platform/`; see this folder's `CLAUDE.md`.

## Where things live

| Path | What |
|---|---|
| `src/content/witnesses/*.md` | One file per witness: data in front matter, background text below |
| `src/content.config.ts` | The witness schema (core + one kind block) |
| `src/lib/sigla.ts` | Siglum normalisation, alias index, collision check |
| `src/pages/[alias].astro` | Static short URLs (`/p66/`, `/aleph/`, `/B/`) |
| `src/content/glossary.yaml`, `glossary-groups.yaml` | Apparatus symbols and terms in plain words, and their groups |
| `src/content/modules/*.yaml` | Micro modules (steps and questions as data; collation cards via `src/components/CollationEmbed.astro`) |
| `GLOSSARY.md` | Project vocabulary |
| `docs/adr/` | Decisions and why |
| `docs/PROMPT.md` | The original brief |

## Accuracy rules

- A fact goes into a field only with a source id. Sources marked `checked: false` were cited from memory and show a "to check" tag.
- Anything without a source we can name goes in `unverified` and is shown in its own box.
- `ubs5_list_checked: false` until the witness is confirmed against the printed UBS5 list.

## Licence

Code: MIT ([LICENSE](LICENSE)). Content (text and data in `src/content` and `src/data`): CC BY-SA 4.0 ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)). Manuscript images are not copied; they stay under their holders' terms.
