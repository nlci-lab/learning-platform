// The two link passes the platform integration adds to every build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rehypeInternalLinks } from '../src/integrations/internal-links.mjs';
import { rewrite, isExternal } from '../src/integrations/external-links.mjs';

const a = (href) => ({ type: 'element', tagName: 'a', properties: { href }, children: [] });

test('~/ links get the base path; other links are left alone', () => {
  const tree = { type: 'root', children: [a('~/guides/layouts/'), a('../x/'), a('https://example.org/')] };
  rehypeInternalLinks({ base: '/cohorts/logos' })(tree);
  assert.deepEqual(tree.children.map((n) => n.properties.href), ['/cohorts/logos/guides/layouts/', '../x/', 'https://example.org/']);
});

test('external links open in a new tab with noopener and a screen-reader note', () => {
  const { out, n } = rewrite('<a href="https://example.org/">Ex</a> <a href="/logos/learn/">In</a>', 'https://nlci-lab.github.io', '/logos/');
  assert.equal(n, 1);
  assert.match(out, /<a href="https:\/\/example.org\/" target="_blank" rel="noopener">Ex<span class="visually-hidden"> \(opens in a new tab\)<\/span><\/a>/);
  assert.match(out, /<a href="\/logos\/learn\/">In<\/a>/);
});

test('same host outside the base path counts as external', () => {
  assert.equal(isExternal('https://nlci-lab.github.io/other/', 'https://nlci-lab.github.io', '/logos/'), true);
  assert.equal(isExternal('https://nlci-lab.github.io/logos/x/', 'https://nlci-lab.github.io', '/logos/'), false);
  assert.equal(isExternal('mailto:a@b.c', 'https://nlci-lab.github.io', '/logos/'), false);
});

test('quotes in a single-quoted aria-label survive the rewrite', () => {
  const { out } = rewrite(`<a href="https://example.org/" aria-label='Read "Layout" guide, $1'>x</a>`, 'https://nlci-lab.github.io', '/logos/');
  assert.match(out, /aria-label="Read &quot;Layout&quot; guide, \$1 \(opens in a new tab\)"/);
});
