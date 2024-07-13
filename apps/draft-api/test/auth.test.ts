import { Response, NextFunction } from 'express';
import { AuthService } from '../src/services/auth-service';
import { AuthenticatedRequest } from '../src/types';
import { User } from '../src/database/models/user';
import { authenticate, requireAdmin } from '../src/middleware/auth';

jest.mock('../src/services/auth-service');

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
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as AuthenticatedRequest;
    res = {} as Response;
    next = jest.fn();
  });

  it('should call next if token is present and valid', () => {
    const token = 'valid-token';
    req.cookies = { token };
    const payload = { id: 1, isAdmin: false };
    (AuthService.prototype.verifyToken as jest.Mock).mockReturnValue(payload);

    authenticate(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 status if token is missing', () => {
    req.cookies = {};

    const jsonMock = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jsonMock });

    authenticate(req, res, next);

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

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});

describe('requireAdmin middleware', () => {
  let req: AuthenticatedRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as AuthenticatedRequest;
    res = {} as Response;
    next = jest.fn();
  });

  it('should call next if user is an admin', () => {
    req.user = {
      ...TEST_USER,
      isAdmin: true,
    };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 status if user is not an admin', () => {
    req.user = {
      ...TEST_USER,
      isAdmin: false,
    };

    const jsonMock = jest.fn();
    res.status = jest.fn().mockReturnValue({ json: jsonMock });

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Forbidden' });
  });
});
