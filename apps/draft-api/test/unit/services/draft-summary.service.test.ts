import { DraftSummaryService } from '../../../src/services/draft-summary.service';
import { AppDataSource } from '../../../src/database';
import { Team } from '../../../src/database/models/team';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Minimal shapes — only the fields the service/mapper read.
const buildTeam = (id: string, name: string) => ({
  id,
  name,
  abbreviation: name.slice(0, 3).toUpperCase(),
  logo: '',
  colors: [] as string[],
  conference: 'afc',
  division: 'north',
});

const buildGrade = (teamId: string, gradeNumeric: number) => ({
  id: `g-${teamId}-${gradeNumeric}`,
  grade: 'B',
  gradeNumeric,
  year: 2024,
  text: '',
  team: { id: teamId },
  sourceArticle: {
    id: 'a1',
    title: 'Article',
    url: 'https://example.com',
    source: { id: 's1', name: 'Source', slug: 'source' },
  },
});

describe('DraftSummaryService', () => {
  let teamRepository: { find: jest.Mock; findOneByOrFail: jest.Mock };
  let gradeRepository: { find: jest.Mock };

  beforeEach(() => {
    teamRepository = { find: jest.fn(), findOneByOrFail: jest.fn() };
    gradeRepository = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) =>
      entity === Team ? teamRepository : gradeRepository,
    );
  });

  describe('getDraftSummary', () => {
    it('returns averageGrade 0 (not NaN) for a team with no grades', async () => {
      teamRepository.find.mockResolvedValue([
        buildTeam('t1', 'Bears'),
        buildTeam('t2', 'Lions'),
      ]);
      gradeRepository.find.mockResolvedValue([
        buildGrade('t1', 8),
        buildGrade('t1', 6),
      ]);

      const result = await new DraftSummaryService().getDraftSummary(2024);

      const bears = result.teams.find((team) => team.team.id === 't1');
      const lions = result.teams.find((team) => team.team.id === 't2');
      expect(bears?.averageGrade).toBe(7);
      expect(lions?.averageGrade).toBe(0);
      expect(Number.isNaN(lions?.averageGrade)).toBe(false);
    });

    it('excludes ungraded teams from the league average', async () => {
      teamRepository.find.mockResolvedValue([
        buildTeam('t1', 'Bears'),
        buildTeam('t2', 'Lions'),
      ]);
      gradeRepository.find.mockResolvedValue([
        buildGrade('t1', 8),
        buildGrade('t1', 6),
      ]);

      const result = await new DraftSummaryService().getDraftSummary(2024);

      // League average is over graded teams only (Bears' 7), not (7 + 0) / 2.
      expect(result.averageGrade).toBe(7);
    });

    it('returns league averageGrade 0 when no grades exist at all', async () => {
      teamRepository.find.mockResolvedValue([buildTeam('t1', 'Bears')]);
      gradeRepository.find.mockResolvedValue([]);

      const result = await new DraftSummaryService().getDraftSummary(2024);

      expect(result.averageGrade).toBe(0);
      expect(result.teams[0].averageGrade).toBe(0);
    });
  });

  describe('getTeamDraftSummary', () => {
    it('returns averageGrade 0 for an ungraded team', async () => {
      teamRepository.findOneByOrFail.mockResolvedValue(buildTeam('t1', 'Bears'));
      gradeRepository.find.mockResolvedValue([]);

      const result = await new DraftSummaryService().getTeamDraftSummary(
        2024,
        'bears',
      );

      expect(result.averageGrade).toBe(0);
      expect(Number.isNaN(result.averageGrade)).toBe(false);
    });
  });
});
