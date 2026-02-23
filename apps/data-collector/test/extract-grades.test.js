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
