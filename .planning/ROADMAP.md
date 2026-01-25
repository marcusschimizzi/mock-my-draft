# Roadmap: Mock My Draft Simulator

## Overview

This roadmap delivers a realistic single-round mock draft simulator from trusted, refreshable data through a complete draft flow and exportable results. Phases move from data credibility to user setup, board navigation, live draft execution, and finally result sharing so each phase unlocks the next user-visible capability.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Data Updates** - Draft data stays fresh and manually refreshable.
- [ ] **Phase 2: Draft Setup** - Users configure teams and CPU randomness before starting.
- [ ] **Phase 3: Player Board** - Users explore and inspect the draft class.
- [ ] **Phase 4: Draft Flow** - Users run the pick-by-pick simulation with live context.
- [ ] **Phase 5: Results & Sharing** - Users review and export the completed draft.

## Phase Details

### Phase 1: Data Updates

**Goal**: Users see up-to-date player data and rankings for every draft.
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):

1. Users see player data that reflects the latest daily refresh.
2. Admin can run a manual import and the updated data appears in the app.
   **Plans**: TBD

Plans:

- [ ] 01-01: TBD

### Phase 2: Draft Setup

**Goal**: Users can configure the draft before it begins.
**Depends on**: Phase 1
**Requirements**: SETUP-01, SETUP-02
**Success Criteria** (what must be TRUE):

1. User can choose one or more teams to control before starting the draft.
2. User can adjust CPU pick randomness with a slider before starting the draft.
   **Plans**: TBD

Plans:

- [ ] 02-01: TBD

### Phase 3: Player Board

**Goal**: Users can explore the draft class and inspect prospects.
**Depends on**: Phase 2
**Requirements**: BOARD-01, BOARD-02, BOARD-03
**Success Criteria** (what must be TRUE):

1. User can browse the draft class with consensus rank, position, and school.
2. User can search, filter by position, and sort the board by consensus rank.
3. User can open a quick view with player details from the board.
   **Plans**: TBD

Plans:

- [ ] 03-01: TBD

### Phase 4: Draft Flow

**Goal**: Users can run the draft in the official order with live feedback.
**Depends on**: Phase 3
**Requirements**: FLOW-01, FLOW-02, FLOW-03, FLOW-04
**Success Criteria** (what must be TRUE):

1. Draft advances pick-by-pick in the official order for the upcoming draft.
2. Non-user teams are auto-picked using the consensus board.
3. Draft pauses on user-controlled picks until a selection is made.
4. User can view a live draft log plus remaining picks for their teams.
   **Plans**: TBD

Plans:

- [ ] 04-01: TBD

### Phase 5: Results & Sharing

**Goal**: Users can review and share the completed draft results.
**Depends on**: Phase 4
**Requirements**: RESULT-01, RESULT-02, RESULT-03
**Success Criteria** (what must be TRUE):

1. User can view a final draft summary with picks by team and overall.
2. User can export draft results as CSV.
3. User can generate a shareable draft summary image.
   **Plans**: TBD

Plans:

- [ ] 05-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase                | Plans Complete | Status      | Completed |
| -------------------- | -------------- | ----------- | --------- |
| 1. Data Updates      | 0/TBD          | Not started | -         |
| 2. Draft Setup       | 0/TBD          | Not started | -         |
| 3. Player Board      | 0/TBD          | Not started | -         |
| 4. Draft Flow        | 0/TBD          | Not started | -         |
| 5. Results & Sharing | 0/TBD          | Not started | -         |
