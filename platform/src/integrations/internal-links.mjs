// Rehype plugin: in Markdown pages (guides), a link written as `~/learn/` becomes an internal link
// with the site's base path, the same rule as md() in markdown.ts. Keeps the base a build setting.
// `~hub/logos/guides/search/` links into the Learning Hub or another course (HUB_BASE, see url.ts).
export function rehypeInternalLinks({ base = '/', hub = process.env.HUB_BASE || '/' } = {}) {
  const root = base.replace(/\/?$/, '/');
  const hubRoot = hub.replace(/\/?$/, '/');
  const fix = (h) => (h.startsWith('~/') ? root + h.slice(2) : h.startsWith('~hub/') ? hubRoot + h.slice(5) : h);
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string' && node.properties.href.startsWith('~')) {
      node.properties.href = fix(node.properties.href);
    }
    // MDX: <a href="~/…"> written as JSX in the text.
    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'a') {
      for (const at of node.attributes ?? []) {
        if (at.type === 'mdxJsxAttribute' && at.name === 'href' && typeof at.value === 'string') at.value = fix(at.value);
      }
    }
    for (const child of node.children ?? []) walk(child);
  };
  return (tree) => walk(tree);
}
