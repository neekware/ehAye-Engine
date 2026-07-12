#!/usr/bin/env node
/**
 * prep-bughunt.mjs — Prepare per-lane benchmark workspaces
 *
 * For each lane (dojo-solo, dojo-duo):
 *
 *   temp/bench/<lane>/
 *     ehAyeCoreCLI/     ← history-free clone of public branch `benchmark`
 *     authsample/       ← FORCE COPY of benchmarks/fixtures/authsample
 *     sales/            ← FORCE COPY of benchmarks/fixtures/sales
 *     todo-spec/        ← FORCE COPY of benchmarks/fixtures/todo-spec
 *     README.md         ← what lives here (so agents don't wander)
 *
 * Why force-copy (not symlink) next to ehAyeCoreCLI:
 *   The driver points each model at ONE lane folder. Everything the model
 *   needs for Suites D / G / H is right there — no roaming the monorepo.
 *   Copies are isolated: if one model edits a fixture, the other lane
 *   (and the canonical fixtures/) stay clean.
 *
 * Clone details:
 *   - depth-1 clone of ONLY the `benchmark` branch
 *   - verified on that branch
 *   - .git stripped (anti-cheat: no git log / diff-vs-origin)
 *
 * USAGE (from this public repo root)
 *   node tools/benchmark/prep-bughunt.mjs
 *   npm run bench:prep
 *
 * Idempotent: wipes and recreates the two lane folders on each run.
 *
 * Self-contained: no private product config, no sealed answer keys.
 */
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPO = 'https://github.com/neekware/ehAyeCoreCLI.git';
const BRANCH = 'benchmark';
const DEST_DIR = path.resolve(ROOT, 'temp/bench');
const LANES = ['dojo-solo', 'dojo-duo'];
const PROJECT = 'ehAyeCoreCLI';

/** Fixture dirs under benchmarks/fixtures/ → real folder name inside each lane */
const FIXTURES = [
  { name: 'authsample', from: path.join(ROOT, 'benchmarks', 'fixtures', 'authsample') },
  { name: 'sales', from: path.join(ROOT, 'benchmarks', 'fixtures', 'sales') },
  { name: 'todo-spec', from: path.join(ROOT, 'benchmarks', 'fixtures', 'todo-spec') },
];

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();

function copyFixtures(laneDir) {
  for (const { name, from } of FIXTURES) {
    if (!existsSync(from)) {
      throw new Error(`missing fixture source: ${path.relative(ROOT, from)}`);
    }
    const target = path.join(laneDir, name);
    // Force recursive copy — independent tree per lane (no shared symlink)
    cpSync(from, target, { recursive: true, force: true });
  }
}

function writeLaneReadme(laneDir, lane) {
  const body = `# Benchmark lane: ${lane}

This folder is the **only** project root for this model during the run.
Do not leave this directory. Everything you need is here:

| Path | Suite | What it is |
| ---- | ----- | ---------- |
| \`ehAyeCoreCLI/\` | H1 | Bug-hunt tree (\`.git\` stripped — read the code) |
| \`authsample/\` | D1, D2 | Login/auth module → state machine + login flow |
| \`sales/\` | D3 | Fixed CSV → chart |
| \`todo-spec/\` | G1 | Website acceptance criteria |

\`authsample\`, \`sales\`, and \`todo-spec\` are **private copies** for this lane only.
If you edit them, the other lane is unaffected.

## Prompts (driver will also say these)

- **D1:** Please look at the code in \`authsample/\` and give me the state machine.
- **D2:** Please show me the flow of login to authentication from that code.
- **D3:** Please take the local dataset in \`sales/\` and make a beautiful chart from it.
- **G1:** Please write a website that meets every requirement in \`todo-spec/\`. Make it run, and verify it.
- **H1:** Please find the two bugs in \`ehAyeCoreCLI/\` — one obvious, one subtle — fix them, and verify your fixes.
`;
  writeFileSync(path.join(laneDir, 'README.md'), body);
}

function prepLane(lane) {
  const laneDir = path.join(DEST_DIR, lane);
  const dest = path.join(laneDir, PROJECT);

  if (existsSync(laneDir)) rmSync(laneDir, { recursive: true, force: true });
  mkdirSync(laneDir, { recursive: true });

  // 1. Shallow clone ONLY the benchmark branch
  run('git', ['clone', '--depth', '1', '--branch', BRANCH, REPO, dest]);

  // 2. Verify branch
  const onBranch = run('git', ['branch', '--show-current'], dest);
  if (onBranch !== BRANCH) {
    throw new Error(`${lane}: expected branch '${BRANCH}', got '${onBranch}'`);
  }

  // 3. Strip git history — anti-cheat
  rmSync(path.join(dest, '.git'), { recursive: true, force: true });
  if (existsSync(path.join(dest, '.git'))) {
    throw new Error(`${lane}: .git still present after strip`);
  }

  // 4. Force-copy fixtures next to ehAyeCoreCLI (isolated per lane)
  copyFixtures(laneDir);

  // 5. Lane map so agents don't wander
  writeLaneReadme(laneDir, lane);

  for (const { name } of FIXTURES) {
    const folder = path.join(laneDir, name);
    if (!existsSync(folder)) throw new Error(`${lane}: copy missing: ${name}`);
  }

  return laneDir;
}

console.error(`Preparing lane workspaces from ${REPO} @ ${BRANCH}`);
console.error(`Force-copy fixtures → each lane gets its own authsample/sales/todo-spec`);
mkdirSync(DEST_DIR, { recursive: true });

const done = [];
for (const lane of LANES) {
  try {
    const laneDir = prepLane(lane);
    console.error(
      `✅ ${lane.padEnd(10)} → ${path.relative(ROOT, laneDir)}/  (clone + force-copied fixtures + README)`
    );
    done.push(lane);
  } catch (err) {
    console.error(`❌ ${lane}: ${err.message}`);
    process.exitCode = 1;
  }
}

if (done.length === LANES.length) {
  console.error(`\nReady. Point each model at its OWN lane folder (not the repo root):`);
  for (const lane of LANES) {
    console.error(`   temp/bench/${lane}/`);
    console.error(`      ehAyeCoreCLI/   authsample/   sales/   todo-spec/   README.md`);
  }
  console.error(`\nFixtures are independent copies — edits in one lane never touch the other.`);
  console.error(`Do NOT give models sealed answer keys (kept out of this repo).`);
}
