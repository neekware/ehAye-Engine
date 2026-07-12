# F1 — Transcribe a given video

**ID:** `F1`  
**Suite:** Transcription & Contention  
**Fixture:** operator-supplied fixed media file + optional reference transcript  
  (large media is **not** committed to this repo — mount or path it in at run time)

## Prompt (verbatim)

> Transcribe this.

(Hand the model the absolute path to the fixed video.)

## Setup

1. Use the **same** video file for every model.
2. Optionally keep a local reference transcript for WER scoring (not published here if it contains third-party content you cannot redistribute).
3. Pin path + duration + language expectation in `snapshot.json`.

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | WER vs reference when available; otherwise manual spot-check |
| Verification | Flags accuracy caveats when appropriate |
| Latency / TTFB | Report both |

## Note on large fixtures

A multi‑GB sample is intentionally **not** vendored in git. Operators place it under `temp/bench/media/` (gitignored) and reference it from the run snapshot.
