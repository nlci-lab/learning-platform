// The course map: units by level, from the word to the whole discourse. Shown on the front page and on Learn.
// `href` is a course path where a ready unit starts; `also` is a path under the Learning Hub (another course).
import type { MapUnit } from '@cohorts/platform/components/CourseMap.astro';

export const COURSE_MAP: MapUnit[] = [
  { level: 'Word', title: 'Studying words', topics: 'Senses of a word, components of meaning, unknown concepts, key biblical terms, idioms, and word-study tools.', also: { label: 'Bible Word Study (Logos course)', path: 'logos/guides/bible-word-study/' } },
  { level: 'Phrase and clause', title: 'Figures of speech and what is left unsaid', topics: 'Metaphors and other figures of speech, rhetorical questions, implicit and explicit information. The series on figures of speech is ready; implicit information is in preparation.', href: 'learn/figures/' },
  { level: 'Clause and sentence', title: 'More on discovering the meaning', topics: 'How clauses relate (time, cause, purpose, contrast), links the text leaves unmarked, the main point and its support, events and participants, "of" phrases, the order of events and long sentences. The guide on how clauses relate is ready; the rest is in preparation.', href: 'guides/clause-relations/' },
  { level: 'Several readings', title: 'When a passage can mean more than one thing', topics: 'Weighing interpretations and recording the decision.', href: 'learn/#guides' },
  { level: 'Discourse', title: 'The whole passage', topics: 'Connections, participants, prominence and paragraphs: reading above the sentence.' },
];
