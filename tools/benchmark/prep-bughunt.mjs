#!/usr/bin/env node
/**
 * prep-bughunt.mjs — Prepare the Suite H bug-hunt fixture
 *
 * Lays down TWO identical, history-free copies of the public ehAyeCoreCLI
 * `benchmark` branch — one per lane — so each model "sees its own project"
 * and cannot `git log` / `git diff` the injected bugs out of history.
 *
 *   temp/bench/dojo-solo/ehAyeCoreCLI/   ← lane A
 *   temp/bench/dojo-duo/ehAyeCoreCLI/    ← lane B
 *
 * Each copy is:
 *   - a depth-1 clone of ONLY the `benchmark` branch
 *   - verified on the benchmark branch
 *   - stripped of .git   ← the anti-cheat: no history, no diff-vs-origin
 *
 * USAGE (from this public repo root)
 *   node tools/benchmark/prep-bughunt.mjs
 *   npm run bench:prep
 *
 * Idempotent: wipes and recreates the two folders on each run.
 *
 * This tool is intentionally self-contained. It does not read private product
 * config, private source trees, or sealed answer keys.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPO = 'https://github.com/neekware/ehAyeCoreCLI.git';
const BRANCH = 'benchmark';
const DEST_DIR = path.resolve(ROOT, 'temp/bench');
const LANES = ['dojo-solo', 'dojo-duo'];
const PROJECT = 'ehAyeCoreCLI';

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();

function prepLane(lane) {
  const laneDir = path.join(DEST_DIR, lane);
  const dest = path.join(laneDir, PROJECT);

  if (existsSync(laneDir)) rmSync(laneDir, { recursive: true, force: true });
  mkdirSync(laneDir, { recursive: true });

  run('git', ['clone', '--depth', '1', '--branch', BRANCH, REPO, dest]);

  const onBranch = run('git', ['branch', '--show-current'], dest);
  if (onBranch !== BRANCH) {
    throw new Error(`${lane}: expected branch '${BRANCH}', got '${onBranch}'`);
  }

  rmSync(path.join(dest, '.git'), { recursive: true, force: true });

  if (existsSync(path.join(dest, '.git'))) {
    throw new Error(`${lane}: .git still present after strip`);
  }

  return dest;
}

console.error(`Preparing bug-hunt fixture from ${REPO} @ ${BRANCH}`);
mkdirSync(DEST_DIR, { recursive: true });

const done = [];
for (const lane of LANES) {
  try {
    const dest = prepLane(lane);
    console.error(
      `✅ ${lane.padEnd(10)} → ${path.relative(ROOT, dest)}  (branch verified, .git stripped)`
    );
    done.push(lane);
  } catch (err) {
    console.error(`❌ ${lane}: ${err.message}`);
    process.exitCode = 1;
  }
}

if (done.length === LANES.length) {
  console.error(`\nReady. Two identical history-free copies:`);
  for (const lane of LANES) console.error(`   temp/bench/${lane}/${PROJECT}/`);
  console.error(`\nPoint each model at its own project folder and run the hunt.`);
  console.error(`Do NOT give models the sealed answer key (kept out of this repo).`);
}
