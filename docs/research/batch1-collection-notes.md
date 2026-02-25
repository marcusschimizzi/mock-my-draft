# Batch 1 Collection Notes

## 2025 Collection

**Date:** February 25, 2026
**Sources processed:** 10 (ESPN, Bleacher Report, CBS Sports, Yahoo Sports, PFF, Fox Sports, NFL.com, San Diego Union Tribune, SBNation, Sports Illustrated)
**Total grades extracted:** 288 (9 sources × 32 teams)

### Warnings

- ESPN extraction returned empty results - likely due to ESPN+ Insider paywall restriction. The article requires a subscription to access full content.

### Errors

- None. All non-paywalled sources successfully extracted 32 team grades each.

### Successful Sources (9)

1. **Bleacher Report** - 32 teams extracted
2. **CBS Sports** - 32 teams extracted
3. **Yahoo Sports** - 32 teams extracted
4. **PFF** - 32 teams extracted
5. **Fox Sports** - 32 teams extracted
6. **NFL.com** - 32 teams extracted
7. **San Diego Union Tribune** - 32 teams extracted
8. **SBNation** - 32 teams extracted
9. **Sports Illustrated** - 32 teams extracted

### Failed Sources (1)

1. **ESPN** - Empty extraction (ESPN+ Insider paywall)

### Notes

- The extraction process took approximately 19 minutes
- All successful sources provided complete coverage of all 32 NFL teams
- Debug files saved in `apps/data-collector/data/debug/2025_*_raw.json`
- Final output saved in `apps/data-collector/data/2025_draft_class_grades.json`

## 2024 Collection

**Date:** February 25, 2026
**Sources processed:** 9 (ESPN, Bleacher Report, CBS Sports, Yahoo Sports, PFF, Fox Sports, NFL.com, San Diego Union Tribune, Sports Illustrated)
**Total grades extracted:** 225 (7 sources × 32 teams + 1 partial source)

### Warnings

- **ESPN** extraction returned only 1 team (Arizona Cardinals) - likely due to ESPN+ Insider paywall restriction. The article requires a subscription to access full content.
- **PFF** extraction returned 0 teams - JavaScript-rendered content may not have loaded properly despite using headless browser mode.

### Errors

- None. All non-problematic sources successfully extracted 32 team grades each.

### Successful Sources (7)

1. **Bleacher Report** - 32 teams extracted
2. **CBS Sports** - 32 teams extracted
3. **Yahoo Sports** - 32 teams extracted
4. **Fox Sports** - 32 teams extracted
5. **NFL.com** - 32 teams extracted
6. **San Diego Union Tribune** - 32 teams extracted
7. **Sports Illustrated** - 32 teams extracted

### Failed/Partial Sources (2)

1. **ESPN** - Only 1 team extracted (ESPN+ Insider paywall)
2. **PFF** - 0 teams extracted (browser rendering issue)

### Skipped Sources (2)

- **SBNation** - No 2024 article URL configured
- **The Ringer** - No 2024 article URL configured

### Notes

- The extraction process took approximately 6 minutes
- 7 out of 9 configured sources provided complete coverage of all 32 NFL teams
- Debug files saved in `apps/data-collector/data/debug/2024_*_raw.json`
- Final output saved in `apps/data-collector/data/2024_draft_class_grades.json` (205 KB, 2955 lines)
- Despite ESPN and PFF issues, the collection provides good coverage with 7 complete sources
