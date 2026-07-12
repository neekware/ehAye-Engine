#!/usr/bin/env node
/**
 * list-tasks.mjs — Print the public task catalog from benchmarks/tasks/*.md
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TASKS = path.join(ROOT, 'benchmarks', 'tasks');

if (!existsSync(TASKS)) {
  console.error('No benchmarks/tasks directory found.');
  process.exit(1);
}

const files = readdirSync(TASKS)
  .filter((f) => f.endsWith('.md'))
  .sort();

console.log('Public benchmark tasks:\n');
for (const f of files) {
  const text = readFileSync(path.join(TASKS, f), 'utf8');
  const title = (text.match(/^#\s+(.+)$/m) || [, f])[1];
  const id = (text.match(/\*\*ID:\*\*\s*`?([^`\n]+)`?/) || [, '—'])[1].trim();
  console.log(`  ${id.padEnd(6)} ${title}  (${f})`);
}
console.log(`\n${files.length} task file(s). See benchmarks/README.md for the full suite.`);
