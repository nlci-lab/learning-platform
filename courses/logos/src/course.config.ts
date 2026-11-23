import { defineSite } from '@cohorts/platform/config';

export const course = defineSite({
  id: 'logos',
  title: 'Logos Bible Software',
  description: 'Using Logos Bible Software for exegesis and translation work: an introduction for Bible translators and consultants.',
  lang: 'en',
  // Learn, Glossary and Search are built but stay out of the menu until they have content (Phase 2).
  nav: [],
  accent: { light: '#7a3b12', dark: '#e3a06e' },
  underConstruction: true,
  footer: 'An introduction to Logos Bible Software for Bible translators and consultants, from NLCI. Not made or endorsed by Faithlife. Text CC BY-SA 4.0; code MIT.',
});
