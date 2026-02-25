# Pitfalls Research

**Domain:** NFL mock draft simulator (power-user, single-round v1)
**Researched:** 2026-01-24
**Confidence:** LOW

## Critical Pitfalls

### Pitfall 1: Stale or inconsistent draft class data

**What goes wrong:**
Consensus board and prospect profiles lag behind daily updates, so users see players removed, changed ranks, or mismatched attributes compared to public sources.

**Why it happens:**
Ingestion is manual or ad-hoc, source versions are not tracked, and updates are merged without validation.

**How to avoid:**
Build a scheduled ingestion pipeline with versioned snapshots, source timestamps, and validation checks (row counts, rank deltas, missing players).

**Warning signs:**
User reports "player missing" or "rank is off" within 24 hours of updates; diffs show large drops without a known update.

**Phase to address:**
Phase 1 - Data foundation and ingestion.

---

### Pitfall 2: Incorrect pick order or pick inventory

**What goes wrong:**
Round 1 order is wrong (forfeited picks, compensatory picks, or official adjustments not reflected), leading to invalid simulations.

**Why it happens:**
Pick data is hard-coded or sourced from outdated lists; updates are not reconciled with official pick trackers.

**How to avoid:**
Treat pick order as authoritative data with a dedicated source-of-truth, plus a reconciliation step against an official draft tracker before each daily publish.

**Warning signs:**
Pick numbers do not match official trackers, or the total picks in the round are not 32 when expected.

**Phase to address:**
Phase 1 - Data foundation and ingestion.

---

### Pitfall 3: Consensus board normalization errors

**What goes wrong:**
Merged boards skew toward a single source or distort ranks because sources are on different scales and missing prospects.

**Why it happens:**
Sources are averaged without normalizing ranks, handling missing players, or weighting by recency/coverage.

**How to avoid:**
Normalize ranks per source (percentile or z-score), track missingness, and apply transparent weighting with audit logs.

**Warning signs:**
Top prospects vanish from the top 10, or a single source dominates the top 50 after a data refresh.

**Phase to address:**
Phase 1 - Data modeling and normalization.

---

### Pitfall 4: CPU picks feel unrealistic or non-defensible

**What goes wrong:**
Auto-picks ignore team needs, scheme fits, or positional scarcity, making the sim feel random or "BPA-only" in obvious mismatch cases.

**Why it happens:**
Consensus board is treated as the only input, and team context is reduced to a static needs list with no weighting.

**How to avoid:**
Add a transparent CPU pick model that blends consensus rank with team-need weights, positional scarcity, and a controllable randomness factor.

**Warning signs:**
User feedback describing picks as "unrealistic" or repeated patterns where CPU always selects the same position.

**Phase to address:**
Phase 2 - Simulation logic and pick model.

---

### Pitfall 5: Data licensing and attribution gaps

**What goes wrong:**
Using proprietary scouting grades or scraped boards without permission creates takedown risk and loss of data sources.

**Why it happens:**
Teams assume public visibility equals free use and ship data without explicit licensing checks.

**How to avoid:**
Maintain a data-source ledger (license, allowed use, attribution requirements) and ensure outputs include required source attribution.

**Warning signs:**
Source access suddenly revoked, legal notices, or data provider rate limits with policy warnings.

**Phase to address:**
Phase 0 - Data/legal preflight and vendor selection.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut                            | Immediate Benefit   | Long-term Cost                                          | When Acceptable                     |
| ----------------------------------- | ------------------- | ------------------------------------------------------- | ----------------------------------- |
| Hard-coded pick order in code       | Faster MVP build    | Requires redeploy for updates; easy to ship wrong order | Never (data should be externalized) |
| Manual CSV updates for the board    | Quick data ingest   | Silent drift, missing players, and no audit trail       | Only for a short-lived prototype    |
| CPU pick logic embedded in UI layer | No backend API work | Hard to test, harder to reuse for simulations           | Only for a demo with no backend     |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration          | Common Mistake                                   | Correct Approach                            |
| -------------------- | ------------------------------------------------ | ------------------------------------------- |
| Draft board provider | Ignoring rate limits during daily refresh        | Cache snapshots and use incremental updates |
| Prospect data API    | Assuming stable schema without version pinning   | Map via versioned contracts and validation  |
| Team needs sources   | Mixing multiple sources without conflicts policy | Pick a primary source and record overrides  |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap                                        | Symptoms                         | Prevention                             | When It Breaks                      |
| ------------------------------------------- | -------------------------------- | -------------------------------------- | ----------------------------------- |
| Rendering full board without virtualization | Slow scroll, large memory spikes | Virtualized lists and memoized filters | 200+ prospects on mid-range devices |
| Recalculating pick model on every UI change | Input lag, jank                  | Cache model inputs and debounce        | 50+ rapid filter interactions       |
| Per-pick network calls in sim               | Long sim times, spinner fatigue  | Precompute all CPU picks in a batch    | 10+ picks in a single run           |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake                                   | Risk                               | Prevention                             |
| ----------------------------------------- | ---------------------------------- | -------------------------------------- |
| Shipping data provider keys to the client | Key theft and API abuse            | Proxy through server with scoped keys  |
| Public write access to board updates      | Data tampering or defacement       | Authenticated ingestion endpoints only |
| No integrity checks on daily updates      | Corrupted board silently published | Hash-based validation and rollback     |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall                           | User Impact               | Better Approach                             |
| --------------------------------- | ------------------------- | ------------------------------------------- |
| No source/version metadata        | Users distrust the board  | Show data source and last updated timestamp |
| Cannot compare CPU picks vs board | Hard to evaluate realism  | Provide inline rationale or comparison view |
| Filters reset on every sim run    | Power users lose workflow | Persist filters and provide saved presets   |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Draft run:** Often missing data snapshot versioning — verify the board is frozen at sim start.
- [ ] **CPU picks:** Often missing reproducibility — verify seed and model parameters are logged.
- [ ] **Prospect profiles:** Often missing missingness flags — verify source coverage per player.
- [ ] **Export/share:** Often missing context — verify pick order, board version, and settings are included.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall                 | Recovery Cost | Recovery Steps                                                            |
| ----------------------- | ------------- | ------------------------------------------------------------------------- |
| Stale board data        | MEDIUM        | Roll back to last known good snapshot and rerun ingestion with validation |
| Wrong pick order        | HIGH          | Hotfix pick list, re-run sim outputs, and notify users of corrections     |
| CPU pick realism issues | MEDIUM        | Provide a fallback "pure BPA" mode and adjust weights after review        |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall                                | Prevention Phase | Verification                                                |
| -------------------------------------- | ---------------- | ----------------------------------------------------------- |
| Stale or inconsistent draft class data | Phase 1          | Daily ingest logs with validation and snapshot diff report  |
| Incorrect pick order or pick inventory | Phase 1          | Reconcile pick list against official tracker before publish |
| Consensus board normalization errors   | Phase 1          | Source-weight audit report with top 50 spot-check           |
| CPU picks feel unrealistic             | Phase 2          | Compare CPU output vs team needs and board rationale        |
| Data licensing and attribution gaps    | Phase 0          | License checklist signed off before production data use     |

## Sources

- https://www.nfl.com/draft/ (official draft hub, LOW confidence for rules details)
- https://www.nfl.com/draft/tracker/picks/ (official pick tracker, LOW confidence for rules details)
- Team-need coverage on NFL Draft IQ (referenced from NFL draft hub links, LOW confidence)

---

_Pitfalls research for: NFL mock draft simulator_
_Researched: 2026-01-24_
