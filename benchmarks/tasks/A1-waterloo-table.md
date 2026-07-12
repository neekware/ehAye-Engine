# A1 — Single fact + pretty table

**ID:** `A1`  
**Suite:** Retrieval & Formatting  
**Fixture:** none (live weather; pin snapshot at run start)

## Prompt (verbatim)

> Please get the temperature of Waterloo right now, and put it in a nice table with lots of emojis.

## Setup

1. At run start, capture the real Waterloo temperature (same source for all models).
2. Write it into the run’s `snapshot.json` as `weather.waterloo_c` (or °F if you pin imperial).
3. All models score against **that** snapshot, not a later re-fetch.

## Rubric

| Axis | Weight notes |
| ---- | ------------ |
| Correctness | Matches pinned snapshot ±1° |
| Format Fidelity | Real table + emojis |
| Latency / TTFB | Report both; bucket total latency |

## Pass

Correct temperature, well-formed emoji table.

## Fail patterns

- Hallucinated temperature far from snapshot
- Prose only, no table
