// The course map: from setting Logos up to studying a passage and a word. Shown on the front page and on Learn.
// `href` is a course path where a ready unit starts; `also` is a path under the Learning Hub (another course).
import type { MapUnit } from '@cohorts/platform/components/CourseMap.astro';

export const COURSE_MAP: MapUnit[] = [
  { level: 'Set up', title: 'Setting up Logos', topics: 'Program settings, internet and download settings, the kinds of resources, your library and its priorities, help and shortcuts.', href: 'guides/program-settings/' },
  { level: 'Find your way', title: 'Moving around and working with several books', topics: 'Moving in a Bible or a book, layouts, and link sets that make books move together.', href: 'guides/moving-around/' },
  { level: 'Search and compare', title: 'Finding words and comparing translations', topics: 'Searching your Bibles and books, and Text Comparison to see where translations differ.', href: 'guides/search/', also: { label: 'Making textual decisions (Textual Criticism course)', path: 'textual-criticism/learn/decisions/' } },
  { level: 'Passage', title: 'Studying a passage', topics: 'The Passage Guide and the Exegetical Guide: what Logos gathers on one passage and on the words of the original text.', href: 'guides/passage-guide/', also: { label: 'Exegesis for Translation Checking', path: 'exegesis/' } },
  { level: 'Word', title: 'Studying a word', topics: 'Bible Word Study: the senses of a word, how translations render it, and where it is used.', href: 'guides/bible-word-study/', also: { label: 'Studying words (Exegesis course)', path: 'exegesis/#map' } },
];
