import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';
import { AuthenticatedRequest } from '../types';
import { User } from '../database/models/user';

const authService = new AuthService();

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = authService.verifyToken(token);
    req.user = payload as User;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
