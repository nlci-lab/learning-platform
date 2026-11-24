// Content schemas shared by every course (ADR 0002, 0003, 0004).
// Only `astro/zod` is imported here, so plain Node can use these schemas too (see platform/test).
import { z } from 'astro/zod';

/* ---------- Ids and dates ---------- */

/** A stable id: lower-case letters, digits and hyphens. Never changes once published. */
export const stableId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids use a-z, 0-9 and single hyphens');
/** YYYY-MM-DD. YAML reads an unquoted date as a Date, so that is accepted and turned back into text. */
export const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'dates are YYYY-MM-DD'),
);

/* ---------- Sourced facts (ADR 0002 in this repo; ADR 0004 in the Textual Criticism site) ---------- */

/** One source we can name. checked=false: cited from memory, not yet checked against the source itself. */
export const source = z.object({
  id: stableId,
  cite: z.string().min(1),
  url: z.string().url().optional(),
  checked: z.boolean(),
});
export const sources = z.array(source).superRefine((list, ctx) => {
  const seen = new Set<string>();
  list.forEach((s, i) => {
    if (seen.has(s.id)) ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `duplicate source id "${s.id}"` });
    seen.add(s.id);
  });
});

/** A fact with the ids of its sources, e.g. sourced(z.string()) → { value, src: ['metzger'] }. */
export const sourced = <T extends z.ZodTypeAny>(value: T) => z.object({ value, src: z.array(z.string()).min(1) });

/** A claim we could not source yet. Shown in its own "not yet checked" box, never mixed with sourced fields. */
export const unverified = z.array(z.object({ claim: z.string(), from: z.string() })).default([]);

/** Every `src` array anywhere in `data` names a source listed in `data.sources`. Use in superRefine. */
export function checkSourceIds(data: { sources: { id: string }[] }, ctx: z.RefinementCtx, keys = ['src']) {
  const ids = new Set(data.sources.map((s) => s.id));
  const walk = (v: unknown, path: (string | number)[]) => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, [...path, i]));
    else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (k === 'sources') continue;
        if (keys.includes(k) && Array.isArray(x)) {
          x.forEach((s, i) => { if (!ids.has(s)) ctx.addIssue({ code: 'custom', path: [...path, k, i], message: `unknown source "${s}"` }); });
        } else walk(x, [...path, k]);
      }
    }
  };
  walk(data, []);
}

/** Source numbers for a claim, and whether none of them is checked yet. For the <Cite> component. */
export function citer(list: { id: string; checked: boolean }[]) {
  const n = new Map(list.map((s, i) => [s.id, i + 1]));
  const ok = new Map(list.map((s) => [s.id, s.checked]));
  return (src: string[]) => ({ ns: src.map((s) => n.get(s)!).sort((a, b) => a - b), unchecked: !src.some((s) => ok.get(s)) });
}

/* ---------- Questions (ADR 0003, 0004) ----------
   Only question types Moodle can import. Text fields are Markdown. */

const text = z.string().min(1);
const questionBase = {
  id: stableId,
  /** The question itself. */
  prompt: text,
  /** Shown after any answer, e.g. the reasoning or a source. */
  general_feedback: z.string().optional(),
};

const multichoice = z.object({
  ...questionBase,
  type: z.literal('multichoice'),
  /** true: exactly one option is right (radio buttons). false: one or more are right (checkboxes). */
  single: z.boolean().default(true),
  /** Shuffle is off by default: options often follow a deliberate order. */
  shuffle: z.boolean().default(false),
  options: z.array(z.object({ text, correct: z.boolean().default(false), feedback: text })).min(2),
});

const truefalse = z.object({
  ...questionBase,
  type: z.literal('truefalse'),
  answer: z.boolean(),
  /** Feedback for a reader who answers "True", and for one who answers "False". */
  if_true: text,
  if_false: text,
});

const shortanswer = z.object({
  ...questionBase,
  type: z.literal('shortanswer'),
  /** Every accepted answer. The first is shown as the model answer. */
  answers: z.array(z.object({ text, feedback: z.string().optional() })).min(1),
  case_sensitive: z.boolean().default(false),
  /** Feedback for any answer not in the list. */
  if_wrong: text,
});

const matching = z.object({
  ...questionBase,
  type: z.literal('matching'),
  pairs: z.array(z.object({ item: text, match: text })).min(2),
  /** Extra wrong matches offered in every list. */
  distractors: z.array(text).default([]),
});

const essay = z.object({
  ...questionBase,
  type: z.literal('essay'),
  /** What a good answer contains. Shown to the reader after writing; in Moodle, guidance for the grader. */
  model_answer: text,
});

export const question = z.discriminatedUnion('type', [multichoice, truefalse, shortanswer, matching, essay])
  .superRefine((q, ctx) => {
    if (q.type === 'matching') {
      // Moodle needs at least three answers to choose from (ADR 0003: not yet checked on a Moodle site).
      const answers = new Set([...q.pairs.map((p) => p.match), ...q.distractors]);
      if (answers.size < 3) ctx.addIssue({ code: 'custom', path: ['distractors'], message: `matching question "${q.id}" needs at least 3 different answers; add a distractor` });
      const items = q.pairs.map((p) => p.item);
      if (new Set(items).size !== items.length) ctx.addIssue({ code: 'custom', path: ['pairs'], message: `matching question "${q.id}" has the same item twice` });
      return;
    }
    if (q.type !== 'multichoice') return;
    const right = q.options.filter((o) => o.correct).length;
    if (q.single && right !== 1) ctx.addIssue({ code: 'custom', path: ['options'], message: `single-answer question "${q.id}" needs exactly one correct option (has ${right})` });
    if (!q.single && right < 1) ctx.addIssue({ code: 'custom', path: ['options'], message: `question "${q.id}" needs at least one correct option` });
  });
export type Question = z.infer<typeof question>;

/* ---------- Micro modules (ADR 0002, 0004) ---------- */

export const step = z.object({
  id: stableId,
  title: text,
  /** Teaching text before the question (Markdown). */
  body: z.string().optional(),
  /** A course-specific widget, by name, with its arguments. The course page supplies the component. */
  embed: z.object({ name: stableId, args: z.record(z.unknown()).default({}) }).optional(),
  question: question.optional(),
});

export const moduleSchema = z.object({
  id: stableId,
  title: text,
  /** What the module is about, in a few words, e.g. 'Mark 1:2' or 'Search panel'. */
  topic: text,
  /** The question the module answers, for its card on the Learn page. */
  question: text,
  /** The skill it practises, in a few words. */
  skill: text,
  /** Difficulty, 1 (easiest) to 4. Names come from the site config. */
  level: z.number().int().min(1).max(4),
  /** Optional place in lists (lower first). Without it, modules sort by level, then title. */
  order: z.number().int().optional(),
  minutes: z.number().int().positive(),
  description: text,
  lead: text,
  steps: z.array(step).min(1),
  /** Shown when the reader finishes (Markdown). */
  done: z.string().optional(),
  sources,
  unverified,
  /** Drafts are built only in `astro dev`. */
  draft: z.boolean().default(false),
  last_checked: isoDate.optional(),
}).superRefine((m, ctx) => {
  const seen = new Set<string>();
  m.steps.forEach((s, i) => {
    if (seen.has(s.id)) ctx.addIssue({ code: 'custom', path: ['steps', i, 'id'], message: `duplicate step id "${s.id}"` });
    seen.add(s.id);
  });
});
export type MicroModule = z.infer<typeof moduleSchema>;
export type Step = MicroModule['steps'][number];

/* ---------- Glossary ---------- */

export const glossaryGroup = z.object({
  id: stableId,
  title: text,
  intro: z.string().default(''),
  order: z.number().int(),
  /** 'sign': terms are symbols or abbreviations, shown large and listed in the jump row. */
  style: z.enum(['sign', 'word']).default('word'),
});

export const glossaryEntry = z.object({
  id: stableId,
  term: text,
  /** The meaning in our own plain words. */
  plain: text,
  group: stableId,
  source: text,
  /** false: not yet checked against the source. Shown as such. */
  checked: z.boolean(),
});

/* ---------- Guides (Markdown files with this front matter) ---------- */

export const guide = z.object({
  id: stableId,
  title: text,
  /** Short title for the cover. */
  cover: text,
  level: z.number().int().min(1).max(4),
  /** One or two sentences: shown on the guide's card and as its page description. */
  summary: text,
  /** Searchable hashtags, without the #: lower case words joined by hyphens, e.g. [layouts, greek]. */
  tags: z.array(stableId).min(1).max(8),
  learn: z.array(text).min(1),
  /** Ids of guides to read first and related guides. */
  before: stableId.optional(),
  related: z.array(stableId).default([]),
  /** Part of a series (see `series`): the series id and this guide's place in it, 1 first. */
  series: z.object({ id: stableId, part: z.number().int().positive() }).optional(),
  sources,
  unverified,
  /** true once checked line by line against its sources. */
  checked: z.boolean().default(false),
  last_checked: isoDate.optional(),
  draft: z.boolean().default(false),
});
export type Guide = z.infer<typeof guide>;

/* ---------- Series: guides meant to be read in order (src/content/series.yaml) ---------- */

export const series = z.object({
  id: stableId,
  title: text,
  /** Where the series lives in the course, e.g. 'learn/decisions/'. Its parts are at <path><guide id>/. */
  path: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*\/$/, 'a path like learn/decisions/'),
  summary: text,
  /** Shown at the top of the series page (Markdown). */
  intro: z.string().optional(),
});
export type Series = z.infer<typeof series>;

/* ---------- Decision trees (src/content/trees/<id>.yaml) ----------
   A tree is a set of nodes. A question node offers options that lead to other nodes; a step node says
   what to do and usually leads on; an outcome node ends a path. Rendered as linked sections, so it
   works without JavaScript. */

export const decisionTree = z.object({
  id: stableId,
  title: text,
  intro: z.string().optional(),
  /** The node a reader starts at. */
  start: stableId,
  nodes: z.array(z.object({
    id: stableId,
    kind: z.enum(['question', 'step', 'outcome']),
    title: text,
    /** Markdown. */
    body: z.string().optional(),
    options: z.array(z.object({ label: text, to: stableId })).default([]),
  })).min(1),
  sources,
}).superRefine((t, ctx) => {
  const ids = new Map<string, number>();
  t.nodes.forEach((n, i) => {
    if (ids.has(n.id)) ctx.addIssue({ code: 'custom', path: ['nodes', i, 'id'], message: `duplicate node id "${n.id}"` });
    ids.set(n.id, i);
  });
  if (!ids.has(t.start)) ctx.addIssue({ code: 'custom', path: ['start'], message: `start node "${t.start}" does not exist` });
  t.nodes.forEach((n, i) => {
    n.options.forEach((o, j) => {
      if (!ids.has(o.to)) ctx.addIssue({ code: 'custom', path: ['nodes', i, 'options', j, 'to'], message: `node "${n.id}" leads to "${o.to}", which does not exist` });
    });
    if (n.kind === 'question' && n.options.length < 2) ctx.addIssue({ code: 'custom', path: ['nodes', i, 'options'], message: `question "${n.id}" needs at least two options` });
    if (n.kind === 'outcome' && n.options.length) ctx.addIssue({ code: 'custom', path: ['nodes', i, 'options'], message: `outcome "${n.id}" ends a path and cannot have options` });
    if (n.kind === 'step' && n.options.length > 1) ctx.addIssue({ code: 'custom', path: ['nodes', i, 'options'], message: `step "${n.id}" leads on to one node at most` });
  });
  // Every node must be reachable from the start.
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id) || !ids.has(id)) return;
    seen.add(id);
    t.nodes[ids.get(id)!].options.forEach((o) => walk(o.to));
  };
  walk(t.start);
  t.nodes.forEach((n, i) => { if (!seen.has(n.id)) ctx.addIssue({ code: 'custom', path: ['nodes', i], message: `node "${n.id}" cannot be reached from the start` }); });
});
export type DecisionTree = z.infer<typeof decisionTree>;
