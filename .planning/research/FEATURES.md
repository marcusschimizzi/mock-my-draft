# Feature Research

**Domain:** NFL mock draft simulator (web-embedded, single-round)
**Researched:** 2026-01-24
**Confidence:** LOW

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature                         | Why Expected                                              | Complexity | Notes                                                                 |
| ------------------------------- | --------------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| Draft order + pick-by-pick flow | Core simulation must mirror the real draft cadence        | MEDIUM     | Single round for v1; includes team picker turn order and pick numbers |
| Current draft class player pool | Users expect real prospects with positions and schools    | MEDIUM     | Needs data ingest + basic metadata (position, school, ranking)        |
| Search, filter, and sort board  | Users need to find players fast                           | MEDIUM     | Filters by position, school, ranking; sorting by consensus rank       |
| Team needs context              | Users expect CPU picks and guidance aligned to team needs | MEDIUM     | Lightweight roster/needs tags; not full roster management             |
| Manual pick selection UI        | Users expect to choose picks quickly                      | MEDIUM     | Includes player card, detail quick view, and confirmation             |
| CPU autopick (consensus board)  | Baseline realism when user skips picks                    | MEDIUM     | Uses consensus rank with light team-need weighting                    |
| Pick history + remaining picks  | Users track what happened and who is left                 | LOW        | Draft log and remaining board highlighting                            |
| Undo/redo last pick             | Users fix misclicks                                       | LOW        | Local-only state management                                           |
| Export CSV results              | Expected for sharing and analysis in this audience        | LOW        | Export full pick list and player metadata                             |
| Mobile-friendly layout          | Casual fans expect usable mobile view                     | MEDIUM     | Responsive board + draft log layout                                   |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature                               | Value Proposition                      | Complexity | Notes                                       |
| ------------------------------------- | -------------------------------------- | ---------- | ------------------------------------------- |
| Transparent CPU logic (explain pick)  | Builds trust in simulation realism     | MEDIUM     | Show top 3 weighted options and rationale   |
| Scenario controls (variance sliders)  | Power users can stress-test outcomes   | MEDIUM     | Controls for reach/risk and positional bias |
| Instant restart + seedable randomness | Fast iteration for mockers             | LOW        | Deterministic seeds for repeatable runs     |
| Shareable pick summary image          | Easy social sharing without accounts   | MEDIUM     | Render draft log into image or static card  |
| Prospect quick-compare view           | Better decision-making for casual fans | MEDIUM     | Side-by-side stats and rankings             |
| Team-specific presets                 | Faster setup for common use cases      | LOW        | Preset filters and weighting by team        |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature                        | Why Requested              | Why Problematic                                     | Alternative                                     |
| ------------------------------ | -------------------------- | --------------------------------------------------- | ----------------------------------------------- |
| Full trade engine (v1)         | Feels like real draft day  | Complex rules, long UX, needs negotiation AI        | Defer to v2; add simple pick swap toggle later  |
| Player grading post-draft (v1) | Users want to see "grades" | Subjective, sparks argument, needs consistent model | Provide "fit notes" and let users export        |
| Mandatory accounts             | Saves drafts               | Friction for casual fans                            | Local storage + shareable export                |
| Multi-round by default         | More realistic             | Slower flow, more data, larger UI                   | Keep single-round; add multi-round option later |
| Real-time live draft sync      | Feels timely               | Requires live feeds + constant updates              | Manual update for draft class versioning        |

## Feature Dependencies

```
[Draft order + pick flow]
    └──requires──> [Draft class player pool]
                       └──requires──> [Consensus rankings data]

[CPU autopick]
    └──requires──> [Consensus rankings data]
    └──requires──> [Team needs context]

[Search/filter/sort board] ──requires──> [Draft class player pool]

[Export CSV results] ──requires──> [Pick history + remaining picks]

[Transparent CPU logic] ──enhances──> [CPU autopick]
[Scenario controls] ──enhances──> [CPU autopick]
```

### Dependency Notes

- **Draft order + pick flow requires draft class player pool:** Picks cannot be made without a defined prospect list.
- **CPU autopick requires consensus rankings + team needs context:** Baseline realism depends on rankings and light positional weighting.
- **Export CSV results requires pick history:** Export is built from the draft log data.
- **Transparent CPU logic enhances CPU autopick:** Explanation layer needs the weighted ranking data already used for autopicks.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Draft order + pick-by-pick flow — core simulation loop
- [ ] Draft class player pool with consensus ranking — baseline realism
- [ ] Manual pick selection + CPU autopick — user control with automation
- [ ] Search/filter/sort board + pick history — usable drafting UX
- [ ] Team needs context (lightweight) — makes CPU picks credible
- [ ] Export CSV results — explicit requirement for power users
- [ ] Responsive layout — casual fans on mobile

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Transparent CPU logic — increase trust once baseline is stable
- [ ] Scenario controls + seedable randomness — power-user iteration
- [ ] Shareable pick summary image — social growth loop

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Multi-round drafting — larger data and UI surface area
- [ ] Trade engine — complex rule system + negotiation AI
- [ ] Draft grading — subjective model + controversy

## Feature Prioritization Matrix

| Feature                                     | User Value | Implementation Cost | Priority |
| ------------------------------------------- | ---------- | ------------------- | -------- |
| Draft order + pick flow                     | HIGH       | MEDIUM              | P1       |
| Draft class player pool + consensus ranking | HIGH       | MEDIUM              | P1       |
| Manual pick selection + CPU autopick        | HIGH       | MEDIUM              | P1       |
| Search/filter/sort board                    | HIGH       | MEDIUM              | P1       |
| Pick history + export CSV                   | MEDIUM     | LOW                 | P1       |
| Team needs context                          | MEDIUM     | MEDIUM              | P1       |
| Transparent CPU logic                       | MEDIUM     | MEDIUM              | P2       |
| Scenario controls + seedable randomness     | MEDIUM     | MEDIUM              | P2       |
| Shareable pick summary image                | MEDIUM     | MEDIUM              | P2       |
| Prospect quick-compare view                 | MEDIUM     | MEDIUM              | P3       |

**Priority key:**

- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature                | Competitor A                         | Competitor B                         | Our Approach                      |
| ---------------------- | ------------------------------------ | ------------------------------------ | --------------------------------- |
| Consensus big board    | PFF Mock Draft Simulator (assumed)   | NFL Mock Draft Database (assumed)    | Use consensus board for CPU picks |
| Board filters + search | Common across simulators (assumed)   | Common across simulators (assumed)   | Keep fast filters and sorting     |
| Trade engine           | Present in some simulators (assumed) | Present in some simulators (assumed) | Defer; focus on single round      |
| Draft grading          | Common post-draft (assumed)          | Common post-draft (assumed)          | Exclude v1; provide export        |

## Sources

- General market knowledge of NFL mock draft simulators (LOW confidence; needs validation)
- Project context provided by orchestrator (v1 constraints)

---

_Feature research for: NFL mock draft simulator_
_Researched: 2026-01-24_
