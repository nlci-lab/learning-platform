// Competencies and checking cases (ADR 0006): schema checks, bad data fails, and cross-file links.
// Run: npm test -w @cohorts/platform
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
import { competencyList, caseSchema, caseKey, moduleSchema, guide, checkLinks } from '../src/schemas.ts';

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

test('a case key with a duplicate problem or question id fails', () => {
  const c = sample();
  const key = { id: c.id, problems: c.problems, model_analysis: c.model_analysis, questions: c.questions };
  assert.equal(caseKey.safeParse(key).success, true);
  assert.equal(caseKey.safeParse({ ...key, problems: [...c.problems, c.problems[0]] }).success, false);
  assert.equal(caseKey.safeParse({ ...key, questions: [...c.questions, c.questions[0]] }).success, false);
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
  // Same file selection as the content loaders: recursive; .yaml/.yml; cases skip *.key.*; guides .md/.mdx.
  const files = (dir, ok) => existsSync(dir)
    ? readdirSync(dir, { recursive: true }).map(String).filter(ok).map((f) => new URL(f.replaceAll('\\', '/'), dir))
    : [];
  const isYaml = (f) => /\.ya?ml$/.test(f);
  const frontMatter = (u) => yaml.load(readFileSync(u, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  for (const course of readdirSync(coursesDir)) {
    const base = new URL(`${course}/src/content/`, coursesDir);
    const items = [
      ...files(new URL('modules/', base), isYaml).map((u) => ({ kind: 'module', ...moduleSchema.parse(read(u)) })),
      ...files(new URL('cases/', base), (f) => isYaml(f) && !/\.key\.ya?ml$/.test(f)).map((u) => ({ kind: 'case', ...caseSchema.parse(read(u)) })),
      ...files(new URL('guides/', base), (f) => /\.mdx?$/.test(f)).map((u) => ({ kind: 'guide', ...guide.parse(frontMatter(u)) })),
    ];
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

// Curated AI resources (ADR 0007).
import { aiResourceList } from '../src/schemas.ts';
const aiUrl = new URL('../data/ai-resources.yaml', import.meta.url);

test('the AI resource list is valid', () => {
  const r = aiResourceList.safeParse(read(aiUrl));
  assert.ok(r.success, r.success ? '' : JSON.stringify(r.error.issues, null, 2));
});

test('team material without a scope fails', () => {
  const l = read(aiUrl);
  l.resources.push({ ...l.resources[0], id: 'team-x', kind: 'team' });
  delete l.resources.at(-1).scope;
  assert.equal(aiResourceList.safeParse(l).success, false);
});

test('team material with a blank scope fails', () => {
  const l = read(aiUrl);
  l.resources.push({ ...l.resources[0], id: 'team-y', kind: 'team', scope: '   ' });
  assert.equal(aiResourceList.safeParse(l).success, false);
});
