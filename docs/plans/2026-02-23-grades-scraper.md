# LLM-Assisted Draft Grades Scraper — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Haiku-powered scraper that extracts NFL draft class grades and player-level grades from sports media articles, producing JSON consumable by the existing seed pipeline.

**Architecture:** Node.js script in `apps/data-collector/` reads a URL config, fetches article HTML, strips non-content via Cheerio, sends cleaned HTML to Claude Haiku via tool_use for structured extraction, normalizes grades deterministically in JS, and writes `YYYY_draft_class_grades.json`.

**Tech Stack:** Node.js, Cheerio (existing), `@anthropic-ai/sdk`, structured tool_use output

**Design doc:** `docs/plans/2026-02-23-grades-scraper-design.md`

---

### Task 1: Add Anthropic SDK dependency and grade_sources config

**Files:**
- Modify: `apps/data-collector/package.json`
- Create: `apps/data-collector/data/grade_sources.json`

**Step 1: Install Anthropic SDK**

Run:
```bash
cd apps/data-collector && npm install @anthropic-ai/sdk
```

**Step 2: Create the grade sources config**

Create `apps/data-collector/data/grade_sources.json`:

```json
[
  {
    "source": "NFL.com",
    "slug": "nfl-com",
    "baseUrl": "https://www.nfl.com",
    "articles": {
      "2024": "https://www.nfl.com/news/2024-nfl-draft-grades-for-all-32-teams"
    }
  }
]
```

Start with one source to validate the pipeline end-to-end. More sources are added to this config file — no code changes needed.

**Step 3: Commit**

```bash
git add apps/data-collector/package.json apps/data-collector/package-lock.json apps/data-collector/data/grade_sources.json
git commit -m "feat: add Anthropic SDK and grade sources config"
```

---

### Task 2: Build the grade normalization and team matching utilities

**Files:**
- Create: `apps/data-collector/grades-utils.js`
- Create: `apps/data-collector/test/grades-utils.test.js`

**Step 1: Write failing tests for grade normalization**

Create `apps/data-collector/test/grades-utils.test.js`:

```javascript
const { gradeToNumeric, normalizeTeamName, GRADE_MAP } = require('../grades-utils');

describe('gradeToNumeric', () => {
  it('should convert standard letter grades', () => {
    expect(gradeToNumeric('A+')).toBe(4.3);
    expect(gradeToNumeric('A')).toBe(4.0);
    expect(gradeToNumeric('A-')).toBe(3.7);
    expect(gradeToNumeric('B+')).toBe(3.3);
    expect(gradeToNumeric('B')).toBe(3.0);
    expect(gradeToNumeric('B-')).toBe(2.7);
    expect(gradeToNumeric('C+')).toBe(2.3);
    expect(gradeToNumeric('C')).toBe(2.0);
    expect(gradeToNumeric('C-')).toBe(1.7);
    expect(gradeToNumeric('D+')).toBe(1.3);
    expect(gradeToNumeric('D')).toBe(1.0);
    expect(gradeToNumeric('D-')).toBe(0.7);
    expect(gradeToNumeric('F')).toBe(0.0);
  });

  it('should handle whitespace and case variations', () => {
    expect(gradeToNumeric(' A+ ')).toBe(4.3);
    expect(gradeToNumeric('a-')).toBe(3.7);
    expect(gradeToNumeric('b+')).toBe(3.3);
  });

  it('should return null for unknown grades', () => {
    expect(gradeToNumeric('Incomplete')).toBeNull();
    expect(gradeToNumeric('N/A')).toBeNull();
    expect(gradeToNumeric('')).toBeNull();
  });
});

describe('normalizeTeamName', () => {
  it('should return known team names unchanged', () => {
    expect(normalizeTeamName('Chicago Bears')).toBe('Chicago Bears');
    expect(normalizeTeamName('Arizona Cardinals')).toBe('Arizona Cardinals');
  });

  it('should map historical team names', () => {
    expect(normalizeTeamName('Washington Redskins')).toBe('Washington Commanders');
    expect(normalizeTeamName('Oakland Raiders')).toBe('Las Vegas Raiders');
    expect(normalizeTeamName('San Diego Chargers')).toBe('Los Angeles Chargers');
    expect(normalizeTeamName('St. Louis Rams')).toBe('Los Angeles Rams');
  });

  it('should trim whitespace', () => {
    expect(normalizeTeamName('  Chicago Bears  ')).toBe('Chicago Bears');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd apps/data-collector && npx jest test/grades-utils.test.js`
Expected: FAIL — module not found

**Step 3: Implement the utilities**

Create `apps/data-collector/grades-utils.js`:

```javascript
const GRADE_MAP = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};

// Same mapping as process_data.js and seed-draft-classes.ts
const OLD_TEAM_NAMES = {
  'Washington Football Team': 'Washington Commanders',
  'Washington Redskins': 'Washington Commanders',
  'San Diego Chargers': 'Los Angeles Chargers',
  'St. Louis Rams': 'Los Angeles Rams',
  'Saint Louis Rams': 'Los Angeles Rams',
  'Oakland Raiders': 'Las Vegas Raiders',
};

function gradeToNumeric(grade) {
  if (!grade || typeof grade !== 'string') return null;
  const normalized = grade.trim().toUpperCase();
  return GRADE_MAP[normalized] ?? null;
}

function normalizeTeamName(name) {
  if (!name || typeof name !== 'string') return name;
  const trimmed = name.trim();
  return OLD_TEAM_NAMES[trimmed] ?? trimmed;
}

module.exports = { gradeToNumeric, normalizeTeamName, GRADE_MAP, OLD_TEAM_NAMES };
```

**Step 4: Run tests to verify they pass**

Run: `cd apps/data-collector && npx jest test/grades-utils.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/data-collector/grades-utils.js apps/data-collector/test/grades-utils.test.js
git commit -m "feat: add grade normalization and team name utilities with tests"
```

---

### Task 3: Build the HTML cleaning function

**Files:**
- Create: `apps/data-collector/html-cleaner.js`
- Create: `apps/data-collector/test/html-cleaner.test.js`

**Step 1: Write failing tests**

Create `apps/data-collector/test/html-cleaner.test.js`:

```javascript
const { cleanHtml } = require('../html-cleaner');

describe('cleanHtml', () => {
  it('should strip script tags', () => {
    const html = '<div><p>Content</p><script>alert("x")</script></div>';
    const result = cleanHtml(html);
    expect(result).not.toContain('<script');
    expect(result).toContain('Content');
  });

  it('should strip nav, footer, aside, header elements', () => {
    const html = `
      <nav>Nav stuff</nav>
      <header>Header stuff</header>
      <main><article><p>Grade: A+</p></article></main>
      <aside>Sidebar</aside>
      <footer>Footer stuff</footer>
    `;
    const result = cleanHtml(html);
    expect(result).not.toContain('Nav stuff');
    expect(result).not.toContain('Header stuff');
    expect(result).not.toContain('Sidebar');
    expect(result).not.toContain('Footer stuff');
    expect(result).toContain('Grade: A+');
  });

  it('should strip style tags', () => {
    const html = '<div><style>.foo{color:red}</style><p>Content</p></div>';
    const result = cleanHtml(html);
    expect(result).not.toContain('<style');
    expect(result).toContain('Content');
  });

  it('should strip ad-related elements by common class names', () => {
    const html = `
      <div class="ad-container">Buy stuff</div>
      <div class="advertisement">More ads</div>
      <div class="article-body"><p>Real content</p></div>
    `;
    const result = cleanHtml(html);
    expect(result).not.toContain('Buy stuff');
    expect(result).toContain('Real content');
  });

  it('should return the cleaned HTML string', () => {
    const html = '<html><body><main><p>Hello</p></main></body></html>';
    const result = cleanHtml(html);
    expect(typeof result).toBe('string');
    expect(result).toContain('Hello');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd apps/data-collector && npx jest test/html-cleaner.test.js`
Expected: FAIL

**Step 3: Implement the HTML cleaner**

Create `apps/data-collector/html-cleaner.js`:

```javascript
const { load } = require('cheerio');

const ELEMENTS_TO_REMOVE = [
  'script', 'style', 'nav', 'footer', 'aside', 'header',
  'noscript', 'iframe', 'svg', 'form',
];

const AD_CLASS_PATTERNS = [
  /\bad[-_]?\b/i,
  /\badvertis/i,
  /\bsponsored\b/i,
  /\bpromo\b/i,
  /\bsidebar\b/i,
  /\bpopup\b/i,
  /\bmodal\b/i,
  /\bcookie/i,
  /\bbanner\b/i,
];

function cleanHtml(rawHtml) {
  const $ = load(rawHtml);

  // Remove unwanted elements
  ELEMENTS_TO_REMOVE.forEach((tag) => $(tag).remove());

  // Remove elements with ad-related class names
  $('[class]').each((_, el) => {
    const className = $(el).attr('class') || '';
    if (AD_CLASS_PATTERNS.some((pattern) => pattern.test(className))) {
      $(el).remove();
    }
  });

  // Return cleaned HTML body content
  return $('body').html() || $.html();
}

module.exports = { cleanHtml };
```

**Step 4: Run tests to verify they pass**

Run: `cd apps/data-collector && npx jest test/html-cleaner.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/data-collector/html-cleaner.js apps/data-collector/test/html-cleaner.test.js
git commit -m "feat: add HTML cleaner for stripping non-content elements"
```

---

### Task 4: Build the Haiku extraction module

**Files:**
- Create: `apps/data-collector/extract-grades.js`
- Create: `apps/data-collector/test/extract-grades.test.js`

This is the core module that calls Claude Haiku with a tool_use schema to extract structured grade data from article HTML.

**Step 1: Write failing tests**

Create `apps/data-collector/test/extract-grades.test.js`:

```javascript
const { buildExtractionMessages, parseToolResponse, EXTRACTION_TOOL } = require('../extract-grades');

describe('EXTRACTION_TOOL', () => {
  it('should define the extract_draft_grades tool with required schema', () => {
    expect(EXTRACTION_TOOL.name).toBe('extract_draft_grades');
    expect(EXTRACTION_TOOL.input_schema.properties.grades).toBeDefined();
    expect(EXTRACTION_TOOL.input_schema.properties.grades.type).toBe('array');
  });
});

describe('buildExtractionMessages', () => {
  it('should include the HTML content in the user message', () => {
    const messages = buildExtractionMessages('<p>Bears: A+</p>');
    expect(messages[0].role).toBe('user');
    expect(messages[0].content).toContain('<p>Bears: A+</p>');
  });
});

describe('parseToolResponse', () => {
  it('should extract grades from a valid tool_use response', () => {
    const response = {
      content: [
        {
          type: 'tool_use',
          name: 'extract_draft_grades',
          input: {
            grades: [
              { teamName: 'Chicago Bears', grade: 'A-', rawText: 'Good draft', playerGrades: [] },
            ],
          },
        },
      ],
    };
    const result = parseToolResponse(response);
    expect(result).toHaveLength(1);
    expect(result[0].teamName).toBe('Chicago Bears');
    expect(result[0].grade).toBe('A-');
  });

  it('should return empty array if no tool_use block found', () => {
    const response = { content: [{ type: 'text', text: 'No grades found' }] };
    const result = parseToolResponse(response);
    expect(result).toEqual([]);
  });

  it('should handle missing playerGrades gracefully', () => {
    const response = {
      content: [
        {
          type: 'tool_use',
          name: 'extract_draft_grades',
          input: {
            grades: [{ teamName: 'Chicago Bears', grade: 'B+' }],
          },
        },
      ],
    };
    const result = parseToolResponse(response);
    expect(result[0].playerGrades).toEqual([]);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd apps/data-collector && npx jest test/extract-grades.test.js`
Expected: FAIL

**Step 3: Implement the extraction module**

Create `apps/data-collector/extract-grades.js`:

```javascript
const Anthropic = require('@anthropic-ai/sdk').default;

const EXTRACTION_TOOL = {
  name: 'extract_draft_grades',
  description: 'Extract NFL draft class grades from an article. Return one entry per team found in the article.',
  input_schema: {
    type: 'object',
    properties: {
      grades: {
        type: 'array',
        description: 'Array of team draft grades extracted from the article',
        items: {
          type: 'object',
          properties: {
            teamName: {
              type: 'string',
              description: 'Full NFL team name (e.g. "Chicago Bears", "New England Patriots")',
            },
            grade: {
              type: 'string',
              description: 'Letter grade exactly as written in the article (e.g. "A-", "B+", "C")',
            },
            rawText: {
              type: 'string',
              description: 'The verbatim analysis paragraph for this team, copied from the article',
            },
            playerGrades: {
              type: 'array',
              description: 'Individual player/pick grades if the article provides them',
              items: {
                type: 'object',
                properties: {
                  playerName: {
                    type: 'string',
                    description: 'Full player name as written in the article',
                  },
                  grade: {
                    type: 'string',
                    description: 'Letter grade for this pick (e.g. "A", "B-")',
                  },
                  rawText: {
                    type: 'string',
                    description: 'Verbatim analysis text for this individual pick',
                  },
                },
                required: ['playerName', 'grade'],
              },
            },
          },
          required: ['teamName', 'grade'],
        },
      },
    },
    required: ['grades'],
  },
};

const SYSTEM_PROMPT = `You are a data extraction assistant. You will receive the HTML content of an NFL draft grades article from a sports publication. Your job is to extract every team's draft class grade from the article.

Instructions:
- Extract the full NFL team name (e.g. "Chicago Bears", not just "Bears")
- Extract the letter grade exactly as written (e.g. "A-", "B+", "C")
- Copy the analysis text verbatim for each team — do not summarize or rephrase
- If the article grades individual picks/players within each team section, extract those too
- If no individual player grades exist, return an empty playerGrades array
- Only extract data that is explicitly present in the article`;

function buildExtractionMessages(cleanedHtml) {
  return [
    {
      role: 'user',
      content: `Extract all NFL draft class grades from the following article HTML:\n\n${cleanedHtml}`,
    },
  ];
}

function parseToolResponse(response) {
  const toolUseBlock = response.content.find(
    (block) => block.type === 'tool_use' && block.name === 'extract_draft_grades'
  );

  if (!toolUseBlock) {
    return [];
  }

  const grades = toolUseBlock.input.grades || [];
  return grades.map((entry) => ({
    teamName: entry.teamName,
    grade: entry.grade,
    rawText: entry.rawText || '',
    playerGrades: (entry.playerGrades || []).map((pg) => ({
      playerName: pg.playerName,
      grade: pg.grade,
      rawText: pg.rawText || '',
    })),
  }));
}

async function extractGradesFromHtml(cleanedHtml) {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-haiku-4-20250414',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: buildExtractionMessages(cleanedHtml),
    tools: [EXTRACTION_TOOL],
    tool_choice: { type: 'tool', name: 'extract_draft_grades' },
  });

  return parseToolResponse(response);
}

module.exports = {
  EXTRACTION_TOOL,
  SYSTEM_PROMPT,
  buildExtractionMessages,
  parseToolResponse,
  extractGradesFromHtml,
};
```

**Note on model:** Use `claude-haiku-4-20250414` (Claude 4 Haiku). Check `@anthropic-ai/sdk` docs if the model string format has changed. The key constraint is using the cheapest/fastest model that handles structured extraction well.

**Step 4: Run tests to verify they pass**

Run: `cd apps/data-collector && npx jest test/extract-grades.test.js`
Expected: PASS (these tests don't call the API — they test message building and response parsing)

**Step 5: Commit**

```bash
git add apps/data-collector/extract-grades.js apps/data-collector/test/extract-grades.test.js
git commit -m "feat: add Haiku extraction module with tool_use schema"
```

---

### Task 5: Build the main `collect-grades.js` orchestrator

**Files:**
- Create: `apps/data-collector/collect-grades.js`

This is the CLI entry point that ties everything together.

**Step 1: Implement the orchestrator**

Create `apps/data-collector/collect-grades.js`:

```javascript
const { readFile, writeFile, mkdir } = require('fs').promises;
const path = require('path');
const { cleanHtml } = require('./html-cleaner');
const { extractGradesFromHtml } = require('./extract-grades');
const { gradeToNumeric, normalizeTeamName } = require('./grades-utils');

const REQUEST_DELAY = 1000;
const MAX_RETRIES = 3;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MockMyDraft-DataCollector/1.0 (draft grades research)',
        },
      });

      if (response.status === 429 || response.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`  HTTP ${response.status} — retrying in ${delay}ms (attempt ${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`  Fetch error — retrying in ${delay}ms: ${error.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function collectGradesForYear(year, sources) {
  const allGrades = [];

  for (const source of sources) {
    const articleUrl = source.articles[String(year)];
    if (!articleUrl) {
      console.log(`  No ${year} article URL for ${source.source}, skipping.`);
      continue;
    }

    console.log(`\n--- ${source.source}: ${year} ---`);
    console.log(`  Fetching: ${articleUrl}`);

    try {
      const rawHtml = await fetchWithRetry(articleUrl);
      console.log(`  Fetched ${rawHtml.length} bytes`);

      const cleaned = cleanHtml(rawHtml);
      console.log(`  Cleaned to ${cleaned.length} bytes`);

      console.log(`  Sending to Haiku for extraction...`);
      const extracted = await extractGradesFromHtml(cleaned);
      console.log(`  Extracted ${extracted.length} team grades`);

      if (extracted.length < 20) {
        console.warn(`  WARNING: Only ${extracted.length} teams found — article may be partial`);
      }

      // Save raw Haiku response for debugging
      const debugDir = path.join(__dirname, 'data', 'debug');
      await mkdir(debugDir, { recursive: true });
      const debugPath = path.join(debugDir, `${year}_${source.slug}_raw.json`);
      await writeFile(debugPath, JSON.stringify(extracted, null, 2));
      console.log(`  Debug output: ${debugPath}`);

      // Normalize and format
      for (const entry of extracted) {
        const teamName = normalizeTeamName(entry.teamName);
        const gradeNumeric = gradeToNumeric(entry.grade);

        if (gradeNumeric === null) {
          console.warn(`  Unknown grade "${entry.grade}" for ${teamName}, skipping`);
          continue;
        }

        const gradeEntry = {
          teamName,
          year,
          grade: entry.grade.trim().toUpperCase(),
          gradeNumeric,
          text: entry.rawText || null,
          sourceName: source.source,
          sourceUrl: articleUrl,
          playerGrades: (entry.playerGrades || [])
            .map((pg) => {
              const pgNumeric = gradeToNumeric(pg.grade);
              if (pgNumeric === null) {
                console.warn(`    Unknown player grade "${pg.grade}" for ${pg.playerName}, skipping`);
                return null;
              }
              return {
                playerName: pg.playerName,
                grade: pg.grade.trim().toUpperCase(),
                gradeNumeric: pgNumeric,
                text: pg.rawText || null,
              };
            })
            .filter(Boolean),
        };

        allGrades.push(gradeEntry);
      }
    } catch (error) {
      console.error(`  FAILED for ${source.source}: ${error.message}`);
    }

    // Polite delay between sources
    await new Promise((r) => setTimeout(r, REQUEST_DELAY));
  }

  return allGrades;
}

async function main() {
  const year = parseInt(process.argv[2], 10) || new Date().getFullYear();
  console.log(`\n=== Collecting Draft Class Grades for ${year} ===\n`);

  const sourcesPath = path.join(__dirname, 'data', 'grade_sources.json');
  const sourcesRaw = await readFile(sourcesPath, 'utf-8');
  const sources = JSON.parse(sourcesRaw);
  console.log(`Loaded ${sources.length} source(s) from grade_sources.json`);

  const grades = await collectGradesForYear(year, sources);
  console.log(`\n=== Results ===`);
  console.log(`Total grade entries: ${grades.length}`);

  const outputPath = path.join(__dirname, 'data', `${year}_draft_class_grades.json`);
  await writeFile(outputPath, JSON.stringify(grades, null, 2));
  console.log(`Written to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Grade collection failed:', error);
  process.exit(1);
});
```

**Step 2: Smoke test with a dry run**

Before running against a real URL, verify the script loads config and handles a missing year:

Run: `cd apps/data-collector && node collect-grades.js 2023`
Expected: Loads config, logs "No 2023 article URL for NFL.com, skipping", writes empty JSON

**Step 3: Commit**

```bash
git add apps/data-collector/collect-grades.js
git commit -m "feat: add collect-grades orchestrator script"
```

---

### Task 6: End-to-end test with a real article

**This task requires `ANTHROPIC_API_KEY` to be set in the environment.**

**Step 1: Find a working draft grades article URL**

Search for a 2024 NFL draft grades article from NFL.com, ESPN, or another major sports publication. Update `grade_sources.json` with a real, working URL.

**Step 2: Run the full pipeline**

Run: `cd apps/data-collector && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2024`

Expected output:
- Fetches the article HTML
- Cleans it
- Sends to Haiku
- Extracts ~32 team grades (may be fewer if article is partial)
- Writes `2024_draft_class_grades.json` with real data
- Writes debug output to `data/debug/2024_*_raw.json`

**Step 3: Validate the output**

Check `apps/data-collector/data/2024_draft_class_grades.json`:
- Each entry has `teamName`, `year`, `grade`, `gradeNumeric`, `text`, `sourceName`, `sourceUrl`
- Team names match the format in `teams.json` (e.g., "Chicago Bears", not "Bears")
- Grades are valid letter grades with correct numeric values
- `text` contains actual analysis content (not empty or garbage)

**Step 4: Commit the output data (not debug files)**

```bash
echo "data/debug/" >> apps/data-collector/.gitignore
git add apps/data-collector/data/2024_draft_class_grades.json apps/data-collector/data/grade_sources.json apps/data-collector/.gitignore
git commit -m "feat: collect 2024 draft class grades from real article"
```

---

### Task 7: Update `seed-draft-class-grades` for multi-source support

**Files:**
- Modify: `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts`
- Modify: `apps/draft-api/src/commands/seed.ts` (add 'player-grades' step)
- Test: `apps/draft-api/test/unit/commands/seed-draft-class-grades.test.ts`

**Step 1: Write failing tests for updated seed step**

Create `apps/draft-api/test/unit/commands/seed-draft-class-grades.test.ts`:

```typescript
import { seedDraftClassGrades } from '../../../src/commands/seed-steps/seed-draft-class-grades';
import { AppDataSource } from '../../../src/database';
import { promises as fs } from 'fs';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('fs', () => {
  const actualFs = jest.requireActual<typeof import('fs')>('fs');
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      readFile: jest.fn(),
    },
  };
});

const sampleGrades = [
  {
    teamName: 'Chicago Bears',
    year: 2024,
    grade: 'A-',
    gradeNumeric: 3.7,
    text: 'Great draft class',
    sourceName: 'ESPN',
    sourceUrl: 'https://espn.com/draft-grades-2024',
  },
  {
    teamName: 'Buffalo Bills',
    year: 2024,
    grade: 'B+',
    gradeNumeric: 3.3,
    text: 'Solid picks',
    sourceName: 'ESPN',
    sourceUrl: 'https://espn.com/draft-grades-2024',
  },
];

describe('seedDraftClassGrades', () => {
  const mockTeamRepo = { find: jest.fn() };
  const mockGradeRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
  const mockSourceRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
  const mockSourceArticleRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
      const name = typeof entity === 'function' ? entity.name : entity;
      switch (name) {
        case 'Team': return mockTeamRepo;
        case 'DraftClassGrade': return mockGradeRepo;
        case 'Source': return mockSourceRepo;
        case 'SourceArticle': return mockSourceArticleRepo;
        default: return {};
      }
    });

    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(sampleGrades));
    mockTeamRepo.find.mockResolvedValue([
      { id: 'team-1', name: 'Chicago Bears' },
      { id: 'team-2', name: 'Buffalo Bills' },
    ]);
    mockSourceRepo.findOne.mockResolvedValue(null);
    mockSourceRepo.create.mockImplementation((d: any) => ({ id: 'src-1', ...d }));
    mockSourceRepo.save.mockImplementation((d: any) => Promise.resolve(d));
    mockSourceArticleRepo.findOne.mockResolvedValue(null);
    mockSourceArticleRepo.create.mockImplementation((d: any) => ({ id: 'sa-1', ...d }));
    mockSourceArticleRepo.save.mockImplementation((d: any) => Promise.resolve(d));
    mockGradeRepo.findOne.mockResolvedValue(null);
    mockGradeRepo.create.mockImplementation((d: any) => d);
    mockGradeRepo.save.mockImplementation((d: any) => Promise.resolve(d));
  });

  it('should create grades with source article linkage', async () => {
    const result = await seedDraftClassGrades(2024);
    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);
    expect(mockGradeRepo.create).toHaveBeenCalledTimes(2);
    // Verify sourceArticle is set on created grades
    const firstCreateCall = mockGradeRepo.create.mock.calls[0][0];
    expect(firstCreateCall.sourceArticle).toBeDefined();
    expect(firstCreateCall.sourceArticle.id).toBe('sa-1');
  });

  it('should skip when no grades file exists', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));
    const result = await seedDraftClassGrades(2024);
    expect(result.skipped).toBe(1);
    expect(result.success).toBe(0);
  });

  it('should skip duplicate grades (same team + year + source)', async () => {
    mockGradeRepo.findOne.mockResolvedValue({ id: 'existing-grade' });
    const result = await seedDraftClassGrades(2024);
    expect(result.skipped).toBe(2);
    expect(result.success).toBe(0);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx nx test draft-api -- --testPathPattern=seed-draft-class-grades`
Expected: FAIL — tests reference new behavior not yet implemented

**Step 3: Update seed-draft-class-grades.ts**

Modify `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';
import { DraftClassGrade } from '../../database/models/draft-class-grade';
import { Source } from '../../database/models/source';
import { SourceArticle } from '../../database/models/source-article';
import { SeedResult } from '../seed';

type GradeEntry = {
  teamName: string;
  year: number;
  grade: string;
  gradeNumeric: number;
  text?: string;
  sourceName?: string;
  sourceUrl?: string;
  playerGrades?: PlayerGradeEntry[];
};

type PlayerGradeEntry = {
  playerName: string;
  grade: string;
  gradeNumeric: number;
  text?: string;
};

export async function seedDraftClassGrades(
  year: number,
): Promise<SeedResult> {
  const teamRepository = AppDataSource.getRepository(Team);
  const gradeRepository = AppDataSource.getRepository(DraftClassGrade);
  const sourceRepository = AppDataSource.getRepository(Source);
  const sourceArticleRepository = AppDataSource.getRepository(SourceArticle);

  const filePath = path.resolve(
    process.cwd(),
    'apps',
    'data-collector',
    'data',
    `${year}_draft_class_grades.json`,
  );

  let rawData: string;
  try {
    rawData = await fs.readFile(filePath, 'utf-8');
  } catch {
    console.log(`  No grades file found for ${year}, skipping.`);
    return { step: 'grades', success: 0, failed: 0, skipped: 1 };
  }

  const grades: GradeEntry[] = JSON.parse(rawData);

  if (grades.length === 0) {
    console.log(`  Grades file for ${year} is empty, skipping.`);
    return { step: 'grades', success: 0, failed: 0, skipped: 1 };
  }

  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const team of allTeams) {
    teamByName.set(team.name, team);
  }

  // Cache sources and source articles to avoid duplicate lookups
  const sourceCache = new Map<string, Source>();
  const articleCache = new Map<string, SourceArticle>();

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const entry of grades) {
    try {
      const team = teamByName.get(entry.teamName);
      if (!team) {
        console.error(`  Team not found: ${entry.teamName}`);
        failed++;
        continue;
      }

      // Resolve source article if source info is present
      let sourceArticle: SourceArticle | undefined;
      if (entry.sourceName && entry.sourceUrl) {
        sourceArticle = await resolveSourceArticle({
          sourceName: entry.sourceName,
          sourceUrl: entry.sourceUrl,
          year,
          sourceRepository,
          sourceArticleRepository,
          sourceCache,
          articleCache,
        });
      }

      // Check uniqueness: year + team + sourceArticle (or just year + team if no source)
      const whereClause: Record<string, unknown> = {
        year: entry.year,
        team: { id: team.id },
      };
      if (sourceArticle) {
        whereClause.sourceArticle = { id: sourceArticle.id };
      }

      const existing = await gradeRepository.findOne({ where: whereClause });
      if (existing) {
        console.log(
          `  Skipping grade for ${entry.teamName} ${entry.year}${entry.sourceName ? ` (${entry.sourceName})` : ''} (exists)`,
        );
        skipped++;
        continue;
      }

      const grade = gradeRepository.create({
        team,
        year: entry.year,
        grade: entry.grade,
        gradeNumeric: entry.gradeNumeric,
        text: entry.text ?? null,
        sourceArticle: sourceArticle ?? undefined,
      });

      await gradeRepository.save(grade);
      console.log(`  Created grade for ${entry.teamName}: ${entry.grade}${entry.sourceName ? ` (${entry.sourceName})` : ''}`);
      success++;
    } catch (error) {
      console.error(
        `  Failed to create grade for ${entry.teamName}:`,
        error instanceof Error ? error.message : String(error),
      );
      failed++;
    }
  }

  return { step: 'grades', success, failed, skipped };
}

async function resolveSourceArticle({
  sourceName,
  sourceUrl,
  year,
  sourceRepository,
  sourceArticleRepository,
  sourceCache,
  articleCache,
}: {
  sourceName: string;
  sourceUrl: string;
  year: number;
  sourceRepository: ReturnType<typeof AppDataSource.getRepository<Source>>;
  sourceArticleRepository: ReturnType<typeof AppDataSource.getRepository<SourceArticle>>;
  sourceCache: Map<string, Source>;
  articleCache: Map<string, SourceArticle>;
}): Promise<SourceArticle> {
  // Check article cache first
  const articleKey = `${sourceName}:${sourceUrl}`;
  if (articleCache.has(articleKey)) {
    return articleCache.get(articleKey)!;
  }

  // Resolve or create source
  let source = sourceCache.get(sourceName);
  if (!source) {
    source = await sourceRepository.findOne({ where: { name: sourceName } }) ?? undefined;
    if (!source) {
      const slug = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const baseUrl = new URL(sourceUrl).origin;
      source = sourceRepository.create({ name: sourceName, slug, baseUrl });
      source = await sourceRepository.save(source);
    }
    sourceCache.set(sourceName, source);
  }

  // Resolve or create source article
  let article = await sourceArticleRepository.findOne({
    where: { url: sourceUrl, year },
  }) ?? undefined;

  if (!article) {
    article = sourceArticleRepository.create({
      source,
      year,
      title: `${sourceName} ${year} NFL Draft Grades`,
      url: sourceUrl,
    });
    article = await sourceArticleRepository.save(article);
  }

  articleCache.set(articleKey, article);
  return article;
}
```

**Step 4: Run tests to verify they pass**

Run: `npx nx test draft-api -- --testPathPattern=seed-draft-class-grades`
Expected: PASS

**Step 5: Run full test suite**

Run: `npx nx test draft-api`
Expected: All tests pass (existing + new)

**Step 6: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts apps/draft-api/test/unit/commands/seed-draft-class-grades.test.ts
git commit -m "feat: update seed-draft-class-grades for multi-source support"
```

---

### Task 8: Add player grades seed step

**Files:**
- Create: `apps/draft-api/src/commands/seed-steps/seed-player-grades.ts`
- Modify: `apps/draft-api/src/commands/seed.ts` (register new step)
- Create: `apps/draft-api/test/unit/commands/seed-player-grades.test.ts`

**Step 1: Write failing tests**

Create `apps/draft-api/test/unit/commands/seed-player-grades.test.ts`:

```typescript
import { seedPlayerGrades } from '../../../src/commands/seed-steps/seed-player-grades';
import { AppDataSource } from '../../../src/database';
import { promises as fs } from 'fs';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('fs', () => {
  const actualFs = jest.requireActual<typeof import('fs')>('fs');
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      readFile: jest.fn(),
    },
  };
});

const sampleGrades = [
  {
    teamName: 'Chicago Bears',
    year: 2024,
    grade: 'A-',
    gradeNumeric: 3.7,
    text: 'Great draft',
    sourceName: 'ESPN',
    sourceUrl: 'https://espn.com/grades',
    playerGrades: [
      { playerName: 'Caleb Williams', grade: 'A', gradeNumeric: 4.0, text: 'Franchise QB' },
    ],
  },
];

describe('seedPlayerGrades', () => {
  const mockPlayerRepo = { find: jest.fn() };
  const mockTeamRepo = { find: jest.fn() };
  const mockDraftPickRepo = { findOne: jest.fn() };
  const mockPlayerGradeRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
  const mockSourceArticleRepo = { findOne: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
      const name = typeof entity === 'function' ? entity.name : entity;
      switch (name) {
        case 'Player': return mockPlayerRepo;
        case 'Team': return mockTeamRepo;
        case 'DraftPick': return mockDraftPickRepo;
        case 'PlayerGrade': return mockPlayerGradeRepo;
        case 'SourceArticle': return mockSourceArticleRepo;
        default: return {};
      }
    });

    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(sampleGrades));
    mockTeamRepo.find.mockResolvedValue([{ id: 'team-1', name: 'Chicago Bears' }]);
    mockPlayerRepo.find.mockResolvedValue([
      { id: 'player-1', name: 'Caleb Williams', position: 'QB' },
    ]);
    mockDraftPickRepo.findOne.mockResolvedValue({ id: 'pick-1' });
    mockSourceArticleRepo.findOne.mockResolvedValue({ id: 'sa-1' });
    mockPlayerGradeRepo.findOne.mockResolvedValue(null);
    mockPlayerGradeRepo.create.mockImplementation((d: any) => d);
    mockPlayerGradeRepo.save.mockImplementation((d: any) => Promise.resolve(d));
  });

  it('should create player grades from grades file', async () => {
    const result = await seedPlayerGrades(2024);
    expect(result.success).toBe(1);
    expect(mockPlayerGradeRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should skip when no grades file exists', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));
    const result = await seedPlayerGrades(2024);
    expect(result.skipped).toBe(1);
  });

  it('should skip entries without playerGrades', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify([{ ...sampleGrades[0], playerGrades: [] }]),
    );
    const result = await seedPlayerGrades(2024);
    expect(result.success).toBe(0);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx nx test draft-api -- --testPathPattern=seed-player-grades`
Expected: FAIL

**Step 3: Implement seed-player-grades.ts**

Create `apps/draft-api/src/commands/seed-steps/seed-player-grades.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Player } from '../../database/models/player';
import { Team } from '../../database/models/team';
import { DraftPick } from '../../database/models/draft-pick';
import { PlayerGrade } from '../../database/models/player-grade';
import { SourceArticle } from '../../database/models/source-article';
import { SeedResult } from '../seed';

type GradeFileEntry = {
  teamName: string;
  year: number;
  sourceName?: string;
  sourceUrl?: string;
  playerGrades?: {
    playerName: string;
    grade: string;
    gradeNumeric: number;
    text?: string;
  }[];
};

export async function seedPlayerGrades(year: number): Promise<SeedResult> {
  const playerRepository = AppDataSource.getRepository(Player);
  const teamRepository = AppDataSource.getRepository(Team);
  const draftPickRepository = AppDataSource.getRepository(DraftPick);
  const playerGradeRepository = AppDataSource.getRepository(PlayerGrade);
  const sourceArticleRepository = AppDataSource.getRepository(SourceArticle);

  const filePath = path.resolve(
    process.cwd(),
    'apps',
    'data-collector',
    'data',
    `${year}_draft_class_grades.json`,
  );

  let rawData: string;
  try {
    rawData = await fs.readFile(filePath, 'utf-8');
  } catch {
    console.log(`  No grades file found for ${year}, skipping.`);
    return { step: 'player-grades', success: 0, failed: 0, skipped: 1 };
  }

  const entries: GradeFileEntry[] = JSON.parse(rawData);

  // Build lookups
  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const t of allTeams) teamByName.set(t.name, t);

  const allPlayers = await playerRepository.find();
  const playersByName = new Map<string, Player[]>();
  for (const p of allPlayers) {
    const list = playersByName.get(p.name) ?? [];
    list.push(p);
    playersByName.set(p.name, list);
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.playerGrades || entry.playerGrades.length === 0) continue;

    const team = teamByName.get(entry.teamName);
    if (!team) {
      console.warn(`  Team not found for player grades: ${entry.teamName}`);
      continue;
    }

    // Resolve source article
    let sourceArticle: SourceArticle | null = null;
    if (entry.sourceUrl) {
      sourceArticle = await sourceArticleRepository.findOne({
        where: { url: entry.sourceUrl, year },
      });
    }

    for (const pg of entry.playerGrades) {
      try {
        // Find player by name — use first match
        const candidates = playersByName.get(pg.playerName) ?? [];
        const player = candidates.length === 1
          ? candidates[0]
          : candidates.find((c) => c.position !== undefined) ?? candidates[0] ?? null;

        if (!player) {
          console.warn(`    Player not found: ${pg.playerName}`);
          failed++;
          continue;
        }

        // Find draft pick for this player in this year
        const draftPick = await draftPickRepository.findOne({
          where: { year, player: { id: player.id } },
        });

        // Check for existing player grade
        const existingWhere: Record<string, unknown> = {
          player: { id: player.id },
          team: { id: team.id },
        };
        if (sourceArticle) {
          existingWhere.sourceArticle = { id: sourceArticle.id };
        }

        const existing = await playerGradeRepository.findOne({ where: existingWhere });
        if (existing) {
          skipped++;
          continue;
        }

        const grade = playerGradeRepository.create({
          player,
          team,
          draftPick: draftPick ?? undefined,
          sourceArticle: sourceArticle ?? undefined,
          grade: pg.grade,
          gradeNumeric: pg.gradeNumeric,
          text: pg.text ?? null,
        });

        await playerGradeRepository.save(grade);
        success++;
      } catch (error) {
        console.error(
          `    Failed to create player grade for ${pg.playerName}:`,
          error instanceof Error ? error.message : String(error),
        );
        failed++;
      }
    }
  }

  console.log(
    `  Player grades: ${success} created, ${failed} failed, ${skipped} skipped`,
  );
  return { step: 'player-grades', success, failed, skipped };
}
```

**Step 4: Register the new step in seed.ts**

Modify `apps/draft-api/src/commands/seed.ts`:

Add import:
```typescript
import { seedPlayerGrades } from './seed-steps/seed-player-grades';
```

Update `StepName` type:
```typescript
type StepName = 'teams' | 'players' | 'draft-classes' | 'grades' | 'player-grades';
```

Update `VALID_STEPS`:
```typescript
const VALID_STEPS: StepName[] = ['teams', 'players', 'draft-classes', 'grades', 'player-grades'];
```

Update `allSteps`:
```typescript
const allSteps: StepName[] = ['teams', 'players', 'draft-classes', 'grades', 'player-grades'];
```

Add case in switch:
```typescript
case 'player-grades':
  result = await seedPlayerGrades(year);
  break;
```

**Step 5: Run tests**

Run: `npx nx test draft-api`
Expected: All tests pass

**Step 6: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-player-grades.ts apps/draft-api/src/commands/seed.ts apps/draft-api/test/unit/commands/seed-player-grades.test.ts
git commit -m "feat: add player grades seed step with source article linkage"
```

---

### Task 9: Add Jest config for data-collector tests

**Files:**
- Modify: `apps/data-collector/package.json`

The data-collector currently has no test runner. Add minimal Jest config so `npx jest` works.

**Step 1: Install Jest as dev dependency**

Run:
```bash
cd apps/data-collector && npm install --save-dev jest
```

**Step 2: Add test script to package.json**

Update `apps/data-collector/package.json` `scripts`:
```json
"scripts": {
  "test": "jest"
}
```

**Step 3: Run all data-collector tests**

Run: `cd apps/data-collector && npx jest`
Expected: All tests pass (grades-utils, html-cleaner, extract-grades)

**Step 4: Commit**

```bash
git add apps/data-collector/package.json apps/data-collector/package-lock.json
git commit -m "chore: add Jest config for data-collector tests"
```

**Note:** This task can be done earlier (before Task 2) if you want tests runnable from the start. Placed here because the install step is a one-time setup.

---

### Task 10: Integration test — full pipeline

**Step 1: Ensure database is running and seeded**

Run:
```bash
npx nx run draft-api:seed -- --year 2024
```

This ensures teams, players, and draft picks are in the database.

**Step 2: Run the grade collector**

Run:
```bash
cd apps/data-collector && ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY node collect-grades.js 2024
```

**Step 3: Seed grades into the database**

Run:
```bash
npx nx run draft-api:seed -- --step grades --year 2024
```

Expected: Creates draft class grade records with source article linkage.

**Step 4: Seed player grades**

Run:
```bash
npx nx run draft-api:seed -- --step player-grades --year 2024
```

Expected: Creates player grade records linked to players, draft picks, and source articles.

**Step 5: Verify idempotency**

Run both seed steps again. Expected: all entries skipped.

**Step 6: Commit any fixes discovered during integration**

```bash
git add -A
git commit -m "fix: resolve integration issues with grades pipeline"
```
