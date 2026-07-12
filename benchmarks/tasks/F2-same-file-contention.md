# F2 — Same-file contention (NOT a scored race)

**ID:** `F2`  
**Suite:** Transcription & Contention  
**Fixture:** same fixed video as F1

## Setup

Hand **two models** the **same** identical video path and ask both to transcribe it (overlapping starts).

## Why this is not a speed contest

Local transcription may serialize access to the same file (first process locks; second waits or is blocked). Whoever grabs first “wins” by luck, not intelligence.

## Score as systems observation only

| Signal | Score |
| ------ | ----- |
| Detected blocked / busy / resource-in-use | ✅ |
| Backed off / retried / queued gracefully | ✅ |
| Reported contention honestly | ✅ |
| Grabbed the lock first | ❌ **no points** |

## Do not

- Publish F2 as “Model X is faster because it locked first.”
