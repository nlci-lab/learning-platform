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
// `pigment` and `mark` set its book cover on the home page; `inside` lists what a reader finds there.
export const courses = [
  {
    id: 'exegesis', title: 'Exegesis for Translation Checking', cover: 'Exegesis',
    blurb: 'Finding what the original author meant, and checking that a translation says it.',
    status: 'Under construction', built: true, pigment: 'verdigris', mark: '§',
    inside: ['Guides and a series on figures of speech', 'Micro modules and checking cases', 'Glossary of checking terms'],
  },
  {
    id: 'textual-criticism', title: 'Textual Criticism', cover: 'Textual Criticism',
    blurb: 'The manuscripts, the printed editions and their apparatus, and how to weigh the evidence.',
    status: 'Under construction', built: true, pigment: 'lapis', mark: '𝔓',
    inside: ['Guides and worked examples', 'Profiles of the manuscripts', 'A series on making textual decisions'],
  },
  {
    id: 'logos', title: 'Logos Bible Software', cover: 'Logos',
    blurb: 'Using Logos for exegesis and translation work.',
    status: 'In preparation', built: true, pigment: 'ochre', mark: 'Λ',
    inside: ['Step-by-step guides', 'Glossary of Logos terms'],
  },
] as const;
