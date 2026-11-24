// Rehype plugin: in Markdown pages (guides), a link written as `~/learn/` becomes an internal link
// with the site's base path, the same rule as md() in markdown.ts. Keeps the base a build setting.
export function rehypeInternalLinks({ base = '/' } = {}) {
  const root = base.replace(/\/?$/, '/');
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string' && node.properties.href.startsWith('~/')) {
      node.properties.href = root + node.properties.href.slice(2);
    }
    // MDX: <a href="~/…"> written as JSX in the text.
    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'a') {
      for (const at of node.attributes ?? []) {
        if (at.type === 'mdxJsxAttribute' && at.name === 'href' && typeof at.value === 'string' && at.value.startsWith('~/')) at.value = root + at.value.slice(2);
      }
    }
    for (const child of node.children ?? []) walk(child);
  };
  return (tree) => walk(tree);
}
