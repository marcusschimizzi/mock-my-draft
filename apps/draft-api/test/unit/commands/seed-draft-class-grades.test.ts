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
