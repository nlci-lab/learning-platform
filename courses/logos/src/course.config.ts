import { defineSite } from '@cohorts/platform/config';

export const course = defineSite({
  id: 'logos',
  title: 'Logos Bible Software',
  description: 'Using Logos Bible Software for exegesis and translation work: an introduction for Bible translators and consultants.',
  lang: 'en',
  nav: [['guides/', 'Guides'], ['learn/', 'Learn'], ['background/', 'Background'], ['glossary/', 'Glossary'], ['search/', 'Search']],
  accent: { light: '#7a3b12', dark: '#e3a06e' },
  underConstruction: true,
  // Names describe the material, not the reader. Shown with the number: "Level 1 · First steps".
  levels: ['First steps', 'Everyday use', 'Deeper study', 'Expert tools'],
  footer: 'An introduction to Logos Bible Software for Bible translators and consultants, from NLCI. Not made or endorsed by Faithlife. Text CC BY-SA 4.0; code MIT. Screenshots of Logos: Copyright Logos (<a href="https://www.logos.com">logos.com</a>), used under Faithlife’s content permissions and not covered by CC BY-SA.',
});
