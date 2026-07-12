# E2 — Video: 7s from E1 image

**ID:** `E2`  
**Suite:** Media Orchestration  
**Depends on:** E1 output artifact

## Prompt (suggested)

> Please make a 7-second video from that image.

## Rubric

| Axis | Notes |
| ---- | ----- |
| Chaining | Used E1’s output as input — not a fresh unrelated gen |
| Tool Choice | Image-to-video (or equivalent) with duration ≈ 7s |
| Verification | Confirmed duration / file exists |

## Fail patterns

- Ignoring the prior image and generating text-to-video from scratch when chaining was required
