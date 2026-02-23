import { seedDraftClasses } from '../../../src/commands/seed-steps/seed-draft-classes';
import { AppDataSource } from '../../../src/database';
import { Team } from '../../../src/database/models/team';
import { Player } from '../../../src/database/models/player';
import { DraftPick } from '../../../src/database/models/draft-pick';
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

const sampleDraftData = [
  {
    round: 1,
    pick: 1,
    team: 'Chicago Bears',
    position: 'QB',
    college: 'USC',
    player: 'Caleb Williams',
    playerDetails: { height: 73, weight: 215 },
  },
  {
    round: 1,
    pick: 2,
    team: 'Washington Commanders',
    position: 'QB',
    college: 'LSU',
    player: 'Jayden Daniels',
    playerDetails: { height: 76, weight: 210 },
  },
  {
    round: 1,
    pick: 3,
    team: 'New England Patriots',
    position: 'QB',
    college: 'North Carolina',
    player: 'Drake Maye',
    playerDetails: { height: 76, weight: 230 },
  },
];

const mockTeamBears = { id: 'team-1', name: 'Chicago Bears' } as Team;
const mockTeamCommanders = { id: 'team-2', name: 'Washington Commanders' } as Team;
const mockTeamPatriots = { id: 'team-3', name: 'New England Patriots' } as Team;

const allTeams = [mockTeamBears, mockTeamCommanders, mockTeamPatriots];

describe('seedDraftClasses', () => {
  const mockTeamRepo = {
    find: jest.fn(),
  };

  const mockPlayerRepo = {
    findOne: jest.fn(),
  };

  const mockDraftPickRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Team) return mockTeamRepo;
      if (entity === Player) return mockPlayerRepo;
      if (entity === DraftPick) return mockDraftPickRepo;
      return {};
    });
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify(sampleDraftData),
    );
    mockTeamRepo.find.mockResolvedValue(allTeams);
  });

  it('should create new picks when none exist', async () => {
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue({ id: 'player-1', name: 'Caleb Williams' });
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2024);

    expect(result.step).toBe('draft-classes');
    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);
    expect(result.skipped).toBe(0);
    expect(mockDraftPickRepo.create).toHaveBeenCalledTimes(3);
    expect(mockDraftPickRepo.save).toHaveBeenCalledTimes(3);

    // Verify the first create call has correct data
    expect(mockDraftPickRepo.create).toHaveBeenCalledWith({
      year: 2024,
      round: 1,
      pickNumber: 1,
      originalTeam: mockTeamBears,
      currentTeam: mockTeamBears,
      player: { id: 'player-1', name: 'Caleb Williams' },
    });
  });

  it('should skip picks that already exist', async () => {
    mockDraftPickRepo.findOne.mockResolvedValue({ id: 'existing-pick' });

    const result = await seedDraftClasses(2024);

    expect(result.skipped).toBe(3);
    expect(result.success).toBe(0);
    expect(result.failed).toBe(0);
    expect(mockDraftPickRepo.create).not.toHaveBeenCalled();
    expect(mockDraftPickRepo.save).not.toHaveBeenCalled();
  });

  it('should handle missing teams', async () => {
    // Only return Bears, so Commanders and Patriots are missing
    mockTeamRepo.find.mockResolvedValue([mockTeamBears]);
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue({ id: 'player-1' });
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2024);

    expect(result.success).toBe(1);
    expect(result.failed).toBe(2);
    expect(result.skipped).toBe(0);
  });

  it('should skip entries without a position (forfeited picks)', async () => {
    const dataWithForfeited = [
      ...sampleDraftData,
      {
        round: 2,
        pick: 35,
        team: 'Chicago Bears',
        position: '',
        college: '',
        player: '',
      },
    ];
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify(dataWithForfeited),
    );
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue({ id: 'player-1' });
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2024);

    expect(result.success).toBe(3);
    expect(result.skipped).toBe(1);
    expect(mockDraftPickRepo.create).toHaveBeenCalledTimes(3);
  });

  it('should resolve old team names to current names', async () => {
    const dataWithOldTeam = [
      {
        round: 1,
        pick: 1,
        team: 'Washington Redskins',
        position: 'QB',
        college: 'Baylor',
        player: 'Robert Griffin III',
      },
    ];
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify(dataWithOldTeam),
    );
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue({ id: 'player-rg3' });
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2012);

    expect(result.success).toBe(1);
    expect(mockDraftPickRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalTeam: mockTeamCommanders,
        currentTeam: mockTeamCommanders,
      }),
    );
  });

  it('should create pick without player when player is not found', async () => {
    const singleEntry = [sampleDraftData[0]];
    (fs.readFile as jest.Mock).mockResolvedValue(
      JSON.stringify(singleEntry),
    );
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue(null);
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2024);

    expect(result.success).toBe(1);
    expect(mockDraftPickRepo.create).toHaveBeenCalledWith({
      year: 2024,
      round: 1,
      pickNumber: 1,
      originalTeam: mockTeamBears,
      currentTeam: mockTeamBears,
      player: undefined,
    });
  });

  it('should return skip result when data file is not found', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(
      new Error('ENOENT: no such file or directory'),
    );

    const result = await seedDraftClasses(2025);

    expect(result.step).toBe('draft-classes');
    expect(result.success).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.skipped).toBe(1);
  });

  it('should handle save errors gracefully', async () => {
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockPlayerRepo.findOne.mockResolvedValue({ id: 'player-1' });
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockRejectedValue(new Error('DB constraint violation'));

    const result = await seedDraftClasses(2024);

    expect(result.failed).toBe(3);
    expect(result.success).toBe(0);
  });
});
