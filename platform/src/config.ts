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
  /** A short mark before the name in the header, e.g. '𝔓'. */
  mark?: string;
  /** Footer text (HTML). */
  footer?: string;
  /** Shows the "under construction" strip and keeps search engines out. Remove at launch. */
  underConstruction?: boolean;
  /** The "Was this page helpful?" Google Form. Without it, no feedback box is shown. */
  feedback?: FeedbackForm;
  /** Names of the four difficulty levels, level 1 first. Shown with the number: "Level 1 · First steps". */
  levels?: [string, string, string, string];
  /** false when the course has no platform Guides page (guides/): hashtags then show as plain labels. Default true. */
  guidesPage?: boolean;
}

export interface FeedbackForm {
  /** Form URL up to (not including) /viewform, e.g. https://docs.google.com/forms/d/e/<id> */
  form: string;
  /** Google Forms entry ids, e.g. 'entry.1446309272'. */
  fields: { page: string; helpful: string; comment: string; name: string };
}

export const defineSite = (c: SiteConfig) => c;

/** The menu item a path belongs to: the longest menu path it starts with (so a page under guide/examples/
    highlights "Examples", not "Guides"). Falls back to the path's first segment. */
export const navItemFor = (site: SiteConfig, path: string) =>
  site.nav.map(([p]) => p).filter((p) => path.startsWith(p)).sort((a, b) => b.length - a.length)[0] ?? path.split('/')[0] + '/';

/** "Level 2 · Everyday use", or "Level 2" when the site has no level names. */
export const levelName = (site: SiteConfig, level: number) => {
  const name = site.levels?.[level - 1];
  return name ? `Level ${level} · ${name}` : `Level ${level}`;
};
