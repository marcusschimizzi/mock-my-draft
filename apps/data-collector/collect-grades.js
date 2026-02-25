const { readFile, writeFile, mkdir } = require('fs').promises;
const path = require('path');
const { cleanHtml } = require('./html-cleaner');
const { extractGradesFromHtml } = require('./extract-grades');
const { gradeToNumeric, normalizeTeamName } = require('./grades-utils');
const puppeteer = require('puppeteer');

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

async function fetchWithBrowser(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait a bit for any lazy-loaded content
    await new Promise((r) => setTimeout(r, 2000));

    const html = await page.content();
    return html;
  } finally {
    await browser.close();
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
    const fetchMethod = source.fetchMethod || 'fetch';
    if (fetchMethod === 'browser') {
      console.log(`  Using headless browser for JavaScript-rendered content`);
    }

    try {
      const rawHtml = fetchMethod === 'browser'
        ? await fetchWithBrowser(articleUrl)
        : await fetchWithRetry(articleUrl);
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
