// Text fields in content data are Markdown. Rendered at build time; the content is ours, so HTML in it is kept.
import { Marked } from 'marked';
import { url } from './url';

const marked = new Marked({ gfm: true });
/** Links written as `~/learn/` in content become internal links through url(), so the base path stays a setting. */
const internal = (s: string) => s.replace(/\]\(~\/([^)\s]*)\)/g, (_m, p: string) => `](${url(p)})`);

export const md = (s = '') => (s ? (marked.parse(internal(s), { async: false }) as string) : '');
export const mdInline = (s = '') => (s ? (marked.parseInline(internal(s), { async: false }) as string) : '');
/** Plain text, for search and meta tags. */
export const plain = (s = '') => mdInline(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '’').replace(/\s+/g, ' ').trim();
