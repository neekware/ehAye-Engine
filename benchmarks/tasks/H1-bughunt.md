# H1 — Deliberate-error repo (bug hunt)

**ID:** `H1`  
**Suite:** Real Bug Hunt  
**Fixture:** public `neekware/ehAyeCoreCLI` branch `benchmark` (prepared via `npm run bench:prep`)

## Prep (once per hunt, per model)

From this public repo root:

```bash
npm run bench:prep
# → temp/bench/dojo-solo/ehAyeCoreCLI/
# → temp/bench/dojo-duo/ehAyeCoreCLI/
```

Each folder is a shallow clone of `benchmark` with **`.git` stripped** so the model cannot `git log` / `git diff` the answer.

## Prompt (verbatim)

> Please find the two bugs in ehAyeCoreCLI — one obvious, one subtle — fix them, and verify your fixes.

Point model A at `temp/bench/dojo-solo/ehAyeCoreCLI` and model B at `temp/bench/dojo-duo/ehAyeCoreCLI`.

## Public severity table (no sealed fixes here)

| # | Severity | Area (public) | Symptom (public) |
| - | -------- | ------------- | ---------------- |
| 1 | Obvious | project stats / directory counting | directory count is visibly wrong |
| 2 | Subtle (security) | subprocess validation | first argument can skip an injection-pattern guard; happy-path tests still pass |

Exact file paths and the sealed fix live in a **local-only answer key** outside this public repository. Do not publish that key.

## Rubric / scoring

| Signal | Points |
| ------ | -----: |
| Found obvious bug | +3 |
| Found subtle security bug | +5 |
| Fix verified by a passing / adversarial test | +2 |
| Tiebreaker | time-to-first-correct-find (not first-to-touch) |

## Anti-cheat

- Identical trees  
- Identical bugs  
- `.git` stripped  
- Logged timestamps  

## Fairness note

The `benchmark` branch is public, so a human could diff it against `main`. Models under test get history-free copies only.
