// Master site. Base path is a build setting: SITE_BASE=/cohorts-cit/ on GitHub Pages.
import { defineConfig } from 'astro/config';
import platform from '@cohorts/platform/integration';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://nlci-lab.github.io',
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [platform()],
});
