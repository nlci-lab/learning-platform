// The platform's Astro integration. In a site's astro.config.mjs: integrations: [platform()].
import type { AstroIntegration } from 'astro';
import externalLinks from './integrations/external-links.mjs';
import { rehypeInternalLinks } from './integrations/internal-links.mjs';
import mdx from '@astrojs/mdx';

const internalLinks: AstroIntegration = {
  name: 'internal-links',
  hooks: {
    'astro:config:setup': ({ config, updateConfig }) => {
      updateConfig({ markdown: { rehypePlugins: [[rehypeInternalLinks, { base: config.base }]] } });
    },
  },
};

// MDX lets a guide include course components (e.g. collation cards). It comes after internalLinks so that
// it inherits the same Markdown settings, including the ~/ link rewriting.
export default function platform(): AstroIntegration[] {
  return [internalLinks, mdx(), externalLinks()];
}
