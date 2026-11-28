// Textual Criticism course (moved from nlci-lab/textual-criticism, ROADMAP Phase 5).
// Base path is a build setting: SITE_BASE=/learning-platform/textual-criticism/ on GitHub Pages.
import { defineSite } from '@cohorts/platform/config';

export const course = defineSite({
  id: 'textual-criticism',
  title: 'Textual Criticism',
  description: 'An introduction to textual criticism of the Bible for translators and consultants: the manuscripts, the printed editions and their apparatus, and how to weigh the evidence.',
  lang: 'en',
  mark: '𝔓',
  nav: [
    ['witnesses/', 'Witnesses'],
    ['guide/', 'Guides'],
    ['guide/examples/', 'Examples'],
    ['learn/', 'Learn'],
    ['background/', 'Background'],
    ['workbench/', 'Workbench'],
  ],
  // Rubrication red: the site's only accent, kept for sigla and links (AA on paper in both themes).
  accent: { light: '#9d2a1f', dark: '#f08b7c' },
  underConstruction: true,
  footer: 'An introductory resource on textual criticism for Bible translators and consultants, from NLCI. Text CC BY-SA 4.0; code MIT. Images stay under their holders’ terms and are linked, not copied.',
  feedback: {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLScpYSI4caU6nIqjtIHRco82kP3zA9MxJLTibfwkpjesGLnkcQ',
    fields: { page: 'entry.1446309272', helpful: 'entry.456704230', comment: 'entry.589762770', name: 'entry.617170599' },
  },
  // The same four levels as the other courses.
  levels: ['First steps', 'Everyday use', 'Deeper study', 'Expert tools'],
  // This course keeps its own guide index at guide/; it has no platform Guides page, so hashtags are plain labels.
  guidesPage: false,
});
