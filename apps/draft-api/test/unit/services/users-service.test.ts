import { UsersService } from '../../../src/services/users-service';
import { AppDataSource } from '../../../src/database';
import bcrypt from 'bcrypt';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));
jest.mock('bcrypt');

describe('UsersService.createUser', () => {
  let repository: { save: jest.Mock };

  beforeEach(() => {
    repository = { save: jest.fn((user) => Promise.resolve(user)) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(repository);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
  });

  it('persists isAdmin when it is provided', async () => {
    const user = await new UsersService().createUser({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true,
    });

    expect(user.isAdmin).toBe(true);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: true, password: 'hashed-password' }),
    );
  });

  it('defaults isAdmin to false when omitted', async () => {
    const user = await new UsersService().createUser({
      username: 'regular',
      email: 'regular@example.com',
      password: 'password123',
    });

    expect(user.isAdmin).toBe(false);
  });

  it('throws when required fields are missing', async () => {
    await expect(
      new UsersService().createUser({ username: 'no-password' }),
    ).rejects.toThrow('Missing required fields');
  });
});
