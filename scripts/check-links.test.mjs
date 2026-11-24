// Tests for the deploy link check. Each case builds a tiny site in a temporary folder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkLinks } from './check-links.mjs';

const BASE = '/lp/';
function site(pageHtml) {
  const dir = mkdtempSync(join(tmpdir(), 'links-'));
  mkdirSync(join(dir, 'guides', 'a'), { recursive: true });
  mkdirSync(join(dir, '_astro'));
  writeFileSync(join(dir, 'guides', 'a', 'index.html'), '<p>a</p>');
  writeFileSync(join(dir, '_astro', 'x.css'), '');
  writeFileSync(join(dir, 'index.html'), pageHtml);
  return dir;
}
function run(html) {
  const dir = site(html);
  try { return checkLinks(dir, BASE); } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('good links pass: double, single, unquoted and spaced attributes', () => {
  const r = run(`<a href="/lp/guides/a/">1</a><a href='/lp/guides/a/'>2</a><a href=/lp/_astro/x.css>3</a><img src = "/lp/_astro/x.css">`);
  assert.deepEqual(r.problems, []);
  assert.equal(r.checked, 4);
});

test('a broken link in single quotes is caught', () => {
  assert.equal(run(`<a href='/lp/missing/'>x</a>`).problems.length, 1);
});

test('a link without the base is caught', () => {
  assert.match(run(`<a href="/guides/a/">x</a>`).problems[0], /outside the base/);
});

test('".." cannot escape the base or the site', () => {
  assert.equal(run(`<a href="/lp/../README.md">x</a>`).problems.length, 1);
});

test('a folder without index.html is not a page', () => {
  assert.match(run(`<a href="/lp/_astro">x</a>`).problems[0], /missing file/);
});

test('external links, anchors and relative links are skipped', () => {
  const r = run(`<a href="https://example.org/">e</a><a href="#top">t</a><a href="guides/a/">r</a><a href="//cdn.example/x">c</a>`);
  assert.deepEqual(r, { checked: 0, problems: [] });
});
