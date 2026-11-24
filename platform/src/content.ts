// Content collections every course gets (ADR 0002). In a course's src/content.config.ts:
//   import { courseCollections } from '@cohorts/platform/content';
//   export const collections = courseCollections();
// Files, relative to the course root:
//   src/content/modules/<id>.yaml       one micro module per file
//   src/content/guides/<id>.md          one guide per file
//   src/content/glossary.yaml           a list of glossary entries
//   src/content/glossary-groups.yaml    a list of glossary groups
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { existsSync } from 'node:fs';
import { moduleSchema, guide, glossaryEntry, glossaryGroup } from './schemas';

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
      loader: glob({ pattern: '**/*.md', base: './src/content/guides', generateId: ({ data }) => String(data.id) }),
      schema: guide,
    }),
    glossary: defineCollection({ loader: list('./src/content/glossary.yaml'), schema: glossaryEntry }),
    glossaryGroups: defineCollection({ loader: list('./src/content/glossary-groups.yaml'), schema: glossaryGroup }),
  };
}
