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
