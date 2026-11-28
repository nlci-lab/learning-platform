#!/usr/bin/env node
// Collect workbench files (scripts/workbench-json.md) from one folder into a CSV on stdout.
// Usage: node scripts/workbench-to-csv.mjs <folder> > results.csv
// One row per file. Files that are not workbench files are skipped with a note on stderr.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('Usage: node scripts/workbench-to-csv.mjs <folder>'); process.exit(1); }

const flat = (o, pre = '', out = {}) => {
  for (const [k, v] of Object.entries(o ?? {})) {
    const key = pre ? `${pre}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out);
    else if (!Array.isArray(v)) out[key] = v;
  }
  return out;
};

const rows = [];
for (const name of readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.json')).sort()) {
  let d;
  try { d = JSON.parse(readFileSync(join(dir, name), 'utf8')); } catch { console.error(`skipped ${name}: not JSON`); continue; }
  if (d?.schema !== 'tc-workbench/1') { console.error(`skipped ${name}: not a workbench file`); continue; }
  const row = { file: name, ...flat(d) };
  for (const r of d.issue?.readings ?? []) for (const k of ['text', 'gloss', 'support', 'inUbsText']) row[`reading.${r.label}.${k}`] = r[k];
  rows.push(row);
}

const cols = [...new Set(rows.flatMap(Object.keys))];
// A leading = + - @ (or tab/CR) would run as a formula in Excel: prefix ' so it stays text.
const cell = (v) => { let s = v === undefined || v === null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
// BOM so Excel reads Greek and Indic text as UTF-8.
process.stdout.write('﻿' + [cols, ...rows.map((r) => cols.map((c) => r[c]))].map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n');
console.error(`${rows.length} file(s)`);
