// Text fields in content data are Markdown. Rendered at build time; the content is ours, so HTML in it is kept.
import { Marked } from 'marked';
import { url, hubUrl } from './url';

/** Links written as `~/learn/` in content become internal links through url(), so the base path stays a setting.
    The same rule applies in guide Markdown (integrations/internal-links.mjs). */
const marked = new Marked({
  gfm: true,
  walkTokens(token) {
    if (token.type === 'link' && token.href.startsWith('~/')) token.href = url(token.href.slice(2));
    else if (token.type === 'link' && token.href.startsWith('~hub/')) token.href = hubUrl(token.href.slice(5));
  },
});

export const md = (s = '') => (s ? (marked.parse(s, { async: false }) as string) : '');
export const mdInline = (s = '') => (s ? (marked.parseInline(s, { async: false }) as string) : '');
/** Plain text, for search and meta tags. */
export const plain = (s = '') =>
  mdInline(s).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
