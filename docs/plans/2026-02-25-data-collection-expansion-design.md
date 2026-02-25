# Data Collection Expansion: Historical Draft Grades (2010-2019) & Modern Era Completion (2020-2025)

## Problem Statement

The Mock My Draft application currently has draft grade data for 2020-2025 with varying source coverage (1-9 sources per year). To provide comprehensive historical context and increase confidence in modern-era grades, we need to:

1. **Fill gaps** in existing sources for 2020-2025
2. **Add new sources** for 2020-2025 (target: 10+ sources per year)
3. **Collect historical data** back to 2010 (pragmatic coverage - take what we can find)

## Goals

- **Completeness**: Maximize source coverage for each year (especially 2020-2025)
- **Consistency**: Prioritize sources with multi-year archives when available
- **Quality**: Maintain visibility into data completeness and extraction quality
- **Pragmatism**: Accept partial coverage for historical years where full data is unavailable

## Non-Goals

- Automated URL discovery/crawling (manual research is bounded and manageable)
- Grades for years before 2010 (diminishing returns on data availability)
- Real-time scraping or scheduled updates (one-time historical collection)

## Approach: Gap-Filling First, Then Historical

**Strategy:** Complete the modern era (2020-2025) first to maximize value for current users, then systematically expand backwards to 2010.

**Rationale:**
- Modern data is most valuable to users and easier to find
- Builds confidence with recent sources before tackling harder historical research
- Creates early stopping point if older data becomes too sparse
- Working backwards chronologically leverages better SEO/archives for recent content

## Architecture

**No code changes required** - the existing scraper infrastructure handles everything:
- `apps/data-collector/collect-grades.js` - Orchestrator
- `apps/data-collector/extract-grades.js` - Claude Haiku extraction
- `apps/data-collector/html-cleaner.js` - Content preprocessing
- `apps/data-collector/grades-utils.js` - Normalization utilities
- `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts` - Database seeding
- `apps/draft-api/src/commands/seed-steps/seed-player-grades.ts` - Player-level grades

**Expansion is purely additive** through:
- Adding URLs to `apps/data-collector/data/grade_sources.json`
- Running collection script: `node collect-grades.js {year}`
- Running seed commands: `npx nx run draft-api:seed -- --step grades --year {year}`

## Workflow Per Batch

Each batch follows this standardized process:

### 1. Research Phase
- Investigate publication archives for target years
- Verify URLs are accessible (not 404, not behind hard paywall)
- Note expected completeness based on article preview
- Compile URL list with metadata

### 2. Review Phase
Present URL list with:
- Source name
- Year
- Article URL
- Article title/date (if available)
- Expected completeness (full 32 teams, partial, top-10 only, etc.)
- Any concerns (paywall, moved URL, unusual format)

### 3. Approval
- User reviews list
- Approves/modifies/rejects entries
- Confirms batch is ready for collection

### 4. Collection Phase
- Update `grade_sources.json` with approved URLs
- Run `collect-grades.js` for each target year
- Monitor console output for warnings
- Review debug files for any failed extractions

### 5. Validation Phase
- Generate validation report (coverage matrix, quality metrics, issues)
- Review grade distributions for anomalies
- Spot-check text samples for extraction quality
- Flag any critical issues for manual review

### 6. Seeding Phase
- Run seed steps to populate database
- Verify idempotency (re-running skips duplicates)
- Check database for expected record counts

### 7. Verification Phase
- Spot-check API responses (`/draft-summary/{year}`)
- Verify frontend displays new sources correctly
- Confirm grade calculations include new data

### 8. Commit
- Commit updated config file
- Commit JSON data files
- Commit validation report
- Document any issues/decisions in commit message

## Batch Breakdown

### Batch 1: Complete Modern Era (2020-2025)

**Gap Filling:**
- Fox Sports: 2020-2024 (currently only has 2025)
- NFL.com: 2020-2023, 2025 (currently only has 2024)
- SDUT: 2020-2024 (currently only has 2025)
- SBNation: 2020-2024 (currently only has 2025)

**New Sources (3-4 publications):**
- The Athletic (premium sports journalism, quality analysis)
- USA Today (broad coverage, accessible)
- NFL Network analysts (Bucky Brooks, Daniel Jeremiah articles)
- Sports Illustrated (if archives accessible)

**Expected Output:** 10-15 new articles, bringing total to ~50-60 grades per year for 2020-2025

**Time Estimate:** 1-2 days research, 2-3 hours collection

---

### Batch 2: Recent Historical (2017-2019)

**Target:** 4-6 sources per year (mix of existing sources' archives + new sources)

**Priority Sources:**
- ESPN (Mel Kiper archives likely intact)
- CBS Sports (Pete Prisco has long history)
- Bleacher Report (established by 2017)
- Yahoo Sports (likely has archives)
- PFF (founded 2007, may have 2017+ coverage)

**Expected Output:** 12-18 articles across 3 years (4-6 per year)

**Time Estimate:** 2-3 days research, 2-3 hours collection

---

### Batch 3: Mid-Range Historical (2014-2016)

**Target:** 3-5 sources per year (archives may be spottier)

**Priority Sources:**
- ESPN (Mel Kiper - most reliable for this era)
- CBS Sports (Pete Prisco)
- Bleacher Report (founded 2008, may have coverage)
- NFL.com (official source, archives likely preserved)

**Expected Output:** 9-15 articles across 3 years (3-5 per year)

**Time Estimate:** 2-3 days research, 2-3 hours collection

**Note:** This is where we'll start learning about archive availability. If sources are sparse, adjust Batch 4/5 expectations.

---

### Batch 4: Early Historical (2011-2013)

**Target:** 2-4 sources per year (realistic for older content)

**Priority Sources:**
- ESPN (Mel Kiper - most consistent)
- CBS Sports (if archives preserved)
- NFL.com (official archives)

**Expected Output:** 6-12 articles across 3 years (2-4 per year)

**Time Estimate:** 2-3 days research, 1-2 hours collection

**Adjustment strategy:** If Batch 3 revealed sparse archives, lower expectations to 2-3 sources per year.

---

### Batch 5: Oldest + Mop-up (2010 + any gaps)

**Target:** Whatever we can find for 2010, plus fill any gaps discovered in previous batches

**Priority:**
- ESPN (Mel Kiper 2010 grades if they exist)
- Any missed opportunities from previous batches
- Fill gaps where only 1-2 sources were found

**Expected Output:** 2-5 articles for 2010, plus 3-5 gap fills

**Time Estimate:** 1-2 days research, 1 hour collection

**Pragmatism:** This is the "sweep up" batch. If 2010 data is very sparse (<2 sources), document and move on.

## Data Quality Validation

### Automated Checks During Collection

**Team count validation:**
- Flag articles with <20 teams (log warning, still collect)
- Log team count to console during extraction
- Save raw extraction to debug file for review

**Grade validity:**
- Skip entries with unrecognized grades (e.g., "Incomplete", "N/A")
- Log skipped grades to console
- Valid grades: A+ through F (13 total grades)

**Team name normalization:**
- Use existing `OLD_TEAM_NAMES` map for historical names
- Map: "Washington Redskins" → "Washington Commanders"
- Map: "Oakland Raiders" → "Las Vegas Raiders"
- Map: "San Diego Chargers" → "Los Angeles Chargers"
- Map: "St. Louis Rams" → "Los Angeles Rams"
- Log any unmatched team names for manual review

**Duplicate detection:**
- Handled by seed step (uniqueness: year + team + source)
- Logs "skipped" for duplicates (not an error)

### Post-Collection Validation Report

Generated after each batch completes:

**1. Coverage Matrix**
```
Year | ESPN | CBS | BR | Yahoo | PFF | Athletic | Total
2020 | ✓    | ✓   | ✓  | ✓     | ✓   | ✓        | 6
2021 | ✓    | ✓   | ✓  | ✓     | ✓   | ✓        | 6
...
```

**2. Grade Distribution (per year)**
```
2020 Grade Distribution:
A+/A/A-: 28% | B+/B/B-: 45% | C+/C/C-: 22% | D/F: 5%
✓ Distribution looks normal (matches expected bell curve)
```

**3. Completeness Score**
```
Source               | Teams Extracted | Completeness
ESPN 2020           | 32/32           | 100% ✓
Yahoo Sports 2023   | 18/32           | 56% ⚠️
CBS Sports 2019     | 28/32           | 88% ✓
```

**4. Text Quality Sample**
Random sample of 5 grade texts to verify extraction quality:
- Check for actual analysis (not navigation/ads/headers)
- Verify text length >50 characters
- Spot-check one entry against source URL manually

**5. Missing Data Summary**
- List any years/sources where extraction failed
- Document why (404, paywall, extraction error, etc.)
- Note for potential retry or manual collection

### Quality Thresholds

**Critical Issues (requires manual review):**
- <15 teams extracted
- All grades identical (e.g., all A's)
- Empty text fields for >50% of entries
- Extraction completely failed

**Warnings (log but proceed):**
- 15-20 teams extracted
- Grade distribution highly skewed (>60% in one letter grade)
- Very short text (<50 chars average)

**Info (just track):**
- 20-32 teams extracted
- Reasonable grade variety
- Meaningful text content

### Handling Bad Data

**Process:**
1. Keep extraction in `data/debug/{year}_{source}_raw.json`
2. Log issue to validation report with severity
3. Still seed to database (data is available for inspection)
4. User reviews validation report
5. User decides whether to:
   - Keep data (acceptable quality)
   - Re-run with manual fixes to config
   - Remove from database (too low quality)

**Philosophy:** Collect everything, filter during review. Better to have imperfect data visible than to silently skip it.

## Error Handling & Recovery

### Network/Fetch Errors

**Existing retry logic** (already in `collect-grades.js`):
- 3 attempts with exponential backoff
- Handles 429 (rate limit), 5xx (server errors)
- 1-second delay between requests (polite scraping)

**New error scenarios:**
- **404/403 on article URL**: Log as "unavailable", skip, document in research notes
- **All retries exhausted**: Save error to debug log, continue with other sources
- **Network timeout**: Treat as retry-able error, use same backoff logic

**Philosophy:** One bad URL doesn't block the entire batch.

### Extraction Failures

**Haiku extraction issues:**
- **<5 teams returned**: Retry once with simplified prompt
- **Second attempt also fails**: Save raw HTML to debug, flag for manual review
- **Tool response parse error**: Log full response, save to debug, skip article

**Simplified retry prompt:**
```
"Focus only on extracting team names and their letter grades.
Ignore analysis text for now. Return as many teams as you can find."
```

**Philosophy:** Try to salvage partial data, but don't infinite loop.

### Seeding Errors

**Team name mismatch:**
- Log unmatched team name to console
- Skip that entry
- Continue with remaining entries
- Document in validation report

**Duplicate detection:**
- Already handled by seed step
- Logs "skipped (exists)" - not an error
- Expected behavior when re-running seed

**Database constraint violations:**
- Log error with full context (team, year, source)
- Continue with remaining entries
- Flag in validation report for investigation

**Philosophy:** Partial success is still success. Seed what we can, document what failed.

### Recovery from Partial Failures

**Resumable process:**
- All intermediate outputs saved (JSON files, debug files, logs)
- Can re-run collection for specific year without affecting others
- Can re-run seed steps (idempotent - duplicates skipped)
- Validation report identifies what succeeded/failed

**Re-run command for specific source/year:**
```bash
# Re-collect just 2019 ESPN grades
node collect-grades.js 2019
# (only processes sources that have 2019 in grade_sources.json)

# Re-seed just 2019 grades
npx nx run draft-api:seed -- --step grades --year 2019
# (idempotent - skips existing)
```

**Checkpoint strategy:**
- After each year completes: commit JSON file
- After batch validation: commit all data + config + report
- If interrupted: resume from last committed year

### Historical Article Challenges

**Moved/deleted URLs:**
- Research phase verifies URLs before adding to config
- If found during collection: log as unavailable, skip
- Document in research notes for future reference

**Changed HTML structure:**
- Advantage of LLM approach: Haiku is resilient to layout changes
- If extraction fails: HTML cleaner may need adjustment
- Fallback: save raw HTML for manual inspection

**Paywalls:**
- Note during research phase (soft vs hard paywall)
- Soft paywall (article visible in HTML): Haiku can extract
- Hard paywall (login required): skip, note in research
- ESPN Insider: may require subscription to access archives

**Incomplete archives:**
- Accept partial data (e.g., only 20 teams)
- Document in validation report
- Better to have partial coverage than none

### Rollback Capability

**Git history:**
- Every batch is a commit
- Can revert config/data files to previous batch
- Validation reports preserved in history

**Database rollback:**
- Seed is idempotent (re-running safe)
- Can delete records by source: `DELETE FROM draft_class_grade WHERE source_article_id IN (...)`
- Debug files provide audit trail for what was seeded

**Philosophy:** Non-destructive changes. Can always go back.

## Data Flow Diagram

```
[Research Phase]
    ↓
[grade_sources.json] ← (manual URL additions)
    ↓
[collect-grades.js {year}]
    ↓
[fetch HTML] → [clean HTML] → [Haiku extraction] → [normalize grades/teams]
    ↓                           ↓
[{year}_draft_class_grades.json]  [debug/{year}_{source}_raw.json]
    ↓
[Validation Report Generation]
    ↓
[seed-draft-class-grades.ts]
    ↓
[Database: DraftClassGrade, Source, SourceArticle]
    ↓
[seed-player-grades.ts]
    ↓
[Database: PlayerGrade]
    ↓
[API: /draft-summary/{year}]
    ↓
[Frontend: Team pages, visualizations]
```

## Success Metrics

### Per Batch
- **Research complete**: URL list compiled and approved
- **Collection complete**: All target years have JSON output files
- **Validation clean**: No critical issues, warnings documented
- **Seeding complete**: Database record counts match expectations
- **Verification passed**: API returns new sources, frontend displays correctly

### Overall (all batches complete)
- **Modern era**: 2020-2025 each have 10+ sources
- **Historical coverage**: 2010-2019 have 2+ sources per year (target 3-5 for recent years)
- **Data quality**: <5% of entries flagged for quality issues
- **Completeness**: 80%+ of articles extract 28+ teams (87.5% coverage)

## Timeline Estimate

| Batch | Research | Collection | Review | Total |
|-------|----------|------------|--------|-------|
| 1     | 1-2 days | 3 hours    | 1 hour | 2-3 days |
| 2     | 2-3 days | 3 hours    | 1 hour | 3-4 days |
| 3     | 2-3 days | 3 hours    | 1 hour | 3-4 days |
| 4     | 2-3 days | 2 hours    | 1 hour | 3-4 days |
| 5     | 1-2 days | 1 hour     | 1 hour | 2-3 days |

**Total: 13-18 days** (assumes sequential batches with review between)

**Parallelization opportunity:** Research for Batch N+1 can overlap with collection/validation of Batch N, potentially reducing total time to 10-14 days.

## Dependencies

**Existing:**
- Claude Haiku API access (`ANTHROPIC_API_KEY`)
- Playwright (for browser-based fetching of JavaScript-heavy sites)
- Database (PostgreSQL) running and accessible
- Existing draft picks/players seeded (for player grade matching)

**None new** - all infrastructure exists and has been validated.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Historical URLs deleted/moved | Medium | Medium | Research phase verifies URLs before collection |
| Old articles behind paywalls | Medium | Low | Skip paywalled content, focus on accessible sources |
| Incomplete team coverage in old articles | High | Low | Accept partial data, document in validation report |
| HTML structure changes break extraction | Low | Medium | Haiku-based extraction is resilient; fallback to manual inspection |
| Batch takes longer than estimated | Medium | Low | Stop after any batch - dataset is still usable |
| Poor grade variety (all A's) indicates bad extraction | Low | Medium | Validation report flags anomalies for review |

**Overall risk level: Low** - incremental batches allow for course correction, no code changes reduces technical risk.

## Future Enhancements (Out of Scope)

These are explicitly NOT part of this project but could be considered later:

- **Automated URL discovery** via search API or site crawling
- **Scheduled updates** for new draft years (annual collection)
- **Additional data points** (mock drafts, player rankings, combine results)
- **Multi-year trend analysis** features in frontend
- **Historical context** (notes about draft class reputation over time)

## Conclusion

This design provides a systematic, low-risk approach to expanding the draft grades dataset from 2020-2025 coverage to full 2010-2025 coverage with multiple sources per year. The incremental batch structure allows for early stopping if historical data becomes too sparse, while the validation framework ensures data quality is maintained throughout.

The pragmatic approach (assisted manual URL research, accepting partial coverage, flagging but not blocking on quality issues) balances thoroughness with practicality given the bounded scope of draft grades articles.
