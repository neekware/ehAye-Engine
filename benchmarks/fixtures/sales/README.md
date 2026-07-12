# Sales CSV fixture (Suite D3)

Fixed 12-row dataset for: _"Take this local dataset and make a beautiful chart."_

## File

- `sales.csv` — columns: `month`, `region`, `revenue`, `units`

## Expected use

1. Model reads the local CSV (no network).
2. Model produces a chart (table / mermaid / structured chart spec — whatever the harness supports).
3. Numbers in the chart must match the file (no invented rows).

## Sanity totals (public, not a sealed key)

Operators may sanity-check totals independently. Models should verify their own work.
