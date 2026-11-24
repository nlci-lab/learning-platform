// Series rules (platform/src/series.ts) and the stricter decision-tree rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { checkSeries, guidePath, seriesParts } from '../src/series.ts';
import { decisionTree } from '../src/schemas.ts';

const S = [{ id: 'decisions', path: 'learn/decisions/' }];
const G = [
  { id: 'compare', series: { id: 'decisions', part: 1 } },
  { id: 'apparatus', series: { id: 'decisions', part: 4 } },
  { id: 'helps', series: { id: 'decisions', part: 2 } },
  { id: 'layouts' },
];

test('a valid series passes', () => assert.doesNotThrow(() => checkSeries(S, G)));
test('duplicate series ids fail', () => assert.throws(() => checkSeries([...S, { id: 'decisions', path: 'learn/other/' }], G), /listed twice/));
test('two series on one path fail', () => assert.throws(() => checkSeries([...S, { id: 'b', path: 'learn/decisions/' }], G), /both use path/));
test('nested series paths fail', () => assert.throws(() => checkSeries([...S, { id: 'b', path: 'learn/decisions/more/' }], G), /nested/));
test('a series inside a platform path fails', () => {
  for (const path of ['guides/', 'guides/x/', 'practice/x/', 'search/', 'glossary/x/']) assert.throws(() => checkSeries([{ id: 'x', path }], []), /already uses/);
});
test('an unknown series fails', () => assert.throws(() => checkSeries(S, [{ id: 'g', series: { id: 'nope', part: 1 } }]), /not in series.yaml/));
test('a duplicate part fails', () => assert.throws(() => checkSeries(S, [...G, { id: 'twice', series: { id: 'decisions', part: 2 } }]), /both part 2/));
test('addresses: series parts under the series path, other guides under guides/', () => {
  const m = new Map(S.map((s) => [s.id, s]));
  assert.equal(guidePath(G[0], m), 'learn/decisions/compare/');
  assert.equal(guidePath(G[3], m), 'guides/layouts/');
});
test('parts come in reading order; a missing part (a draft) leaves no gap in positions', () => {
  assert.deepEqual(seriesParts('decisions', G).map((g) => g.id), ['compare', 'helps', 'apparatus']);
});

const tree = () => yaml.load(readFileSync(new URL('../fixtures/trees/sample.yaml', import.meta.url), 'utf8'));
test('a loop with no way to an outcome fails', () => {
  const t = tree();
  t.nodes[1].options = [{ label: 'Again', to: 'changed' }];        // step loops back to the question
  t.nodes[0].options = [{ label: 'Yes', to: 'test-it' }, { label: 'No', to: 'test-it' }];
  t.nodes.pop();                                                     // and the outcome is gone
  assert.equal(decisionTree.safeParse(t).success, false);
});
test('a step that leads nowhere fails', () => {
  const t = tree(); t.nodes[1].options = [];
  assert.equal(decisionTree.safeParse(t).success, false);
});
test('the same option label twice fails', () => {
  const t = tree(); t.nodes[0].options[1].label = 'Yes';
  assert.equal(decisionTree.safeParse(t).success, false);
});
