export const meta = {
  name: 'editorial-review',
  description: 'Editorial review committee: seven read-only reviewers on course content, then a chair who merges and ranks',
  whenToUse: 'Before a content PR (args.target = a commit, range or file list), or for a whole-course audit (args.target = "all content files in courses/<name>/src/")',
  phases: [
    { title: 'Review', detail: 'seven reviewers in parallel, each on one dimension' },
    { title: 'Chair', detail: 'merge, check evidence, rank, list lessons' },
  ],
}

// args: { target: string, context?: string, skip?: string[] }
//   target  what to review, e.g. "commit da27ef4", "git diff upstream/main...HEAD -- courses/exegesis",
//           or "all content files under courses/logos/src/content/" (whole-course audit).
//   context optional notes for every reviewer, e.g. the path of a local Translation Academy clone.
//   skip    optional reviewer keys to leave out, e.g. ["plain-english"] for a quick re-run.
const a = typeof args === 'string' ? { target: args } : (args || {})
if (!a.target) throw new Error('editorial-review needs args.target (a commit, range or file list)')

const REVIEWERS = [
  { key: 'leak-guard', agentType: 'review-leak-guard' },
  { key: 'source-auditor', agentType: 'review-source-auditor' },
  { key: 'rights-guard', agentType: 'review-rights-guard' },
  { key: 'fact-checker', agentType: 'review-fact-checker' },
  { key: 'consistency', agentType: 'review-consistency' },
  { key: 'voice-doctrine', agentType: 'review-voice-doctrine' },
  { key: 'plain-english', agentType: 'review-plain-english' },
].filter((r) => !(a.skip || []).includes(r.key))

if ((a.skip || []).length) log(`Skipping reviewers: ${a.skip.join(', ')}`)

const brief = (key) => [
  `Review target: ${a.target}`,
  a.context ? `Context: ${a.context}` : '',
  `Follow your ${key} brief. Report findings only, in markdown, each with file:line, text, problem, evidence, fix and severity.`,
  'Read only: do not edit, commit or push anything.',
].filter(Boolean).join('\n')

// Barrier: the chair needs every report together.
phase('Review')
const reports = await parallel(REVIEWERS.map((r) => () =>
  agent(brief(r.key), { label: r.key, phase: 'Review', agentType: r.agentType })
    .then((text) => ({ key: r.key, text }))))

const done = reports.filter((r) => r && r.text)
const missing = REVIEWERS.map((r) => r.key).filter((k) => !done.some((r) => r.key === k))
if (missing.length) log(`No report from: ${missing.join(', ')} (the chair is told)`)

phase('Chair')
const chairPrompt = [
  `Review target: ${a.target}`,
  missing.length ? `These reviewers returned nothing, so their dimensions are NOT covered: ${missing.join(', ')}.` : '',
  'Here are the reviewers\' reports. Merge, check each must-fix and should-fix against the files, rank, list clean areas and lessons for the briefs.',
  ...done.map((r) => `\n===== ${r.key} =====\n${r.text}`),
].filter(Boolean).join('\n')

const merged = await agent(chairPrompt, { label: 'chair', phase: 'Chair', agentType: 'review-chair' })

return { target: a.target, reviewers: done.map((r) => r.key), missing, report: merged, raw: done }
