# LLM-Assisted Draft Class Grades Scraper

## Problem

Draft class grades data is needed to populate `DraftClassGrade` and `PlayerGrade` tables after the DigitalOcean to Railway migration. Grades come from multiple sports publications (ESPN, NFL.com, The Athletic, etc.) with varied HTML layouts that break traditional Cheerio-based scraping.

## Approach

Use Claude Haiku as the extraction engine. Instead of writing per-site Cheerio selectors that break when layouts change, send cleaned article HTML to Haiku and let it extract structured grade data via tool_use.

## Architecture

Standalone Node.js script in `apps/data-collector/` following the same pattern as the existing `main.js` player scraper.

### Config File: `grade_sources.json`

```json
[
  {
    "source": "ESPN",
    "slug": "espn",
    "baseUrl": "https://www.espn.com",
    "articles": {
      "2024": "https://www.espn.com/nfl/story/example/2024-nfl-draft-grades",
      "2025": "https://www.espn.com/nfl/story/example/2025-nfl-draft-grades"
    }
  }
]
```

Sources and URLs are maintained manually. This runs once per year after the draft.

### Pipeline

```
grade_sources.json
  -> for each source + year:
    1. Fetch article URL -> raw HTML
    2. Cheerio: strip nav, scripts, footer, aside, ads -> article body HTML
    3. Send cleaned HTML to Haiku via tool_use -> structured JSON
    4. Normalize team names (reuse existing oldTeamNames map)
    5. Map letter grades to numeric (A+ = 4.3 ... F = 0.0)
    6. Validate: warn if < 20 teams extracted
    7. Append to output array
  -> Write YYYY_draft_class_grades.json
```

### Haiku Extraction Schema (tool_use)

System prompt: data extraction assistant for NFL draft grades articles.

Tool definition forces Haiku to return:

```json
{
  "grades": [
    {
      "teamName": "Chicago Bears",
      "grade": "A-",
      "rawText": "Verbatim analysis paragraph from article",
      "playerGrades": [
        {
          "playerName": "Caleb Williams",
          "grade": "A",
          "rawText": "Verbatim pick-level analysis"
        }
      ]
    }
  ]
}
```

Key principle: the LLM extracts, JavaScript normalizes. Grade-to-numeric mapping is deterministic, not LLM-generated.

### Output Format: `YYYY_draft_class_grades.json`

```json
[
  {
    "teamName": "Chicago Bears",
    "year": 2024,
    "grade": "A-",
    "gradeNumeric": 3.7,
    "text": "Verbatim analysis paragraph from article",
    "sourceName": "ESPN",
    "sourceUrl": "https://www.espn.com/...",
    "playerGrades": [
      {
        "playerName": "Caleb Williams",
        "grade": "A",
        "gradeNumeric": 4.0,
        "text": "Verbatim pick-level analysis"
      }
    ]
  }
]
```

## Seed Step Updates

### `seed-draft-class-grades` changes

- Look up or create `Source` by `sourceName`
- Look up or create `SourceArticle` by URL + year
- Set `sourceArticle` relation on `DraftClassGrade`
- Change uniqueness check from `{ year, team }` to `{ year, team, sourceArticle }` (allows multiple grades per team from different sources)

### New: player grade seeding

- Match `playerName` from grades file to existing `Player` records (fuzzy match)
- Look up `DraftPick` for the player in that year
- Create `PlayerGrade` with `player`, `team`, `draftPick`, `sourceArticle`, `grade`, `gradeNumeric`, `text`

## Error Handling

- 1-second delay between fetches (polite scraping)
- Retry with exponential backoff on 429/5xx (max 3 attempts)
- Warn if Haiku returns < 20 team grades (partial article)
- Retry once on tool_use parse failure with simpler prompt
- Save raw Haiku response to debug file for auditing
- Unknown grades (e.g., "Incomplete") logged and skipped
- Team name normalization reuses `oldTeamNames` from `process_data.js`

## Dependencies

- `@anthropic-ai/sdk` added to `apps/data-collector/package.json`
- `ANTHROPIC_API_KEY` environment variable

## Grade Scale

| Grade | Numeric |
|-------|---------|
| A+    | 4.3     |
| A     | 4.0     |
| A-    | 3.7     |
| B+    | 3.3     |
| B     | 3.0     |
| B-    | 2.7     |
| C+    | 2.3     |
| C     | 2.0     |
| C-    | 1.7     |
| D+    | 1.3     |
| D     | 1.0     |
| D-    | 0.7     |
| F     | 0.0     |
