# Requirements: Mock My Draft Simulator

**Defined:** 2026-01-24
**Core Value:** Power users can run a realistic, configurable mock draft and export results.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Draft Setup

- [ ] **SETUP-01**: User can choose one or more teams to control before starting a draft
- [ ] **SETUP-02**: User can adjust CPU pick randomness via a slider before starting a draft

### Player Board

- [ ] **BOARD-01**: User can browse the upcoming draft class with consensus rank, position, and school
- [ ] **BOARD-02**: User can search, filter by position, and sort the board by consensus rank
- [ ] **BOARD-03**: User can open a quick view with player details from the board

### Draft Flow

- [ ] **FLOW-01**: Draft advances pick-by-pick in the official order for the upcoming draft
- [ ] **FLOW-02**: Non-user teams are auto-picked using the consensus board
- [ ] **FLOW-03**: Draft pauses on user-controlled picks until a selection is made
- [ ] **FLOW-04**: User can view a live draft log plus remaining picks for their teams

### Results

- [ ] **RESULT-01**: User can view a final draft summary with picks by team and overall
- [ ] **RESULT-02**: User can export draft results as CSV
- [ ] **RESULT-03**: User can generate a shareable draft summary image

### Data Updates

- [ ] **DATA-01**: System runs a daily ingestion job to refresh player data and rankings
- [ ] **DATA-02**: Admin can run a manual import to update player data

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Draft Setup

- **SETUP-03**: User can choose the number of rounds in a draft
- **SETUP-04**: User can save or use team-based draft presets
- **SETUP-05**: User can set a deterministic random seed for repeatable simulations

### Player Board

- **BOARD-04**: User can see team needs context alongside available players

### Draft Flow

- **FLOW-05**: User can undo the most recent pick
- **FLOW-06**: User can see transparent CPU pick explanations
- **FLOW-07**: User can adjust CPU strategy controls beyond randomness

### Results

- **RESULT-04**: User can view draft grades based on value and team needs

### Trades

- **TRADE-01**: User can propose trades during the draft
- **TRADE-02**: CPU teams can propose trade offers to the user

### Data Updates

- **DATA-03**: User can view data source attribution in the UI and exports

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                       | Reason                                            |
| ----------------------------- | ------------------------------------------------- |
| Mandatory user accounts       | Adds friction; v1 is anonymous by design          |
| Real-time live draft sync     | Requires live feeds and licensing beyond v1 scope |
| Historical draft year archive | Focus is the upcoming draft class only            |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| DATA-01     | Phase 1 | Pending |
| DATA-02     | Phase 1 | Pending |
| SETUP-01    | Phase 2 | Pending |
| SETUP-02    | Phase 2 | Pending |
| BOARD-01    | Phase 3 | Pending |
| BOARD-02    | Phase 3 | Pending |
| BOARD-03    | Phase 3 | Pending |
| FLOW-01     | Phase 4 | Pending |
| FLOW-02     | Phase 4 | Pending |
| FLOW-03     | Phase 4 | Pending |
| FLOW-04     | Phase 4 | Pending |
| RESULT-01   | Phase 5 | Pending |
| RESULT-02   | Phase 5 | Pending |
| RESULT-03   | Phase 5 | Pending |

**Coverage:**

- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

---

_Requirements defined: 2026-01-24_
_Last updated: 2026-01-24 after roadmap creation_
