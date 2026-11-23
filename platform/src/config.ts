// What each site (the master site or a course) tells the platform about itself.
// Ids are stable once published (ADR 0002).
export interface SiteConfig {
  /** Stable id; also the URL path segment for a course, e.g. 'logos'. */
  id: string;
  /** Name shown in the header and the browser tab. */
  title: string;
  /** Default meta description. */
  description: string;
  /** BCP 47 language of the site, e.g. 'en'. */
  lang: string;
  /** Main menu: [path relative to the site base, label]. */
  nav: [string, string][];
  /** Accent colour for light and dark themes. Defaults come from the platform. */
  accent?: { light: string; dark: string };
}

export const defineSite = (c: SiteConfig) => c;
