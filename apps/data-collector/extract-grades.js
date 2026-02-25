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
    model: 'claude-haiku-4-5',
    max_tokens: 16384,
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
