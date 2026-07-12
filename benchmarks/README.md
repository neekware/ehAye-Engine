# ehAye Dojo — Public LLM Model Benchmark Suite

> **Philosophy:** Benchmark how people _actually_ use models — real tasks, real tools, real failure modes. No cherry-picked prompts, no pre-baked winner. Every task has a **fixed rubric**, a **pinned expected answer** (where applicable), and **identical starting conditions**. A number you can't defend is theater.

This folder is the **public, self-contained** harness. Run models **from this repository** so they see fixtures and tasks only — not private product source. That keeps results untainted and builds trust.

## Layout

```text
ehAye-Engine/                    ← public repo (this one)
├── package.json                 ← npm scripts for prep / extract / list
├── tools/benchmark/             ← prep + usage extract (no private paths)
├── benchmarks/
│   ├── README.md                ← this file
│   ├── suite.md                 ← full suite philosophy + scoring
│   ├── fixtures/
│   │   ├── authsample/          ← Suite D code (state machine + login flow)
│   │   ├── sales/               ← Suite D3 CSV
│   │   └── todo-spec/           ← Suite G fixed acceptance criteria
│   ├── tasks/                   ← one markdown file per task (A1…H1)
│   ├── templates/               ← snapshot + score sheet
│   └── runs/                    ← operator-filled results (gitignored contents)
└── temp/bench/                  ← per-lane workspaces (gitignored)
    ├── dojo-solo/               ← open this as Model A’s project
    │   ├── ehAyeCoreCLI/        ← H1 (no .git)
    │   ├── authsample/          ← D1/D2 force copy (isolated)
    │   ├── sales/               ← D3 force copy (isolated)
    │   └── todo-spec/           ← G1 force copy (isolated)
    └── dojo-duo/                ← same layout for Model B
```

`npm run bench:prep` builds both lane folders so agents stay inside one root and do not wander.

## Driver (read this while running)

**[DRIVER.md](./DRIVER.md)** — spoken/read-aloud checklist: what to say, which command, which folder. Drive first; score later.

## Quick start

```bash
# From this public repo root
npm run bench:list          # catalog of task files
npm run bench:prep          # Suite H: two .git-stripped ehAyeCoreCLI copies

# Optional: summarize a usage SQLite export (you pass the DB path)
npm run bench:usage -- --db /path/to/usage.db --out benchmarks/runs/run-a.json
```

## Suites at a glance

| Suite | Focus | Tasks | Fixture in this repo |
| ----- | ----- | ----- | -------------------- |
| **A** | Retrieval & formatting | A1 weather table, A2 top-3 news | Pin live answers in `snapshot.json` |
| **B** | Concurrency | B1 multi-city weather | Pin live answers |
| **C** | Reasoning | C1 quadratic for a 10-year-old | None |
| **D** | Codebase comprehension | D1 state machine, D2 login flow, D3 chart | `fixtures/authsample`, `fixtures/sales` |
| **E** | Media orchestration | E1–E4 image → video → audio → stitch | None (score orchestration only) |
| **F** | Transcription & contention | F1 transcribe, F2 same-file contention | Large media mounted under `temp/` (not in git) |
| **G** | Build from scratch | G1 todo website | `fixtures/todo-spec` |
| **H** | Real bug hunt | H1 two deliberate bugs | Public `ehAyeCoreCLI` `@benchmark` via `bench:prep` |

Each task lives in its own file under `tasks/` so comparisons stay clear: **this vs that**, one artifact per task.

## Ground rules (short)

1. **Freeze conditions** — pin news/weather in a run `snapshot.json`.
2. **Same tools for everyone** — media pipeline is fixed; Suite E scores orchestration, never beauty.
3. **First-to-grab is not a score** — F2 is a contention observation, not a race.
4. **Rubric per task** — no global vibe score.
5. **Reproducible** — same prompt text, same tree, logged latency.
6. **One model per head-to-head run** — if your agent stack has multiple tiers, pin **every** tier to the same model for a fair “X vs Y” label. Mixed-model committee runs are reported separately as system tests.

## What is intentionally NOT here

| Kept out of this public repo | Why |
| ---------------------------- | --- |
| Sealed bug-hunt answer key | Would spoil Suite H |
| Private product source / config | Untainted runs + IP |
| Large multi‑GB media | Git size; operators mount under `temp/bench/media/` |
| Internal usage-DB path magic | Public extract requires explicit `--db` |

Operators keep sealed keys and private notes in their private tree only.

## Reporting

1. Copy `templates/score-sheet.md` per model.
2. Fill `templates/snapshot.example.json` → `benchmarks/runs/<run-id>/snapshot.json`.
3. Publish failures as well as wins. A benchmark that never shows a model losing is a fake.

## Related public fixtures

- Bug-hunt source tree: [neekware/ehAyeCoreCLI](https://github.com/neekware/ehAyeCoreCLI) branch **`benchmark`**
- Product visibility / issues: this repository’s root README

## Copyright / trademarks

Copyright © 2006-2026 Neekware Inc. All rights reserved.  
Benchmark tools and fixtures are for public comparison and reference. Reusing them for your own runs does not require you to open-source your work. This is not a license to the private product.  
ehAye™ and Dojo are trademarks of Neekware Inc.
