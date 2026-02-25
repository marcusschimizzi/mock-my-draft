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

## 2023 Collection

**Date:** February 25, 2026
**Sources processed:** 11 (ESPN, Bleacher Report, CBS Sports, Yahoo Sports, PFF, Fox Sports, NFL.com, San Diego Union Tribune, SBNation, Sports Illustrated, The Ringer)
**Total grades extracted:** 224 (7 sources × 32 teams)

### Warnings

- **ESPN** extraction returned 0 teams - ESPN+ Insider paywall restriction
- **Yahoo Sports** extraction returned 0 teams - article format appears to list "Best Pick" and "Worst Pick" per team instead of overall grades
- **PFF** extraction returned 0 teams - JavaScript-rendered content may not have loaded properly

### Errors

- None. All non-problematic sources successfully extracted 32 team grades each.

### Successful Sources (7)

1. **Bleacher Report** - 32 teams extracted
2. **CBS Sports** - 32 teams extracted
3. **Fox Sports** - 32 teams extracted
4. **NFL.com** - 32 teams extracted
5. **San Diego Union Tribune** - 32 teams extracted
6. **Sports Illustrated** - 32 teams extracted
7. **The Ringer** - 32 teams extracted ✨ (NEW Batch 1 source)

### Failed/Partial Sources (3)

1. **ESPN** - 0 teams extracted (ESPN+ Insider paywall)
2. **Yahoo Sports** - 0 teams extracted (different article format - uses "Best/Worst Pick" instead of grades)
3. **PFF** - 0 teams extracted (browser rendering issue)

### Skipped Sources (1)

- **SBNation** - No 2023 article URL configured

### Notes

- The extraction process took approximately 8 minutes
- 7 out of 11 configured sources provided complete coverage of all 32 NFL teams
- **The Ringer successfully extracted** - confirming our new Batch 1 source works for 2023
- Debug files saved in `apps/data-collector/data/debug/2023_*_raw.json`
- Final output saved in `apps/data-collector/data/2023_draft_class_grades.json` (183 KB, 2241 lines)
- Yahoo Sports article had an unusual format focusing on best/worst picks per team rather than overall grades, resulting in empty extraction

## 2022 Collection

**Date:** February 25, 2026
**Sources processed:** 11 (ESPN, Bleacher Report, CBS Sports, Yahoo Sports, PFF, Fox Sports, NFL.com, San Diego Union Tribune, SBNation, Sports Illustrated, The Ringer)
**Total grades extracted:** 182 (6 sources)

### Warnings

- **ESPN** extraction returned 0 teams - ESPN+ Insider paywall restriction
- **PFF** extraction returned 0 teams - JavaScript-rendered content may not have loaded properly despite browser mode
- **Sports Illustrated** unknown grade format warnings:
  - Unknown grade "A–" (with en dash instead of hyphen) for New York Giants and Pittsburgh Steelers
  - Unknown grade "B–" for Atlanta Falcons, Buffalo Bills, Jacksonville Jaguars, Los Angeles Chargers, New England Patriots, Tampa Bay Buccaneers
  - Unknown grade "D–" for Minnesota Vikings
  - Total: 9 teams skipped due to en dash character (should be normalized)
- **San Diego Union Tribune** unknown grade warning:
  - Unknown grade "A++" for Baltimore Ravens (non-standard grade format)

### Errors

- None. All non-problematic sources successfully extracted expected team grades.

### Successful Sources (6)

1. **Bleacher Report** - 32 teams extracted
2. **CBS Sports** - 32 teams extracted
3. **Yahoo Sports** - 32 teams extracted
4. **NFL.com** - 32 teams extracted
5. **San Diego Union Tribune** - 31 teams extracted (1 team skipped due to "A++" grade)
6. **Sports Illustrated** - 23 teams extracted (9 teams skipped due to en dash in grades)

### Failed Sources (2)

1. **ESPN** - 0 teams extracted (ESPN+ Insider paywall)
2. **PFF** - 0 teams extracted (browser rendering issue)

### Skipped Sources (3)

- **Fox Sports** - No 2022 article URL configured
- **SBNation** - No 2022 article URL configured
- **The Ringer** - No 2022 article URL configured

### Notes

- The extraction process completed successfully with 182 total grade entries
- 6 out of 11 configured sources provided data (4 complete, 2 partial)
- **Grade normalization issue identified:** Sports Illustrated uses en dash (–) instead of standard hyphen (-) in grades like "A–", "B–", "D–"
  - Recommendation: Update `gradeToNumeric` function to handle en dash character variants
- **Non-standard grade identified:** San Diego Union Tribune used "A++" for Baltimore Ravens
  - Recommendation: Decide whether to support "A++" as a valid grade or treat as "A+"
- Debug files saved in `apps/data-collector/data/debug/2022_*_raw.json`
- Final output saved in `apps/data-collector/data/2022_draft_class_grades.json` (146 KB, 2045 lines)
- Despite grade normalization issues, the collection provides adequate coverage with 6 sources and 182 team grades
