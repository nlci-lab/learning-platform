// Rehype plugin: wraps each Markdown table (a <table> with no class) in a scroll region, so a wide
// table scrolls sideways on a narrow screen. The region is focusable and labelled, so keyboard
// readers can scroll it too (some browsers do not make a scrolling table focusable). No JavaScript.
// The label is the text of the nearest heading before the table, or "Table".
const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));

export function rehypeTableScroll() {
  return (tree) => {
    let heading = '';
    const walk = (node) => {
      const kids = node.children ?? [];
      for (let i = 0; i < kids.length; i++) {
        const c = kids[i];
        if (c.type !== 'element') continue;
        if (/^h[1-6]$/.test(c.tagName)) { heading = text(c).trim(); continue; }
        if (c.tagName === 'table' && !c.properties?.className) {
          kids[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: heading ? `Table: ${heading}` : 'Table' },
            children: [c],
          };
          continue;
        }
        walk(c);
      }
    };
    walk(tree);
  };
}
