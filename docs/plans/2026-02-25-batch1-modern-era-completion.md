# Batch 1: Complete Modern Era (2020-2025) — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand draft grade coverage for 2020-2025 to 10+ sources per year by filling gaps in existing sources and adding 3-4 new major publications.

**Architecture:** Use existing `collect-grades.js` scraper infrastructure. Research URLs manually, update `grade_sources.json` config, run collection for each year, validate output quality, seed database, verify API responses.

**Tech Stack:** Node.js, Claude Haiku (Anthropic SDK), Cheerio, Playwright, TypeORM, PostgreSQL

**Design doc:** `docs/plans/2026-02-25-data-collection-expansion-design.md`

---

## Task 1: Research and compile URL list for gap filling

**Files:**
- Create: `docs/research/batch1-gap-filling-urls.md`

**Step 1: Research Fox Sports archives (2020-2024)**

Search for Fox Sports NFL draft grades articles for years 2020-2024. Check:
- Site search: `site:foxsports.com "nfl draft grades" 2020`
- Archive.org if current site doesn't have old articles
- Look for "analyzing all 32 teams classes" pattern

Document findings in `docs/research/batch1-gap-filling-urls.md`:

```markdown
# Batch 1: Gap Filling URLs

## Fox Sports

### 2024
- URL: [if found]
- Status: Accessible / 404 / Paywall
- Preview: [brief description of article]

### 2023
- URL: [if found]
- Status: Accessible / 404 / Paywall
- Preview: [brief description]

[Continue for 2022, 2021, 2020]
```

**Step 2: Research NFL.com archives (2020-2023, 2025)**

Search for NFL.com draft grades for missing years:
- Pattern: "Quick Snap grades" or "Final grades"
- Check: `site:nfl.com "draft grades" 2023 "all 32 teams"`
- NFL.com likely has archives back to 2020

Document findings in same file under "## NFL.com" section.

**Step 3: Research SDUT archives (2020-2024)**

San Diego Union Tribune may have limited archives:
- Check: `site:sandiegouniontribune.com "nfl draft grades" 2024`
- Regional paper may focus on Chargers, but check for full-league coverage
- Note if only Chargers-focused (not useful for our needs)

Document findings under "## San Diego Union Tribune" section.

**Step 4: Research SBNation archives (2020-2024)**

SBNation has network of team blogs + main site:
- Check main site: `site:sbnation.com "nfl draft grades" "all 32 teams" 2024`
- Pattern: Similar to 2025 article structure
- Founded 2005, should have archives

Document findings under "## SBNation" section.

**Step 5: Review and tally gap-filling results**

Add summary section to document:

```markdown
## Summary

| Source    | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | Total Found |
|-----------|------|------|------|------|------|------|-------------|
| Fox Sports| URL  | URL  | 404  | URL  | URL  | ✓    | 4/5         |
| NFL.com   | URL  | 404  | URL  | URL  | 404  | URL  | 3/5         |
| SDUT      | N/A  | 404  | 404  | 404  | URL  | ✓    | 1/5         |
| SBNation  | URL  | URL  | URL  | URL  | URL  | ✓    | 5/5         |

**Total URLs found:** [count]
```

**Step 6: Commit research document**

```bash
mkdir -p docs/research
git add docs/research/batch1-gap-filling-urls.md
git commit -m "research: compile gap-filling URLs for Batch 1"
```

---

## Task 2: Research and compile URL list for new sources

**Files:**
- Modify: `docs/research/batch1-gap-filling-urls.md` (add new sources section)

**Step 1: Research The Athletic archives (2020-2025)**

The Athletic is premium but may have free preview access:
- Check: `site:theathletic.com "nfl draft grades" 2025`
- Pattern: Annual draft grades articles
- Note if behind hard paywall (will skip if so)
- Founded 2016, likely has full 2020-2025 coverage

Add to research document:

```markdown
## New Sources

### The Athletic

#### 2025
- URL: [if accessible]
- Status: Accessible / Hard Paywall / Soft Paywall
- Preview: [description]

[Continue for 2024, 2023, 2022, 2021, 2020]
```

**Step 2: Research USA Today archives (2020-2025)**

USA Today is free and accessible:
- Check: `site:usatoday.com "nfl draft grades" "all 32 teams" 2025`
- Pattern: Sports section typically covers all teams
- Should have consistent coverage

Add findings under "### USA Today" section.

**Step 3: Research NFL Network analyst content (2020-2025)**

Look for Bucky Brooks and Daniel Jeremiah articles:
- Check NFL.com: `site:nfl.com "bucky brooks" "draft grades" 2025`
- Check NFL.com: `site:nfl.com "daniel jeremiah" "draft grades" 2025`
- These may overlap with NFL.com already in config, check if different articles

Add findings under "### NFL Network Analysts" section with note about analyst names.

**Step 4: Research Sports Illustrated archives (2020-2025)**

Sports Illustrated may have limited recent archives:
- Check: `site:si.com "nfl draft grades" 2025`
- Site has had ownership changes, archives may be spotty
- Worth checking but may not find full coverage

Add findings under "### Sports Illustrated" section.

**Step 5: Review and tally new source results**

Add to Summary table:

```markdown
| Source           | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | Total Found |
|------------------|------|------|------|------|------|------|-------------|
| The Athletic     | PW   | PW   | URL  | URL  | URL  | URL  | 4/6         |
| USA Today        | URL  | URL  | URL  | URL  | URL  | URL  | 6/6         |
| NFL Net (Brooks) | URL  | 404  | URL  | URL  | URL  | URL  | 5/6         |
| SI               | 404  | 404  | 404  | URL  | URL  | URL  | 3/6         |

**Gap filling URLs:** [count from Task 1]
**New source URLs:** [count from Task 2]
**Total Batch 1 URLs:** [total]
```

**Step 6: Commit updated research document**

```bash
git add docs/research/batch1-gap-filling-urls.md
git commit -m "research: add new source URLs for Batch 1"
```

---

## Task 3: Review and approve URL list

**This is a USER REVIEW step - not automated**

**Step 1: Present research findings to user**

Share the research document and ask user to review:
- Which URLs to include
- Which to skip (paywalls, low quality, etc.)
- Any additional sources to investigate

**Step 2: Wait for user approval**

User will respond with:
- ✅ Approved - proceed with all URLs
- 🔄 Revisions - specific URLs to add/remove
- ❌ Need more research - go back and find alternatives

**Step 3: Note approval in research document**

Add to top of `batch1-gap-filling-urls.md`:

```markdown
# Batch 1: Gap Filling & New Source URLs

**Status:** ✅ Approved by user on [date]

**Approved URL count:** [count]

**Notes:**
- [Any user feedback or decisions]
```

**Step 4: Commit approval note**

```bash
git add docs/research/batch1-gap-filling-urls.md
git commit -m "research: user approval for Batch 1 URLs"
```

---

## Task 4: Update grade_sources.json with gap-filling URLs

**Files:**
- Modify: `apps/data-collector/data/grade_sources.json`

**Step 1: Add Fox Sports missing years**

Based on research findings, update Fox Sports entry in `grade_sources.json`:

```json
{
  "source": "Fox Sports",
  "slug": "fox-sports",
  "baseUrl": "https://www.foxsports.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "https://www.foxsports.com/stories/nfl/2025-nfl-draft-grades-analyzing-all-32-teams-classes",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

Remove any years where URL was not found (404).

**Step 2: Add NFL.com missing years**

Update NFL.com entry:

```json
{
  "source": "NFL.com",
  "slug": "nfl-com",
  "baseUrl": "https://www.nfl.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "[URL from research]",
    "2024": "https://www.nfl.com/news/2024-nfl-draft-final-quick-snap-grades-for-all-32-teams",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

**Step 3: Add SDUT missing years**

Update San Diego Union Tribune entry:

```json
{
  "source": "San Diego Union Tribune",
  "slug": "sdut",
  "baseUrl": "https://www.sandiegouniontribune.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "https://www.sandiegouniontribune.com/2025/04/28/2025-nfl-draft-grades-for-all-32-teams-patriots-raiders-among-big-winners/",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

**Step 4: Add SBNation missing years**

Update SBNation entry:

```json
{
  "source": "SBNation",
  "slug": "sbnation",
  "baseUrl": "https://www.sbnation.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "https://www.sbnation.com/nfl/2025/4/28/24419371/nfl-draft-grades-teams-final-full-class-best-drafts-panthers",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

**Step 5: Validate JSON syntax**

Run: `cd apps/data-collector && node -e "JSON.parse(require('fs').readFileSync('data/grade_sources.json', 'utf-8')); console.log('Valid JSON')"`
Expected: `Valid JSON` (no syntax errors)

**Step 6: Commit gap-filling config updates**

```bash
git add apps/data-collector/data/grade_sources.json
git commit -m "config: add gap-filling URLs for Fox Sports, NFL.com, SDUT, SBNation (2020-2025)"
```

---

## Task 5: Update grade_sources.json with new source URLs

**Files:**
- Modify: `apps/data-collector/data/grade_sources.json`

**Step 1: Add The Athletic**

Based on research, add new entry (or skip if all paywalled):

```json
{
  "source": "The Athletic",
  "slug": "the-athletic",
  "baseUrl": "https://theathletic.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "[URL from research]",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

Insert after SBNation entry in array.

**Step 2: Add USA Today**

Add new entry:

```json
{
  "source": "USA Today",
  "slug": "usa-today",
  "baseUrl": "https://www.usatoday.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "[URL from research]",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

**Step 3: Add NFL Network analyst content (if different from NFL.com)**

If Bucky Brooks/Daniel Jeremiah articles are separate from main NFL.com grades:

```json
{
  "source": "NFL Network - Bucky Brooks",
  "slug": "nfl-net-brooks",
  "baseUrl": "https://www.nfl.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "[URL from research]",
    "2024": "[URL from research]",
    "2023": "[URL from research]",
    "2022": "[URL from research]",
    "2021": "[URL from research]",
    "2020": "[URL from research]"
  }
}
```

Otherwise, skip this step (note in commit message).

**Step 4: Add Sports Illustrated**

Add new entry (only years found):

```json
{
  "source": "Sports Illustrated",
  "slug": "sports-illustrated",
  "baseUrl": "https://www.si.com",
  "fetchMethod": "fetch",
  "articles": {
    "2025": "[URL from research]",
    "2024": "[URL from research]",
    "2023": "[URL from research]"
  }
}
```

**Step 5: Validate JSON syntax**

Run: `cd apps/data-collector && node -e "JSON.parse(require('fs').readFileSync('data/grade_sources.json', 'utf-8')); console.log('Valid JSON')"`
Expected: `Valid JSON`

**Step 6: Commit new source config updates**

```bash
git add apps/data-collector/data/grade_sources.json
git commit -m "config: add new sources for Batch 1 (Athletic, USA Today, SI, NFL Net)"
```

---

## Task 6: Collect grades for 2025

**Files:**
- Output: `apps/data-collector/data/2025_draft_class_grades.json`
- Output: `apps/data-collector/data/debug/2025_*_raw.json`

**Step 1: Run collection script for 2025**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2025
```

Expected output:
```
=== Collecting Draft Class Grades for 2025 ===

Loaded [N] source(s) from grade_sources.json

--- ESPN: 2025 ---
  Fetching: https://...
  Fetched [X] bytes
  Cleaned to [Y] bytes
  Sending to Haiku for extraction...
  Extracted 32 team grades
  Debug output: data/debug/2025_espn_raw.json

[... repeat for each source ...]

=== Results ===
Total grade entries: [count]
Written to: data/2025_draft_class_grades.json
```

**Step 2: Review console output for warnings**

Look for:
- "WARNING: Only [X] teams found" (if <20)
- "Unknown grade [X] for [team]" (should be rare)
- "FAILED for [source]" (network/extraction errors)

Document any issues in `docs/research/batch1-collection-notes.md`:

```markdown
# Batch 1 Collection Notes

## 2025 Collection

**Sources processed:** [count]
**Total grades extracted:** [count]

### Warnings
- Fox Sports: Only 28 teams extracted (missing 4)
- USA Today: Unknown grade "Inc" for Patriots (skipped)

### Errors
- None
```

**Step 3: Spot-check 2025 output file**

Run: `cat apps/data-collector/data/2025_draft_class_grades.json | jq '. | length'`
Expected: [Total entries count]

Run: `cat apps/data-collector/data/2025_draft_class_grades.json | jq '.[0]'`
Expected: First entry shows proper structure with teamName, grade, gradeNumeric, text, sourceName, sourceUrl

**Step 4: Commit 2025 collection output**

```bash
git add apps/data-collector/data/2025_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2025 draft grades from Batch 1 sources"
```

Note: Debug files are gitignored, not committed.

---

## Task 7: Collect grades for 2024

**Files:**
- Output: `apps/data-collector/data/2024_draft_class_grades.json`
- Modify: `docs/research/batch1-collection-notes.md`

**Step 1: Run collection script for 2024**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2024
```

**Step 2: Review console output and document issues**

Add to `batch1-collection-notes.md`:

```markdown
## 2024 Collection

**Sources processed:** [count]
**Total grades extracted:** [count]

### Warnings
[List any warnings]

### Errors
[List any errors]
```

**Step 3: Spot-check 2024 output**

Run: `cat apps/data-collector/data/2024_draft_class_grades.json | jq '. | length'`
Verify count matches expectations.

**Step 4: Commit 2024 collection output**

```bash
git add apps/data-collector/data/2024_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2024 draft grades from Batch 1 sources"
```

---

## Task 8: Collect grades for 2023

**Files:**
- Output: `apps/data-collector/data/2023_draft_class_grades.json`
- Modify: `docs/research/batch1-collection-notes.md`

**Step 1: Run collection script for 2023**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2023
```

**Step 2: Review console output and document issues**

Add to `batch1-collection-notes.md` under "## 2023 Collection".

**Step 3: Spot-check 2023 output**

Run: `cat apps/data-collector/data/2023_draft_class_grades.json | jq '. | length'`

**Step 4: Commit 2023 collection output**

```bash
git add apps/data-collector/data/2023_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2023 draft grades from Batch 1 sources"
```

---

## Task 9: Collect grades for 2022

**Files:**
- Output: `apps/data-collector/data/2022_draft_class_grades.json`
- Modify: `docs/research/batch1-collection-notes.md`

**Step 1: Run collection script for 2022**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2022
```

**Step 2: Review console output and document issues**

Add to `batch1-collection-notes.md` under "## 2022 Collection".

**Step 3: Spot-check 2022 output**

Run: `cat apps/data-collector/data/2022_draft_class_grades.json | jq '. | length'`

**Step 4: Commit 2022 collection output**

```bash
git add apps/data-collector/data/2022_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2022 draft grades from Batch 1 sources"
```

---

## Task 10: Collect grades for 2021

**Files:**
- Output: `apps/data-collector/data/2021_draft_class_grades.json`
- Modify: `docs/research/batch1-collection-notes.md`

**Step 1: Run collection script for 2021**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2021
```

**Step 2: Review console output and document issues**

Add to `batch1-collection-notes.md` under "## 2021 Collection".

**Step 3: Spot-check 2021 output**

Run: `cat apps/data-collector/data/2021_draft_class_grades.json | jq '. | length'`

**Step 4: Commit 2021 collection output**

```bash
git add apps/data-collector/data/2021_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2021 draft grades from Batch 1 sources"
```

---

## Task 11: Collect grades for 2020

**Files:**
- Output: `apps/data-collector/data/2020_draft_class_grades.json`
- Modify: `docs/research/batch1-collection-notes.md`

**Step 1: Run collection script for 2020**

Run:
```bash
cd apps/data-collector
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2020
```

**Step 2: Review console output and document issues**

Add to `batch1-collection-notes.md` under "## 2020 Collection".

**Step 3: Spot-check 2020 output**

Run: `cat apps/data-collector/data/2020_draft_class_grades.json | jq '. | length'`

**Step 4: Commit 2020 collection output**

```bash
git add apps/data-collector/data/2020_draft_class_grades.json
git add docs/research/batch1-collection-notes.md
git commit -m "data: collect 2020 draft grades from Batch 1 sources"
```

---

## Task 12: Generate validation report

**Files:**
- Create: `docs/reports/batch1-validation-report.md`

**Step 1: Create coverage matrix**

Analyze which sources covered which years. Create `docs/reports/batch1-validation-report.md`:

```markdown
# Batch 1 Validation Report

Generated: [date]

## Coverage Matrix

| Source           | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | Total |
|------------------|------|------|------|------|------|------|-------|
| ESPN             | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| Bleacher Report  | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| CBS Sports       | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| Yahoo Sports     | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| PFF              | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| Fox Sports       | ✓    | ✓    | -    | ✓    | ✓    | ✓    | 5     |
| NFL.com          | ✓    | -    | ✓    | ✓    | -    | ✓    | 4     |
| SDUT             | -    | -    | -    | -    | ✓    | ✓    | 2     |
| SBNation         | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| The Athletic     | -    | -    | ✓    | ✓    | ✓    | ✓    | 4     |
| USA Today        | ✓    | ✓    | ✓    | ✓    | ✓    | ✓    | 6     |
| SI               | -    | -    | -    | ✓    | ✓    | ✓    | 3     |
| **Sources/Year** | **9**| **8**| **9**|**11**|**11**|**12**|        |

**Total articles collected:** [sum of all ✓]
**Average sources per year:** [mean]
```

Use actual data from collection - count entries per source/year in JSON files.

**Step 2: Calculate grade distributions per year**

For each year, count grade frequency:

Run:
```bash
cat apps/data-collector/data/2025_draft_class_grades.json | jq '[.[] | .grade] | group_by(.) | map({grade: .[0], count: length}) | sort_by(.grade)'
```

Add to validation report:

```markdown
## Grade Distributions

### 2025
| Grade | Count | Percentage |
|-------|-------|------------|
| A+    | 12    | 3%         |
| A     | 45    | 12%        |
| A-    | 67    | 18%        |
| B+    | 89    | 24%        |
| B     | 78    | 21%        |
| B-    | 56    | 15%        |
| C+    | 23    | 6%         |
| C     | 8     | 2%         |

✓ Distribution looks normal (bell curve centered on B/B+)

[Repeat for 2024, 2023, 2022, 2021, 2020]
```

**Step 3: Calculate completeness scores**

For each source/year, count teams extracted:

Run:
```bash
cat apps/data-collector/data/2025_draft_class_grades.json | jq 'group_by(.sourceName) | map({source: .[0].sourceName, teams: length}) | sort_by(.source)'
```

Add to validation report:

```markdown
## Completeness Scores

### 2025

| Source           | Teams | Completeness |
|------------------|-------|--------------|
| ESPN             | 32    | 100% ✓       |
| Bleacher Report  | 32    | 100% ✓       |
| CBS Sports       | 32    | 100% ✓       |
| Yahoo Sports     | 32    | 100% ✓       |
| PFF              | 32    | 100% ✓       |
| Fox Sports       | 28    | 87% ⚠️       |
| NFL.com          | 32    | 100% ✓       |
| SDUT             | 32    | 100% ✓       |
| SBNation         | 32    | 100% ✓       |
| USA Today        | 30    | 94% ⚠️       |
| SI               | 32    | 100% ✓       |

**Average completeness:** [mean]%

[Repeat for other years]
```

**Step 4: Sample text quality**

Randomly select 5 entries and check text field length:

Run:
```bash
cat apps/data-collector/data/2025_draft_class_grades.json | jq '[.[] | select(.text != null)] | .[0:5] | .[] | {source: .sourceName, team: .teamName, textLength: (.text | length)}'
```

Add to validation report:

```markdown
## Text Quality Sample (2025)

| Source     | Team          | Text Length | Status |
|------------|---------------|-------------|--------|
| ESPN       | Chicago Bears | 342 chars   | ✓      |
| CBS Sports | Buffalo Bills | 287 chars   | ✓      |
| Yahoo      | Green Bay     | 156 chars   | ✓      |
| PFF        | Dallas        | 89 chars    | ⚠️     |
| USA Today  | Miami         | 203 chars   | ✓      |

**Average text length:** [mean] chars
**Quality:** ✓ Good (all >50 chars, meaningful content)
```

**Step 5: Document warnings and errors**

Review `batch1-collection-notes.md` and summarize issues:

```markdown
## Issues Summary

### Critical Issues
- None

### Warnings
- ⚠️ Fox Sports 2025: Only 28 teams extracted (missing: Panthers, Titans, Jaguars, Texans)
- ⚠️ USA Today 2024: Short analysis text (avg 45 chars per team)
- ⚠️ PFF 2021: Extraction retry required (succeeded on 2nd attempt)

### Errors
- None (all sources extracted successfully)

### Missing Coverage
- Fox Sports 2022: URL returned 404 (not published or moved)
- NFL.com 2021, 2024: URLs not found in archives
- The Athletic 2020-2021: Behind hard paywall (skipped)
```

**Step 6: Add summary and recommendations**

Add conclusion to validation report:

```markdown
## Summary

**Goal:** Expand 2020-2025 coverage to 10+ sources per year
**Result:** ✓ Achieved (9-12 sources per year)

**Total articles collected:** [count]
**Average completeness:** [mean]%
**Quality issues:** [count] warnings, 0 critical

## Recommendations

1. ✓ **Proceed with seeding** - data quality is acceptable
2. ⚠️ **Monitor Fox Sports 2025** - Consider manual review of missing 4 teams
3. ℹ️ **USA Today text length** - Acceptable but note for future (consistent short-form style)
4. ✓ **All grade distributions normal** - No anomalies detected

## Next Steps

1. Seed draft class grades for 2020-2025
2. Seed player grades for 2020-2025
3. Verify API responses include new sources
4. Spot-check frontend display
```

**Step 7: Commit validation report**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: Batch 1 validation report"
```

---

## Task 13: Seed draft class grades for all years

**Files:**
- Database: `DraftClassGrade`, `Source`, `SourceArticle` tables

**Step 1: Seed 2020 grades**

Run:
```bash
cd apps/draft-api
npx nx run draft-api:seed -- --step grades --year 2020
```

Expected output:
```
=== Seeding Draft Class Grades ===

Step: grades
  Created grade for Chicago Bears: A- (ESPN)
  Created grade for Chicago Bears: B+ (CBS Sports)
  ...
  Skipping grade for Chicago Bears 2020 (ESPN) (exists)
  ...

Results: [N] success, 0 failed, [M] skipped
```

Note: Skipped entries are expected (existing grades from previous collection).

**Step 2: Seed 2021 grades**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2021
```

Review output for success/skipped/failed counts.

**Step 3: Seed 2022 grades**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2022
```

**Step 4: Seed 2023 grades**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2023
```

**Step 5: Seed 2024 grades**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2024
```

**Step 6: Seed 2025 grades**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2025
```

**Step 7: Verify database record counts**

Run SQL query to check total grades per year:

```bash
npx nx run draft-api:db:query -- "SELECT year, COUNT(*) as grade_count FROM draft_class_grade GROUP BY year ORDER BY year"
```

Expected output:
```
year | grade_count
-----|------------
2020 | ~288 (9 sources × 32 teams)
2021 | ~256 (8 sources × 32 teams)
2022 | ~288 (9 sources × 32 teams)
2023 | ~352 (11 sources × 32 teams)
2024 | ~352 (11 sources × 32 teams)
2025 | ~384 (12 sources × 32 teams)
```

Actual counts may vary based on missing teams per source.

**Step 8: Document seeding results**

Add to `docs/reports/batch1-validation-report.md`:

```markdown
## Seeding Results

### Draft Class Grades

| Year | Expected | Actual | Status |
|------|----------|--------|--------|
| 2020 | ~288     | [X]    | ✓      |
| 2021 | ~256     | [X]    | ✓      |
| 2022 | ~288     | [X]    | ✓      |
| 2023 | ~352     | [X]    | ✓      |
| 2024 | ~352     | [X]    | ✓      |
| 2025 | ~384     | [X]    | ✓      |

**Total grades seeded:** [sum]
```

**Step 9: Commit seeding documentation**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: add seeding results to Batch 1 validation report"
```

---

## Task 14: Seed player grades for all years

**Files:**
- Database: `PlayerGrade` table

**Step 1: Seed player grades for 2020**

Run:
```bash
cd apps/draft-api
npx nx run draft-api:seed -- --step player-grades --year 2020
```

Expected output:
```
=== Seeding Player Grades ===

Step: player-grades
  Player grades: [N] created, [M] failed, [P] skipped
```

Note: Many sources don't provide individual player grades, so counts may be low.

**Step 2: Seed player grades for 2021-2025**

Run for each year:
```bash
npx nx run draft-api:seed -- --step player-grades --year 2021
npx nx run draft-api:seed -- --step player-grades --year 2022
npx nx run draft-api:seed -- --step player-grades --year 2023
npx nx run draft-api:seed -- --step player-grades --year 2024
npx nx run draft-api:seed -- --step player-grades --year 2025
```

**Step 3: Verify player grade counts**

Run SQL query:

```bash
npx nx run draft-api:db:query -- "SELECT COUNT(*) as player_grade_count FROM player_grade WHERE draft_pick_id IN (SELECT id FROM draft_pick WHERE year BETWEEN 2020 AND 2025)"
```

Expected: Variable count (depends on which sources provide player-level grades).

**Step 4: Document player grade seeding**

Add to `docs/reports/batch1-validation-report.md`:

```markdown
### Player Grades

| Year | Grades Seeded | Notes |
|------|---------------|-------|
| 2020 | [X]           | [Any notes] |
| 2021 | [X]           |       |
| 2022 | [X]           |       |
| 2023 | [X]           |       |
| 2024 | [X]           |       |
| 2025 | [X]           |       |

**Total player grades seeded:** [sum]

**Note:** Player-level grades are optional in articles. Low counts are expected.
```

**Step 5: Commit player grade documentation**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: add player grade seeding results to Batch 1 report"
```

---

## Task 15: Verify API responses

**Files:**
- None (verification step)

**Step 1: Test API for 2025 with new sources**

Run:
```bash
curl http://localhost:3001/draft-summary/2025 | jq '.teams[0].draftGrades | map(.sourceArticle.source.name)'
```

Expected: Array containing new sources like "USA Today", "Sports Illustrated", etc.

**Step 2: Test API for older year (2020)**

Run:
```bash
curl http://localhost:3001/draft-summary/2020 | jq '.teams[0].draftGrades | length'
```

Expected: Higher count than before (9-10 sources).

**Step 3: Test multi-year endpoint**

Run:
```bash
curl "http://localhost:3001/draft-summary/years?start=2020&end=2025" | jq '.years | length'
```

Expected: 6 years returned.

**Step 4: Spot-check specific team**

Run:
```bash
curl http://localhost:3001/draft-summary/2025 | jq '.teams[] | select(.team.name == "Chicago Bears") | .draftGrades | map(.sourceArticle.source.name)'
```

Expected: List of source names includes new Batch 1 sources.

**Step 5: Document API verification**

Add to `docs/reports/batch1-validation-report.md`:

```markdown
## API Verification

### Endpoints Tested

1. **GET /draft-summary/2025**
   - ✓ Returns new sources (USA Today, SI, etc.)
   - ✓ Grade counts increased from [old] to [new]

2. **GET /draft-summary/2020**
   - ✓ Returns new sources from Batch 1
   - ✓ Grade counts increased

3. **GET /draft-summary/years?start=2020&end=2025**
   - ✓ All 6 years returned
   - ✓ Each year includes new sources

### Spot Check: Chicago Bears 2025

**Sources before Batch 1:** [count]
**Sources after Batch 1:** [count]
**New sources:** USA Today, SI, [others]
```

**Step 6: Commit API verification documentation**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: add API verification results to Batch 1 report"
```

---

## Task 16: Verify frontend display

**Files:**
- None (verification step)

**Step 1: Start frontend dev server**

Run:
```bash
npx nx run mmd-public:dev
```

Wait for: `ready - started server on http://localhost:4200`

**Step 2: Check main page source counts**

Navigate to: `http://localhost:4200`

Verify:
- Each team row shows increased source count in table
- Sparklines render (existing feature, should still work)

**Step 3: Check team detail page**

Navigate to: `http://localhost:4200/teams/chicago-bears`

Verify:
- "Detailed Grades" table shows new sources (USA Today, SI, etc.)
- Grade distribution chart includes all sources
- Historical chart displays correctly
- Division comparison uses new data

**Step 4: Check year selector**

Use year dropdown on team page, switch between 2020-2025.

Verify:
- Each year shows appropriate source coverage
- Grades update correctly
- No console errors

**Step 5: Document frontend verification**

Add to `docs/reports/batch1-validation-report.md`:

```markdown
## Frontend Verification

### Main Page (localhost:4200)
- ✓ Team rows display increased source counts
- ✓ Sparklines render correctly
- ✓ FilterBar shows new sources in dropdown

### Team Detail Page (Chicago Bears example)
- ✓ Detailed grades table includes USA Today, SI, etc.
- ✓ Grade distribution chart updates with new sources
- ✓ Historical chart displays 2020-2025 correctly
- ✓ Division comparison renders

### Year Selector
- ✓ All years 2020-2025 load correctly
- ✓ Source counts match expectations per year
- ✓ No console errors

**Status:** ✅ Frontend verified successfully
```

**Step 6: Commit frontend verification**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: add frontend verification to Batch 1 report"
```

---

## Task 17: Final batch summary and commit

**Files:**
- Modify: `docs/reports/batch1-validation-report.md`

**Step 1: Add final summary section**

Add to end of validation report:

```markdown
---

## Batch 1: Final Summary

**Completion date:** [date]

### Objectives
- ✅ Fill gaps in existing sources (2020-2025)
- ✅ Add 3-4 new major sources (2020-2025)
- ✅ Achieve 10+ sources per year for modern era

### Results
- **URLs researched:** [count]
- **Articles collected:** [count]
- **Draft class grades seeded:** [count]
- **Player grades seeded:** [count]
- **Sources per year:** 9-12 (exceeds 10+ goal)

### Data Quality
- **Average completeness:** [X]%
- **Critical issues:** 0
- **Warnings:** [count]
- **Grade distributions:** ✓ Normal (all years)

### Verification Status
- ✅ Database seeding complete
- ✅ API endpoints verified
- ✅ Frontend display verified
- ✅ Multi-year endpoint tested

### Issues Resolved
- All collection warnings documented and reviewed
- Missing URLs (404s) documented for reference
- Incomplete extractions flagged but data retained

### Next Steps
**Batch 2:** Research and collect 2017-2019 historical data (4-6 sources per year target)

---

**Batch 1 Status:** ✅ **COMPLETE**
```

**Step 2: Commit final summary**

```bash
git add docs/reports/batch1-validation-report.md
git commit -m "docs: finalize Batch 1 validation report with summary"
```

**Step 3: Tag the completion**

Create git tag for tracking:

```bash
git tag -a batch1-complete -m "Batch 1: Complete Modern Era (2020-2025) - [N] articles collected"
```

**Step 4: Push to remote (if desired)**

```bash
git push origin claude/distracted-kare
git push origin batch1-complete
```

---

## Success Criteria

**Batch 1 is complete when:**
- ✅ All gap-filling URLs researched and added to config
- ✅ 3-4 new sources added to config (The Athletic, USA Today, etc.)
- ✅ Grades collected for all years 2020-2025
- ✅ Validation report generated with coverage matrix, quality metrics, issues
- ✅ All grades seeded to database
- ✅ API endpoints return new sources correctly
- ✅ Frontend displays new sources on main page and team pages
- ✅ Each year 2020-2025 has 10+ sources (goal achieved)
- ✅ Final summary committed with git tag

**Deliverables:**
- `grade_sources.json` updated with ~15-20 new URLs
- `2020-2025_draft_class_grades.json` files with expanded data
- `batch1-validation-report.md` with comprehensive quality analysis
- Database records: ~2000 draft class grades, variable player grades
- Git tag: `batch1-complete`

**Time estimate:** 2-3 days total (1-2 days research, 3-4 hours collection, 2-3 hours validation/seeding/verification)
