import { Response, NextFunction } from 'express';
import { AuthService, AuthToken } from '../services/auth-service';
import { UsersService } from '../services/users-service';
import { AuthenticatedRequest } from '../types';
import { User } from '../database/models/user';

const authService = new AuthService();
const usersService = new UsersService();

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

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    // Authorize against current DB state rather than trusting the JWT's isAdmin
    // claim, so admin promotions/demotions take effect without re-login.
    const user = await usersService.getUserById(req.user.id);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.error('Error verifying admin privileges:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
