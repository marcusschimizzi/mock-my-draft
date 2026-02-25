# Mock My Draft Simulator

## What This Is

An embedded NFL mock draft simulator for Mock My Draft that lets draft enthusiasts run realistic mocks for the upcoming draft class. Users configure a draft, control one or more teams, and make their picks while the simulator runs the rest of the league.

## Core Value

Power users can run a realistic, configurable mock draft and walk away with a complete, exportable draft result they trust.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Users can configure and run a single mock draft for the upcoming NFL draft class.
- [ ] Users can control one or more teams, make selections, and view draft progress in real time.
- [ ] Users can review and export the final draft results as CSV.

### Out of Scope

- Trades (CPU or user) — defer until a trade value model is defined.
- Draft grading and suggested picks — defer until ranking and needs models exist.

## Context

- Embedded in the existing Mock My Draft web app (Next.js + Nx monorepo).
- Player data and rankings come from manual imports plus scraping.
- Rankings should update daily to reflect new data.

## Constraints

- **Platform**: Web embed in existing site — must follow current Next.js/Nx stack.
- **Data**: Use Draft API + Postgres — extend current services instead of new backend.
- **Scope**: v1 is single-round — deeper rounds deferred.
- **Accounts**: No user accounts — anonymous sessions only.

## Key Decisions

| Decision                                   | Rationale                                    | Outcome   |
| ------------------------------------------ | -------------------------------------------- | --------- |
| Embed simulator in existing web app        | Leverage current audience and infrastructure | — Pending |
| v1 supports one round, upcoming draft only | Keep v1 fast and data-light                  | — Pending |
| CPU picks use consensus board              | Simple, transparent baseline                 | — Pending |
| No trades or pick suggestions in v1        | Requires additional models and UX            | — Pending |
| Daily data refreshes                       | Keep rankings current during draft season    | — Pending |

---

_Last updated: Sat Jan 24 2026 after initialization_
