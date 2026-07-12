# D2 — Code → login / auth flow

**ID:** `D2`  
**Suite:** Codebase Comprehension  
**Fixture:** `benchmarks/fixtures/authsample/`

## Prompt (verbatim)

> Please show me the flow of login to authentication from that code.

## Setup

Same frozen auth sample as D1. Prefer a flowchart of the call graph (`enterCredentials` / `authenticate` / `verifyMFA` / session / logout paths).

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | Matches real call graph in `auth.ts` |
| Format Fidelity | Flowchart / sequence diagram |
| Chaining | Steps in the order the code actually runs |

## Fail patterns

- Invented middleware / OAuth providers not in the fixture
- Skipping lockout / MFA branches entirely when asked for the full flow
