# Phase 1: Data Updates - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver daily refreshed player data and rankings plus a manual import path so users always see current draft data.

</domain>

<decisions>
## Implementation Decisions

### Ingestion cadence + visibility

- Run the daily update in the early morning ET window.
- Publish new data immediately after validation passes.
- If the daily job fails, keep the last good dataset.
- Show a user-facing “Last updated [DATE]” timestamp.

### Manual import workflow

- Manual imports are admin-only.
- Trigger via an admin UI button.
- Validate before publish; block publish on validation errors.
- Manual imports create a new data version on publish.

### Data versioning + snapshots

- Draft sessions are pinned to the data version at session start.
- Keep published versions for the last 7 days.
- Mid-day publishes do not affect active sessions.
- Users see “Last updated” date only, not internal version IDs.

### Validation + failure handling

- Validation is strict; any errors block publishing.
- On validation failure, abort publish and keep last good data.
- Notify admins when validation fails.
- Keep a basic import audit log (timestamp, status, counts).

### Claude's Discretion

- Notification channel choice (email vs Slack) and exact admin UI presentation.

</decisions>

<specifics>
## Specific Ideas

- “Last updated [DATE]” message is enough for users; no version IDs in UI.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 01-data-updates_
_Context gathered: 2026-01-24_
