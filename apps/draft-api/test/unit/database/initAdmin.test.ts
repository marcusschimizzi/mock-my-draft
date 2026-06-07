import { initAdmin } from '../../../src/database/utils/initAdmin';
import { UsersService } from '../../../src/services/users-service';

jest.mock('../../../src/services/users-service');

const mockUsersService = {
  getUserByUsername: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
} as unknown as jest.Mocked<UsersService>;

describe('initAdmin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    (UsersService as jest.Mock).mockImplementation(() => mockUsersService);
    process.env = {
      ...originalEnv,
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password123',
      ADMIN_EMAIL: 'admin@example.com',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates a new admin with isAdmin true', async () => {
    (mockUsersService.getUserByUsername as jest.Mock).mockResolvedValue(null);

    await initAdmin();

    expect(mockUsersService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'admin', isAdmin: true }),
    );
  });

  it('promotes an existing non-admin admin account', async () => {
    (mockUsersService.getUserByUsername as jest.Mock).mockResolvedValue({
      id: 'user-1',
      username: 'admin',
      isAdmin: false,
    });

    await initAdmin();

    expect(mockUsersService.updateUser).toHaveBeenCalledWith('user-1', {
      isAdmin: true,
    });
    expect(mockUsersService.createUser).not.toHaveBeenCalled();
  });

  it('leaves an existing admin untouched', async () => {
    (mockUsersService.getUserByUsername as jest.Mock).mockResolvedValue({
      id: 'user-1',
      username: 'admin',
      isAdmin: true,
    });

    await initAdmin();

    expect(mockUsersService.updateUser).not.toHaveBeenCalled();
    expect(mockUsersService.createUser).not.toHaveBeenCalled();
  });

  it('skips creation when admin env vars are missing', async () => {
    delete process.env.ADMIN_PASSWORD;

    await initAdmin();

    expect(mockUsersService.getUserByUsername).not.toHaveBeenCalled();
    expect(mockUsersService.createUser).not.toHaveBeenCalled();
  });
});
