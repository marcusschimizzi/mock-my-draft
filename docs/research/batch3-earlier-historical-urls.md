# Batch 3: Earlier Historical URLs Research (2010-2016)

**Date:** 2026-02-25
**Researcher:** Search Specialist Subagent
**Batch:** Batch 3 - Earlier Historical (2010-2016)

## Research Summary

Comprehensive web search for NFL draft grade articles from 2010-2016 across major sports media outlets. Identified 34 potential URLs, recommended 11 primary URLs for data collection based on coverage and reliability.

## Recommended URLs (11 Total)

### Bleacher Report (7 URLs - 2010-2016)

**Coverage:** Consistent year-over-year coverage, single article per year with all 32 teams

1. **2016:** https://bleacherreport.com/articles/2637319-nfl-draft-grades-2016-full-list-of-results-and-scores-for-all-32-teams
2. **2015:** https://bleacherreport.com/articles/2453208-nfl-draft-grades-2015-full-list-of-results-and-scores-for-all-32-teams
3. **2014:** https://bleacherreport.com/articles/2059205-2014-nfl-draft-grades-full-results-listings-and-final-team-marks
4. **2013:** https://bleacherreport.com/articles/1620969-2013-nfl-draft-grades-team-by-team-report-cards-results
5. **2012:** https://bleacherreport.com/articles/1163416-2012-nfl-draft-grades-full-draft-results-report-card
6. **2011:** https://bleacherreport.com/articles/684372-2011-nfl-draft-grades-final-report-cards-and-results-for-all-32-teams
7. **2010:** https://bleacherreport.com/articles/383970-2010-nfl-draft-results-final-32-team-grades-for-all-seven-rounds

**Notes:**
- Consistent "report card" format across all years
- Single comprehensive article per draft year
- All 32 teams in one page (easier extraction)

### CBS Sports (3 URLs - 2014-2016)

**Coverage:** 2014-2016 only, reliable grading format

1. **2016:** https://www.cbssports.com/nfl/news/nfl-draft-2016-grades-picks-analysis-for-all-32-teams/
2. **2015:** https://www.cbssports.com/nfl/news/nfl-draft-2015-grades-picks-analysis-for-all-32-teams/
3. **2014:** https://www.cbssports.com/nfl/news/nfl-draft-2014-grades-picks-analysis-for-all-32-teams/

**Notes:**
- High-quality professional analysis
- Consistent format year-over-year
- Reliable extraction candidate

### PFF (1 URL - 2016)

**Coverage:** Limited to 2016

1. **2016:** https://www.pff.com/news/pro-2016-nfl-draft-grades-for-all-32-teams

**Notes:**
- Analytics-focused grading
- Likely uses word grades (EXCELLENT, GOOD, etc.) like 2018-2019
- Requires word-to-letter mapping (already implemented in grades-utils.js)

## Additional URLs Found (Not Recommended - 23 URLs)

### ESPN (Multiple Years)

**Issues:**
- Scattered across multiple pages per year
- Some years have team-by-team articles (32 separate pages)
- Inconsistent URL structure
- Higher extraction complexity

**Example:**
- 2015: https://www.espn.com/blog/nflnation/post/_/id/162786/2015-nfl-draft-grades-espn-insider

### NFL.com (Limited Coverage)

**Issues:**
- Very limited historical coverage for early 2010s
- Articles focus more on picks than grades
- Not a primary grading source for these years

### SB Nation (Fragmented)

**Issues:**
- Draft grades often in team-specific blogs (32 separate sites)
- No centralized "all teams" article
- Extraction would require 32 different scrapes per year

## Coverage Gaps

### 2010-2012
- **Bleacher Report only:** Single source for these years
- ESPN and CBS Sports coverage unclear or fragmented
- Acceptable for historical data (1 source better than 0)

### 2013
- **Bleacher Report only:** Single source identified
- Same reasoning as 2010-2012

### 2014-2016
- **Strong coverage:** Bleacher Report + CBS Sports + PFF (2016 only)
- 2-3 sources per year
- Good data quality

## HTML Structure Concerns

### Older Articles (2010-2013)
- **Risk:** 13-16 years old, HTML structure may have changed
- **Mitigation:** Claude Haiku extraction should handle most variations
- **Fallback:** Manual inspection if automated extraction fails

### Bleacher Report Evolution
- URL pattern suggests consistent structure
- All use "draft-grades" in URL
- "full-list-of-results-and-scores-for-all-32-teams" pattern starts 2015+
- Earlier years may have different internal HTML

## Recommendation Priority

**Priority 1 (Do First):**
1. Bleacher Report 2014-2016 (overlap with CBS Sports for validation)
2. CBS Sports 2014-2016 (validation source)
3. PFF 2016 (additional data point)

**Priority 2 (If Priority 1 succeeds):**
1. Bleacher Report 2011-2013 (only source for these years)

**Priority 3 (If Priority 2 succeeds):**
1. Bleacher Report 2010 (oldest article, highest risk of failure)

## Scraping Recommendations

1. **Start with 2014-2016:** More recent articles, higher success probability
2. **Validate extraction:** Compare Bleacher Report vs. CBS Sports for 2014-2016
3. **Proceed to 2011-2013:** If 2014-2016 succeeds, move to single-source years
4. **Consider 2010 optional:** 16-year-old HTML may be incompatible

## Expected Outcome

**Best Case:**
- 7 years × 32 teams = 224 teams (Bleacher Report)
- 3 years × 32 teams = 96 teams (CBS Sports)
- 1 year × 32 teams = 32 teams (PFF)
- **Total: 352 grades** (assuming some overlap)

**Realistic Case:**
- 2014-2016: 2-3 sources each = ~160 grades
- 2011-2013: 1 source each = ~96 grades
- **Total: ~256 grades**

**Minimum Acceptable:**
- 2014-2016 from CBS Sports only = 96 grades
- 2011-2013 from Bleacher Report = 96 grades
- **Total: ~192 grades**

## Search Queries Used

1. "NFL draft grades 2010 Bleacher Report CBS Sports"
2. "NFL draft grades 2011 all teams"
3. "NFL draft grades 2012 Bleacher Report"
4. "NFL draft grades 2013 ESPN CBS"
5. "NFL draft grades 2014 all 32 teams"
6. "NFL draft grades 2015 comprehensive"
7. "NFL draft grades 2016 PFF CBS Bleacher Report"

## Conclusion

Identified 11 high-quality URLs covering 2010-2016 with 2-3 sources per year for 2014-2016 and single sources for earlier years. Recommended approach: start with recent years (2014-2016) to validate extraction techniques, then proceed to older articles. Expected to collect 200-350 grades depending on extraction success rate.
