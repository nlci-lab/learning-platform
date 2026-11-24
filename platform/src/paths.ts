// Where the platform's pages live in every course. A course puts its route files at these paths
// (see platform/README.md); platform links are built from here and then passed through url().
export const PATHS = {
  learn: 'learn/',
  module: (id: string) => `practice/${id}/`,
  guides: 'guides/',
  guide: (id: string) => `guides/${id}/`,
  /** The Guides page filtered to one hashtag (the filter needs JavaScript; without it all guides show). */
  tag: (tag: string) => `guides/?tag=${encodeURIComponent(tag)}`,
  background: 'background/',
  glossary: 'glossary/',
  search: 'search/',
  searchIndex: 'search.json',
};
