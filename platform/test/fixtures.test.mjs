// Validates the micro module fixtures against the platform schema, and checks that bad data fails.
// Run: npm test -w @cohorts/platform   (Node 22.18+ strips the TypeScript types in schemas.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import yaml from 'js-yaml';
import { moduleSchema } from '../src/schemas.ts';

const dir = new URL('../fixtures/modules/', import.meta.url);
const load = (f) => yaml.load(readFileSync(new URL(f, dir), 'utf8'));

for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
  test(`fixture ${f} is a valid module`, () => {
    const r = moduleSchema.safeParse(load(f));
    assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
  });
}

test('a single-answer question with two right options fails', () => {
  const m = load('mark-1-2.yaml');
  m.steps[0].question.options[1].correct = true;
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('duplicate step ids fail', () => {
  const m = load('mark-1-2.yaml');
  m.steps[1].id = m.steps[0].id;
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('an unknown question type fails', () => {
  const m = load('question-types.yaml');
  m.steps[1].question.type = 'dragdrop';
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('a bad id fails', () => {
  const m = load('mark-1-2.yaml');
  m.id = 'Mark 1:2';
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('a matching question with fewer than 3 answers fails', () => {
  const m = load('question-types.yaml');
  const q = m.steps.find((s) => s.question?.type === 'matching').question;
  q.pairs = q.pairs.slice(0, 2);
  q.distractors = [];
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('duplicate source ids fail', () => {
  const m = load('mark-1-2.yaml');
  m.sources[1].id = m.sources[0].id;
  assert.equal(moduleSchema.safeParse(m).success, false);
});

test('an unquoted YAML date is accepted as YYYY-MM-DD', () => {
  const m = load('mark-1-2.yaml');
  m.last_checked = new Date('2026-11-23');
  const r = moduleSchema.safeParse(m);
  assert.ok(r.success);
  assert.equal(r.data.last_checked, '2026-11-23');
});

// Every course's real module files must pass the same schema.
import { readdirSync as rd, existsSync } from 'node:fs';
const coursesDir = new URL('../../courses/', import.meta.url);
for (const course of rd(coursesDir)) {
  const dir = new URL(`${course}/src/content/modules/`, coursesDir);
  if (!existsSync(dir)) continue;
  for (const f of rd(dir).filter((f) => f.endsWith('.yaml'))) {
    test(`course module ${course}/${f} is valid`, () => {
      const r = moduleSchema.safeParse(yaml.load(readFileSync(new URL(f, dir), 'utf8')));
      assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
    });
  }
}

// Decision trees: links between nodes are checked by the schema.
import { decisionTree, series as seriesSchema } from '../src/schemas.ts';
const tree = () => yaml.load(readFileSync(new URL('../fixtures/trees/sample.yaml', import.meta.url), 'utf8'));

test('the sample decision tree is valid', () => {
  const r = decisionTree.safeParse(tree());
  assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
});
test('a tree option that leads nowhere fails', () => {
  const t = tree(); t.nodes[0].options[0].to = 'missing';
  assert.equal(decisionTree.safeParse(t).success, false);
});
test('a tree node that cannot be reached fails', () => {
  const t = tree(); t.nodes.push({ id: 'orphan', kind: 'outcome', title: 'Never reached' });
  assert.equal(decisionTree.safeParse(t).success, false);
});
test('a question with one option, or an outcome with options, fails', () => {
  const q = tree(); q.nodes[0].options.pop();
  assert.equal(decisionTree.safeParse(q).success, false);
  const o = tree(); o.nodes[2].options = [{ label: 'x', to: 'changed' }];
  assert.equal(decisionTree.safeParse(o).success, false);
});
test('a series path must look like learn/decisions/', () => {
  const base = { id: 'decisions', title: 'T', summary: 'S' };
  assert.equal(seriesSchema.safeParse({ ...base, path: 'learn/decisions/' }).success, true);
  assert.equal(seriesSchema.safeParse({ ...base, path: '/learn/decisions' }).success, false);
});
