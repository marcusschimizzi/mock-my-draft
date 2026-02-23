import { seedPlayers } from '../../../src/commands/seed-steps/seed-players';
import { DataImportService } from '../../../src/services/data-import-service';
import { DataVersionStatus } from '../../../src/database/models/data-version';

jest.mock('../../../src/services/data-import-service');

describe('seedPlayers', () => {
  const mockRunManualImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (DataImportService as jest.Mock).mockImplementation(() => ({
      runManualImport: mockRunManualImport,
    }));
  });

  it('should run a manual import and return success counts', async () => {
    mockRunManualImport.mockResolvedValue({
      dataVersionId: 'v1',
      status: DataVersionStatus.Published,
      playerCount: 257,
      rankingCount: 257,
    });

    const result = await seedPlayers(2024);

    expect(result.success).toBe(257);
    expect(result.failed).toBe(0);
  });

  it('should report failure when import fails', async () => {
    mockRunManualImport.mockResolvedValue({
      dataVersionId: 'v1',
      status: DataVersionStatus.Failed,
      playerCount: 0,
      rankingCount: 0,
      errorSummary: 'File not found',
    });

    const result = await seedPlayers(2024);

    expect(result.failed).toBe(1);
    expect(result.success).toBe(0);
  });
});
