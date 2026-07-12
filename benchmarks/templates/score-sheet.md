# Score sheet — Model: _______________

**Run ID:**  
**Pinned at:**  
**Harness commit:**  
**All tiers same model?** yes / no  

Axes: Correctness (×2), TTFB, Latency, Instruction Adherence, Tool Choice, Chaining, Verification, Format Fidelity — each 0–5 unless noted. Use `—` when N/A.

| Suite | Task | ✅ Correct | ⏱️ TTFB | ⚡ Latency | 👂 Instruct | 🧭 Tools | 🔁 Chain | 🔍 Verify | 📐 Format | Notes |
| ----- | ---- | --------- | ------- | --------- | ----------- | -------- | -------- | --------- | --------- | ----- |
| A | A1 Waterloo table | | | | | | — | — | | |
| A | A2 Top-3 news | | | | | | — | — | | |
| B | B1 Concurrent weather | | | | | | | — | — | |
| C | C1 Quadratic for kids | | | | | — | — | — | | |
| D | D1 State machine | | | | | | — | — | | |
| D | D2 Login flow | | | | | | | — | | |
| D | D3 Local chart | | | | | | — | | | |
| E | E1 Image Canada 16:9 | | | | | | — | | — | orch only |
| E | E2 Video 7s from E1 | | | | | | | | — | orch only |
| E | E3 Audio lyrics | | | | | | — | — | — | orch only |
| E | E4 Stitch A/V | | | | | | | | — | orch only |
| F | F1 Transcribe | | | | | | — | | — | |
| F | F2 Contention | — | — | — | | | — | | — | not a race |
| G | G1 Todo website | | | | | | — | | | |
| H | H1 Bug hunt | +3/+5/+2 | time-to-correct | | | | — | | — | |

## Composite

`sum(Correctness × 2 + other scored axes × 1)` — publish the weights you used.

## Failures (required)

List every task that scored 0 on Correctness or Verification, with a one-line reason:

1. …
