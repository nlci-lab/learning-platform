// The course map: units by level, from the word to the whole discourse. Shown on the front page and on Learn.
// `href` is a course path (passed through url()); a unit without one is in preparation.
export type Unit = { level: string; title: string; topics: string; href?: string };

export const COURSE_MAP: Unit[] = [
  { level: 'Word', title: 'Studying words', topics: 'Senses of a word, components of meaning, unknown concepts, key biblical terms, idioms, and word-study tools.' },
  { level: 'Phrase and clause', title: 'Figures of speech and what is left unsaid', topics: 'Metaphors and other figures of speech, rhetorical questions, implicit and explicit information. The series on figures of speech is ready; implicit information is in preparation.', href: 'learn/figures/' },
  { level: 'Sentence', title: 'Discovering the meaning', topics: 'Event ideas, "of" phrases, active and passive, complex passages, the order of events, long and short sentences.' },
  { level: 'Several readings', title: 'When a passage can mean more than one thing', topics: 'Weighing interpretations and recording the decision.', href: 'learn/#guides' },
  { level: 'Discourse', title: 'The whole passage', topics: 'Connections, participants, prominence and paragraphs: reading above the sentence.' },
];
