// Where the platform's pages live in every course. A course puts its route files at these paths
// (see platform/README.md); platform links are built from here and then passed through url().
export const PATHS = {
  learn: 'learn/',
  module: (id: string) => `practice/${id}/`,
  guide: (id: string) => `guides/${id}/`,
  glossary: 'glossary/',
  search: 'search/',
  searchIndex: 'search.json',
};
