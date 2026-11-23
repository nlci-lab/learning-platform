// Rehype plugin: in Markdown pages (guides), a link written as `~/learn/` becomes an internal link
// with the site's base path, the same rule as md() in markdown.ts. Keeps the base a build setting.
export function rehypeInternalLinks({ base = '/' } = {}) {
  const root = base.replace(/\/?$/, '/');
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string' && node.properties.href.startsWith('~/')) {
      node.properties.href = root + node.properties.href.slice(2);
    }
    for (const child of node.children ?? []) walk(child);
  };
  return (tree) => walk(tree);
}
