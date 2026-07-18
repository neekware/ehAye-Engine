# LLM Model Benchmark Suite — Real-Task Spec (Public)

> **Philosophy:** Benchmark how people _actually_ use these models — real tasks, real tools, real failure modes. No cherry-picked prompts, no pre-baked winner. Every task has a **fixed rubric**, a **pinned expected answer** (where applicable), and **identical starting conditions**. A number you can't defend is theater.

This is the public-facing suite document. Task prompts and fixtures live under `tasks/` and `fixtures/`. Run everything from this repository so models do not see private product source.

## Ground rules

1. **Freeze the conditions.** Pin a run date/time. Live tasks (news, weather) capture a snapshot answer at run start; all models score against _that_ snapshot, not live re-fetches.
2. **Same tools for everyone.** Media/pipeline quality is identical across models — so media is scored on **orchestration**, never artifact beauty.
3. **First-to-grab is not a score.** Race/lock artifacts measure luck, not intelligence. Score **correctness + time-to-correct**; report contention separately.
4. **Rubric per task.** Each task earns points across fixed axes. No global vibe score.
5. **Reproducible.** Same prompt text, same seed where supported, same working tree, logged latency.
6. **Untainted workspace.** Open / point models at **this** public repo (or a copy of it). Do not open the private product monorepo during a scored run.

## Models under test (roster template)

Record models **exactly as named by the operator**. Confirm exact provider model IDs before a real run — do not invent specs.

| # | Model (as named) | Vendor | Role in suite | Confirm before run |
| - | ---------------- | ------ | ------------- | ------------------ |
| 1 | _(operator fills)_ | | Primary | verify exact model ID |
| 2 | | | Primary | |
| 3 | | | Primary | |
| 4 | | | Secondary | |
| 5 | | | Secondary | |

- **Primary comparison** is usually three frontier models; secondaries are context.
- **Media provider is fixed for everyone** for Suite E so scores measure orchestration only.
- **Fairness:** the same model must not be both task-runner and judge in any A/B step. Pin driver, media provider, and any judge model in each run’s `snapshot.json`.

### Fairness rule — one model per “X vs Y” run

If the agent system can route different tiers (conductor vs workers) to different models, a mixed stack is a **committee**, not a single model. For any run labeled “Model X,” pin **every** tier to model X. Multi-model concurrency runs are **systems tests** and must not be used to rank models against each other.

One-line test before publishing any “X vs Y” number: _were all tiers the same model on both sides?_ If not, relabel as a pipeline result.

## Measurement sources

### 1. Usage database export (preferred when available)

Many agent products record per-call metrics (tokens, tool calls, time-to-first-token, total latency). The public harness can summarize a SQLite DB that exposes a `usage_events` table:

```bash
npm run bench:usage -- --db /path/to/usage.db --out benchmarks/runs/run-x.json
```

**Protocol:** reset usage → run entire suite as Model X → export → reset → run as Model Y → export → diff.

Caveats to report honestly:

- Cost may be derived from tokens × price sheet (not stored per event).
- If subagent tiers collapse to one label in the DB, run one tier at a time when you need per-tier attribution.

### 2. Logging proxy extractors (optional cross-check)

If traffic is routed through a logging reverse proxy, operator-local extract scripts can parse those logs. Prefer a **symmetric** source for tool-call counts when extractors differ by vendor.

## Scoring axes (0–5 each unless noted)

| Axis | What it measures |
| ---- | ---------------- |
| Correctness | Right answer / working output |
| TTFB | Time to first token — “feels fast” |
| Latency (total) | Wall-clock to correct result (bucketed) |
| Instruction Adherence | Exact format/scope/constraints on **legitimate** tasks |
| Tool Choice | Right tool, right args |
| Chaining | Multi-step order + pass-forward |
| Verification | Checked output vs claimed success |
| Format Fidelity | Requested shape (table, chart, equation, diagram) |

Report **TTFB and total latency separately**. Do not average them together.

Instruction Adherence is **not** scored on actions the system is designed to refuse.

## Suites (pointers)

| Suite | Task files | Fixtures |
| ----- | ---------- | -------- |
| A Retrieval | `tasks/A1-*.md`, `tasks/A2-*.md` | live pin |
| B Concurrency | `tasks/B1-*.md` | live pin |
| C Reasoning | `tasks/C1-*.md` | — |
| D Codebase | `tasks/D1-*.md` … `D3-*.md` | `fixtures/authsample`, `fixtures/sales` |
| E Media | `tasks/E1-*.md` … `E4-*.md` | — (orchestration only) |
| F Transcription | `tasks/F1-*.md`, `tasks/F2-*.md` | operator media under `temp/` |
| G Build | `tasks/G1-*.md` | `fixtures/todo-spec` |
| H Bug hunt | `tasks/H1-*.md` | `npm run bench:prep` → CoreCLI `@benchmark` |

## Suite H — public setup only

```bash
BENCHMARK_REPO_URL=https://github.com/your-org/your-public-target.git npm run bench:prep
# temp/bench/dojo-solo/benchmark-target/
# temp/bench/dojo-duo/benchmark-target/
```

Prompt: _Please find the two bugs in benchmark-target — one obvious, one subtle — fix them, and verify your fixes._

Scoring: +3 obvious, +5 subtle, +2 verified fix; time-to-correct is the tiebreaker. Sealed fix details stay **out of this repo**.

## Reporting template

Use `templates/score-sheet.md`. Composite = Correctness ×2 + other axes ×1 (publish weights). Always publish failures.

## What this deliberately avoids

- Scoring media _quality_ (identical pipeline)
- “First to grab the lock wins”
- Live-answer drift
- Global vibe scores with no rubric
- Hidden failures
- Running scored tasks inside a private product monorepo that models can read
