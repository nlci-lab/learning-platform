import { defineSite } from '@cohorts/platform/config';

// "Courses" is a placeholder name until the master site is named (docs/ROADMAP.md).
export const site = defineSite({
  id: 'site',
  title: 'Courses',
  description: 'Short online courses for Bible translators and consultants.',
  lang: 'en',
  nav: [],
});

// Courses listed on the master page. A course's path is its id.
export const courses = [
  { id: 'logos', title: 'Logos Bible Software', blurb: 'Using Logos for exegesis and translation work.', status: 'In preparation' },
  { id: 'textual-criticism', title: 'Textual Criticism', blurb: 'The manuscripts, the printed editions and their apparatus, and how to weigh the evidence.', status: 'Joins later' },
] as const;
