# D1 — Code → state machine

**ID:** `D1`  
**Suite:** Codebase Comprehension  
**Fixture:** `benchmarks/fixtures/authsample/`

## Prompt (verbatim)

> Look at the code in the auth sample fixture, give me the state machine.

## Setup

Point the model **only** at `benchmarks/fixtures/authsample/` (or a copy of it).  
Do not provide sealed answer keys.

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | States/transitions match actual code — no invented states |
| Format Fidelity | Real diagram (e.g. mermaid state diagram) |
| Instruction Adherence | Covers the module, not a generic auth lecture |

## Pass bar

States present in code (at minimum the `AuthState` union) and transitions that match `auth.ts` control flow.
