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
