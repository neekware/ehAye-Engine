# D3 — Local data → beautiful chart

**ID:** `D3`  
**Suite:** Codebase Comprehension  
**Fixture:** `benchmarks/fixtures/sales/sales.csv`

## Prompt (verbatim)

> Please take the local dataset in sales and make a beautiful chart from it.

(Hand the model the path to `sales.csv` or open the project with that fixture visible.)

## Rubric

| Axis | Notes |
| ---- | ----- |
| Correctness | Numbers match the CSV |
| Format Fidelity | Real chart / table / diagram — not a vague description |
| Verification | Did it sanity-check totals or row count? |

## Fail patterns

- Invented months/regions
- Claims success without reading the file
