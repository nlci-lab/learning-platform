// Every internal link goes through here so the base path stays a build setting (SITE_BASE).
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export const url = (path = '') => base + path.replace(/^\//, '');

// The Learning Hub's base path (HUB_BASE, set by scripts/build-pages.mjs). Each course sits at <hub><id>/.
// In `astro dev` a course runs alone on its own port, so links to the Hub or another course only resolve in the full build.
const hub = ((typeof process !== 'undefined' && process.env.HUB_BASE) || '/').replace(/\/?$/, '/');
/** A link to the Learning Hub's home page, or a path under it. */
export const hubUrl = (path = '') => hub + path.replace(/^\//, '');
/** A link into another course: courseUrl('logos', 'guides/bible-word-study/'). */
export const courseUrl = (course: string, path = '') => hubUrl(`${course}/${path.replace(/^\//, '')}`);
