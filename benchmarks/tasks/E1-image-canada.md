# E1 — Image: 16:9 “best represents” (country by lane)

**ID:** `E1`  
**Suite:** Media Orchestration  
**Fixture:** none (generation pipeline is fixed for all models)

## Prompt (say once — both lanes)

> Hey Dojo Solo — please generate a 16:9 image that best represents Canada. Dojo Duo — please do the same for the United States.

## Scoring rule (critical)

Score **orchestration only** — not how pretty the image is.  
The media pipeline is identical across models.

## Rubric

| Axis | Notes |
| ---- | ----- |
| Tool Choice | Image generation tool; aspect ratio honored (16:9) |
| Instruction Adherence | Prompt distilled sensibly; correct country for the lane |
| Verification | Checked that an artifact path / size came back |

## Fail patterns

- Wrong aspect ratio without correction
- Claiming success with no generated file
- Wrong country for the assigned lane
