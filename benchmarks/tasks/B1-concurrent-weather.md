# B1 — Concurrent multi-city weather

**ID:** `B1`  
**Suite:** Concurrency  
**Fixture:** none (pin three cities at run start)

## Prompt (verbatim)

> Please get the temperatures of these three cities concurrently: Waterloo, Tokyo, and Vancouver.

## Setup

Pin expected temperatures (or acceptable bands) for all three cities in `snapshot.json`.

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | All 3 match pin (±1°) |
| Chaining | Actually parallel — batched tool calls in one turn, not serial |
| Latency | Should approach single-call time, not ~3× |

## Key signal

Did it **batch** the three weather tool calls in one turn, or serialize them?  
Serial = Chaining penalty even if answers are right.

## Report

Parallel speedup ratio ≈ (serial estimate ÷ actual wall clock).
