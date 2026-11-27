import { defineSite } from '@cohorts/platform/config';

export const course = defineSite({
  id: 'exegesis',
  title: 'Exegesis for Translation Checking',
  description: 'Finding what the original author meant, and checking that a translation says it: for Bible translators and consultants.',
  lang: 'en',
  nav: [['learn/', 'Learn'], ['guides/', 'Guides'], ['background/', 'Background'], ['glossary/', 'Glossary'], ['search/', 'Search']],
  accent: { light: '#1f5f6b', dark: '#7cc3cf' },
  underConstruction: true,
  guideCovers: true,
  // Names describe the material, not the reader. Shown with the number: "Level 1 · First steps".
  levels: ['First steps', 'Working level', 'Deeper study', 'Advanced'],
  footer: 'Exegesis for translation checking, for Bible translators and consultants, from NLCI. Text CC BY-SA 4.0; code MIT. Scripture quotations marked NIV are from THE HOLY BIBLE, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.',
});
