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
