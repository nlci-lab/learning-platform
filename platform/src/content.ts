// Content collections every course gets (ADR 0002). In a course's src/content.config.ts:
//   import { courseCollections } from '@cohorts/platform/content';
//   export const collections = courseCollections();
// Files, relative to the course root:
//   src/content/modules/<id>.yaml       one micro module per file
//   src/content/guides/<id>.md(x)       one guide per file (.mdx may use course components)
//   src/content/series.yaml             a list of series (guides read in order)
//   src/content/trees/<id>.yaml         one decision tree per file
//   src/content/cases/<id>.yaml         one checking case per file (ADR 0006); <id>.key.yaml is private and skipped
//   src/content/glossary.yaml           a list of glossary entries
//   src/content/glossary-groups.yaml    a list of glossary groups
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { existsSync } from 'node:fs';
import { moduleSchema, guide, glossaryEntry, glossaryGroup, series, decisionTree, caseSchema } from './schemas';

/** A missing list file is an empty list, so a new course builds before it has a glossary. */
const list = (path: string) =>
  existsSync(path) ? file(path) : { name: 'empty', load: async () => {} };

export function courseCollections() {
  return {
    modules: defineCollection({
      loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/modules', generateId: ({ data }) => String(data.id) }),
      schema: moduleSchema,
    }),
    guides: defineCollection({
      loader: existsSync('./src/content/guides')
        ? glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides', generateId: ({ data }) => String(data.id) })
        : { name: 'empty', load: async () => {} },
      schema: guide,
    }),
    glossary: defineCollection({ loader: list('./src/content/glossary.yaml'), schema: glossaryEntry }),
    glossaryGroups: defineCollection({ loader: list('./src/content/glossary-groups.yaml'), schema: glossaryGroup }),
    series: defineCollection({ loader: list('./src/content/series.yaml'), schema: series }),
    cases: defineCollection({
      loader: existsSync('./src/content/cases')
        ? glob({ pattern: ['**/*.{yaml,yml}', '!**/*.key.{yaml,yml}'], base: './src/content/cases', generateId: ({ data }) => String(data.id) })
        : { name: 'empty', load: async () => {} },
      schema: caseSchema,
    }),
    trees: defineCollection({
      loader: existsSync('./src/content/trees')
        ? glob({ pattern: '**/*.{yaml,yml}', base: './src/content/trees', generateId: ({ data }) => String(data.id) })
        : { name: 'empty', load: async () => {} },
      schema: decisionTree,
    }),
  };
}
