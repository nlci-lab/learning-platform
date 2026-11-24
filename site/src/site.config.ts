import { defineSite } from '@cohorts/platform/config';

// The master site is called "Learning Hub" (decided 2026-11-24). The repo and URL stay learning-platform.
export const site = defineSite({
  id: 'site',
  title: 'Learning Hub',
  description: 'Short online courses for Bible translators and consultants.',
  lang: 'en',
  nav: [],
  underConstruction: true,
  footer: 'Short online courses for Bible translators and consultants, from NLCI. Text CC BY-SA 4.0; code MIT.',
});

// Courses listed on the master page. A course's path is its id; `built` = it is in courses/ and published.
export const courses = [
  { id: 'logos', title: 'Logos Bible Software', blurb: 'Using Logos for exegesis and translation work.', status: 'In preparation', built: true },
  { id: 'textual-criticism', title: 'Textual Criticism', blurb: 'The manuscripts, the printed editions and their apparatus, and how to weigh the evidence.', status: 'Joins later', built: false },
] as const;
