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
