// Base path is a build setting (ADR 0001). GitHub Pages: SITE_BASE=/learning-platform/textual-criticism/
import { defineConfig } from 'astro/config';
import platform from '@cohorts/platform/integration';

const base = process.env.SITE_BASE ?? '/';
const site = process.env.SITE_URL ?? 'https://nlci-lab.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [platform()],
  i18n: { locales: ['en'], defaultLocale: 'en' },
});
