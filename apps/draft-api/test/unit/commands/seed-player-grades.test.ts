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
