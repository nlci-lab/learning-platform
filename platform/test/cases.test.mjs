// Competencies and checking cases (ADR 0006): schema checks, bad data fails, and cross-file links.
// Run: npm test -w @cohorts/platform
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { competencyList, caseSchema, moduleSchema, checkLinks } from '../src/schemas.ts';

const read = (u) => yaml.load(readFileSync(u, 'utf8'));
const listUrl = new URL('../data/competencies.yaml', import.meta.url);
const caseDir = new URL('../fixtures/cases/', import.meta.url);
const sample = () => read(new URL('sample-calming-the-storm.yaml', caseDir));

test('the competency list is valid', () => {
  const r = competencyList.safeParse(read(listUrl));
  assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
});

test('a duplicate competency id fails', () => {
  const l = read(listUrl);
  l.competencies[1].id = l.competencies[0].id;
  assert.equal(competencyList.safeParse(l).success, false);
});

for (const f of readdirSync(caseDir).filter((f) => f.endsWith('.yaml'))) {
  test(`fixture case ${f} is valid`, () => {
    const r = caseSchema.safeParse(read(new URL(f, caseDir)));
    assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
  });
}

test('a problem pointing to a missing segment fails', () => {
  const c = sample(); c.problems[0].segment = 's9';
  assert.equal(caseSchema.safeParse(c).success, false);
});

test('a team draft without permission fails', () => {
  const c = sample(); c.provenance = 'team-anonymised';
  assert.equal(caseSchema.safeParse(c).success, false);
  c.permission = 'consent-2026-01';
  assert.equal(caseSchema.safeParse(c).success, true);
});

test('an assessed case with answers in its public file fails', () => {
  const c = sample(); c.assessed = true;
  assert.equal(caseSchema.safeParse(c).success, false);
  delete c.problems; delete c.model_analysis; delete c.questions;
  assert.equal(caseSchema.safeParse(c).success, true);
});

test('a practice case with only non-problems fails', () => {
  const c = sample(); c.problems = c.problems.filter((p) => p.kind === 'none');
  assert.equal(caseSchema.safeParse(c).success, false);
});

test('unknown competency and requires ids are reported', () => {
  const ids = new Set(read(listUrl).competencies.map((c) => c.id));
  const out = checkLinks([
    { kind: 'case', id: 'a', competencies: ['read-back-translation', 'no-such'], requires: ['b', 'missing'] },
    { kind: 'module', id: 'b', competencies: [], requires: [] },
  ], ids);
  assert.deepEqual(out, ['case "a" names unknown competency "no-such"', 'case "a" requires "missing", which is not in this course']);
});

// Every course, plus the fixtures: competency and requires ids must exist. Print uncovered competencies.
test('all content links to known competencies and content', () => {
  const list = read(listUrl).competencies;
  const ids = new Set(list.map((c) => c.id));
  const covered = new Set();
  const groups = [{ name: 'fixtures', items: [{ kind: 'case', ...caseSchema.parse(sample()) }] }];
  const coursesDir = new URL('../../courses/', import.meta.url);
  for (const course of readdirSync(coursesDir)) {
    const items = [];
    const mods = new URL(`${course}/src/content/modules/`, coursesDir);
    if (existsSync(mods)) for (const f of readdirSync(mods).filter((f) => f.endsWith('.yaml')))
      items.push({ kind: 'module', ...moduleSchema.parse(read(new URL(f, mods))) });
    const cases = new URL(`${course}/src/content/cases/`, coursesDir);
    if (existsSync(cases)) for (const f of readdirSync(cases).filter((f) => f.endsWith('.yaml') && !f.endsWith('.key.yaml')))
      items.push({ kind: 'case', ...caseSchema.parse(read(new URL(f, cases))) });
    groups.push({ name: course, items });
  }
  const problems = [];
  for (const g of groups) {
    problems.push(...checkLinks(g.items, ids).map((p) => `${g.name}: ${p}`));
    for (const it of g.items) if (g.name !== 'fixtures') it.competencies.forEach((c) => covered.add(c));
  }
  assert.deepEqual(problems, []);
  const open = list.filter((c) => !covered.has(c.id)).map((c) => c.id);
  if (open.length) console.log(`Competencies no course content covers yet (${open.length}): ${open.join(', ')}`);
});
