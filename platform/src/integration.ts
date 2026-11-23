// The platform's Astro integration. In a site's astro.config.mjs: integrations: [platform()].
import type { AstroIntegration } from 'astro';
import externalLinks from './integrations/external-links.mjs';

export default function platform(): AstroIntegration[] {
  return [externalLinks()];
}
