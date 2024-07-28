import { AuthService, AuthToken } from '../../../src/services/auth-service';
import { UsersService } from '../../../src/services/users-service';
import { User } from '../../../src/database/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/services/users-service');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    mockUsersService = new UsersService() as jest.Mocked<UsersService>;
    authService = new AuthService();
    authService['usersService'] = mockUsersService;
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        username: 'test-user',
        email: 'test-user@user.com',
        password: 'password',
      } as User;
      mockUsersService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test-user', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('1', {
        lastLogin: expect.any(Date),
      });
    });

    it('should return null if user does not exist', async () => {
      mockUsersService.getUserByUsername.mockResolvedValue(null);

      const result = await authService.validateUser('test-user', 'password');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        username: 'test-user',
        email: 'test-user@mail.com',
        password: 'password',
      } as User;
      mockUsersService.getUserByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test-user',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should return a JWT token', () => {
      const mockUser = {
        id: '1',
        username: 'test-user',
        isAdmin: false,
      } as User;
      (jwt.sign as jest.Mock).mockReturnValue('jwt-token');

      const token = authService.generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '1', username: 'test-user', isAdmin: false },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '1h',
          issuer: 'draft-api',
        },
      );
      expect(token).toEqual('jwt-token');
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token if token is valid', () => {
      const mockToken = 'valid-token';
      const mockPayload = { id: 1, isAdmin: false };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const payload = authService.verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_SECRET_KEY,
      );
      expect(payload).toEqual(mockPayload);
    });

    it('should return null if token is invalid', () => {
      const mockToken = 'invalid-token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const payload = authService.verifyToken(mockToken);

      expect(payload).toBeNull();
    });
  });

  describe('shouldRefreshToken', () => {
    it('should return true if token is about to expire', () => {
      const mockToken: AuthToken = {
        exp: Math.floor(Date.now() / 1000) + 5 * 60, // 5 minutes from now
        iat: Math.floor(Date.now() / 1000) - 55 * 60, // 55 minutes ago
      };

      const result = authService.shouldRefreshToken(mockToken);

      expect(result).toBeTruthy();
    });

    it('should return false if token is not about to expire', () => {
      const mockToken: AuthToken = {
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
        iat: Math.floor(Date.now() / 1000) - 30 * 60, // 30 minutes ago
      };
      const result = authService.shouldRefreshToken(mockToken);

      expect(result).toBeFalsy();
    });
  });
});
