import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';
import { User } from '../database/entities/user';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const authService = new AuthService();

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  console.log('token', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded as User;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};
