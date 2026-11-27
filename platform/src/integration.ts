// The platform's Astro integration. In a site's astro.config.mjs: integrations: [platform()].
import type { AstroIntegration } from 'astro';
import externalLinks from './integrations/external-links.mjs';
import { rehypeInternalLinks } from './integrations/internal-links.mjs';
import previews from './integrations/previews.mjs';
import mdx from '@astrojs/mdx';

const internalLinks: AstroIntegration = {
  name: 'internal-links',
  hooks: {
    'astro:config:setup': ({ config, updateConfig }) => {
      updateConfig({ markdown: { rehypePlugins: [[rehypeInternalLinks, { base: config.base }]] } });
    },
  },
};

// MDX lets a guide include course components (e.g. collation cards). MDX extends the site's Markdown
// settings, so the ~/ link rewriting (rehypeInternalLinks) applies to .mdx guides as well.
export default function platform(): AstroIntegration[] {
  return [internalLinks, mdx(), externalLinks(), previews()];
}
