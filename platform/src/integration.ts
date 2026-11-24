// The platform's Astro integration. In a site's astro.config.mjs: integrations: [platform()].
import type { AstroIntegration } from 'astro';
import externalLinks from './integrations/external-links.mjs';
import { rehypeInternalLinks } from './integrations/internal-links.mjs';

const internalLinks: AstroIntegration = {
  name: 'internal-links',
  hooks: {
    'astro:config:setup': ({ config, updateConfig }) => {
      updateConfig({ markdown: { rehypePlugins: [[rehypeInternalLinks, { base: config.base }]] } });
    },
  },
};

export default function platform(): AstroIntegration[] {
  return [internalLinks, externalLinks()];
}
