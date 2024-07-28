import { Response, NextFunction } from 'express';
import { AuthService, AuthToken } from '../services/auth-service';
import { AuthenticatedRequest } from '../types';
import { User } from '../database/models/user';

const authService = new AuthService();

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = authService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = payload as User;

    if (authService.shouldRefreshToken(payload as AuthToken)) {
      const user = req.user as User;
      const newToken = authService.generateToken(user);
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 3600000, // 1 hour
        domain:
          process.env.NODE_ENV === 'production'
            ? '.mockmydraft.com'
            : 'localhost',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
