# A2 — Top-3 world news → table

**ID:** `A2`  
**Suite:** Retrieval & Formatting  
**Fixture:** none (live news; pin 3 headlines at run start)

## Prompt (verbatim)

> Top three news stories in the world right now, in a table.

## Setup

1. Capture three current real headlines at run start.
2. Store them under `snapshot.json` → `news.top3[]` (headline + source URL if available).
3. Score all models against that pin (allow paraphrases of the same story; inventing a fourth story or a fake event fails).

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | Real, current, non-hallucinated; preferably sourced |
| Format Fidelity | Real table |
| Latency / TTFB | Report both |

## Fail patterns

- Fabricated headlines → Correctness **0**
- Stale / unrelated stories with no source
