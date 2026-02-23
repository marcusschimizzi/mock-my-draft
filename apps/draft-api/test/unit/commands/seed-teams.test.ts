import { seedTeams } from '../../../src/commands/seed-steps/seed-teams';
import { AppDataSource } from '../../../src/database';
import { promises as fs } from 'fs';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('fs', () => {
  const actualFs =
    jest.requireActual<typeof import('fs')>('fs');
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      readFile: jest.fn(),
    },
  };
});

const sampleTeams = [
  {
    name: 'Arizona Cardinals',
    location: 'Arizona',
    nickname: 'Cardinals',
    abbreviation: 'ARI',
    slug: 'arizona-cardinals',
    conference: 'nfc',
    division: 'west',
    logo: 'https://static.www.nfl.com/league/api/clubs/logos/ARI.svg',
    colors: ['#97233F', '#000000', '#FFB612'],
  },
  {
    name: 'Buffalo Bills',
    location: 'Buffalo',
    nickname: 'Bills',
    abbreviation: 'BUF',
    slug: 'buffalo-bills',
    conference: 'afc',
    division: 'east',
    logo: 'https://static.www.nfl.com/league/api/clubs/logos/BUF.svg',
    colors: ['#00338D', '#C60C30'],
  },
];

describe('seedTeams', () => {
  const mockTeamRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockTeamRepo);
    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(sampleTeams));
  });

  it('should create new teams when they do not exist', async () => {
    mockTeamRepo.findOne.mockResolvedValue(null);
    mockTeamRepo.create.mockImplementation((data) => data);
    mockTeamRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedTeams();

    expect(result.step).toBe('teams');
    expect(result.success).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.skipped).toBe(0);
    expect(mockTeamRepo.create).toHaveBeenCalledTimes(2);
    expect(mockTeamRepo.save).toHaveBeenCalledTimes(2);
  });

  it('should skip teams that already exist', async () => {
    mockTeamRepo.findOne.mockResolvedValue({
      id: '1',
      slug: 'arizona-cardinals',
    });
    mockTeamRepo.merge.mockImplementation((existing, data) => ({
      ...existing,
      ...data,
    }));
    mockTeamRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedTeams();

    expect(result.skipped).toBe(2);
    expect(result.success).toBe(0);
    expect(mockTeamRepo.create).not.toHaveBeenCalled();
  });

  it('should handle a mix of new and existing teams', async () => {
    mockTeamRepo.findOne
      .mockResolvedValueOnce({ id: '1', slug: 'arizona-cardinals' })
      .mockResolvedValueOnce(null);
    mockTeamRepo.create.mockImplementation((data) => data);
    mockTeamRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedTeams();

    expect(result.success).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.failed).toBe(0);
  });

  it('should count failed teams when save throws', async () => {
    mockTeamRepo.findOne.mockResolvedValue(null);
    mockTeamRepo.create.mockImplementation((data) => data);
    mockTeamRepo.save.mockRejectedValue(new Error('DB constraint violation'));

    const result = await seedTeams();

    expect(result.failed).toBe(2);
    expect(result.success).toBe(0);
  });
});
