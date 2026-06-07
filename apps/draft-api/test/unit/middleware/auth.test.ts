import { Response, NextFunction } from 'express';
import { AuthService } from '../../../src/services/auth-service';
import { UsersService } from '../../../src/services/users-service';
import { AuthenticatedRequest } from '../../../src/types';
import { User } from '../../../src/database/models/user';
import { authenticate, requireAdmin } from '../../../src/middleware/auth';

jest.mock('../../../src/services/auth-service');
jest.mock('../../../src/services/users-service');

const TEST_USER: User = {
  id: 'test-user',
  username: 'test-user',
  email: 'test@user.com',
  password: 'password',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('authenticate middleware', () => {
  let req: AuthenticatedRequest;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as AuthenticatedRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next if token is present and valid', () => {
    const token = 'valid-token';
    req.cookies = { token };
    const payload = { id: 1, isAdmin: false };
    (AuthService.prototype.verifyToken as jest.Mock).mockReturnValue(payload);

    authenticate(req, res as Response, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 status if token is missing', () => {
    req.cookies = {};

    const jsonMock = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jsonMock });

    authenticate(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 401 status if token is invalid', () => {
    const token = 'invalid-token';
    req.cookies = { token };
    (AuthService.prototype.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const jsonMock = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jsonMock });

    authenticate(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should refresh token if it is about to expire', () => {
    const token = 'valid-token';
    req.cookies = { token };
    const mockPayload = { id: 1, isAdmin: false, username: 'test-user' };
    res.status = jest.fn().mockReturnThis();
    jest
      .spyOn(AuthService.prototype, 'verifyToken')
      .mockReturnValue(mockPayload);
    jest
      .spyOn(AuthService.prototype, 'shouldRefreshToken')
      .mockReturnValue(true);
    jest
      .spyOn(AuthService.prototype, 'generateToken')
      .mockReturnValue('new-token');

    authenticate(req, res as Response, next);

    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      'new-token',
      expect.any(Object),
    );
    expect(next).toHaveBeenCalled();
  });
});

describe('requireAdmin middleware', () => {
  let req: AuthenticatedRequest;
  let res: Response;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { user: { ...TEST_USER } } as AuthenticatedRequest;
    jsonMock = jest.fn();
    res = { status: jest.fn().mockReturnValue({ json: jsonMock }) } as unknown as Response;
    next = jest.fn();
  });

  it('should call next if the user is an admin in the database', async () => {
    (UsersService.prototype.getUserById as jest.Mock).mockResolvedValue({
      ...TEST_USER,
      isAdmin: true,
    });

    await requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if the user is not an admin in the database', async () => {
    // Even with isAdmin true on the (stale) token, the DB is the source of truth.
    req.user = { ...TEST_USER, isAdmin: true };
    (UsersService.prototype.getUserById as jest.Mock).mockResolvedValue({
      ...TEST_USER,
      isAdmin: false,
    });

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if the user no longer exists', async () => {
    (UsersService.prototype.getUserById as jest.Mock).mockResolvedValue(null);

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 if the lookup throws', async () => {
    (UsersService.prototype.getUserById as jest.Mock).mockRejectedValue(
      new Error('db down'),
    );

    await requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});
