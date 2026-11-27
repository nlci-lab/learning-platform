// The course map: from where the text comes from to deciding a variant and writing it up. Shown on the front page and on Learn.
// `href` is a course path where a ready unit starts; `also` is a path under the Learning Hub (another course).
import type { MapUnit } from '@cohorts/platform/components/CourseMap.astro';

export const COURSE_MAP: MapUnit[] = [
  { level: 'Background', title: 'Where the text comes from', topics: 'Writing materials, the New and Old Testament texts, and the printed editions from Erasmus to UBS5.', href: 'background/' },
  { level: 'First steps', title: 'What textual criticism is, and when it matters', topics: 'What textual criticism is, which variants matter to a translator, and the decision tree.', href: 'guide/what-is-textual-criticism/' },
  { level: 'Tools', title: 'Reading the apparatus', topics: 'The UBS apparatus, the apparatus in Paratext, and the witnesses it cites.', href: 'guide/apparatus/', also: { label: 'Text Comparison (Logos course)', path: 'logos/guides/text-comparison/' } },
  { level: 'Decisions', title: 'Making textual decisions', topics: 'Five ways a team can decide a variant, from comparing versions to full textual criticism, all on John 1:18.', href: 'learn/decisions/' },
  { level: 'Weighing', title: 'Weighing the evidence', topics: 'External and internal evidence, doubtful passages, and worked examples on real verses.', href: 'guide/weighing-evidence/' },
  { level: 'In the translation', title: 'From decision to published text', topics: 'Which base text to follow, two Greek texts, writing footnotes, explaining differences to readers, and Old Testament decisions.', href: 'guide/text-policy/' },
];
