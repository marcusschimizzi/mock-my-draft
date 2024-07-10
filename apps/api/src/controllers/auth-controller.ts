import { AuthService } from '../services/auth-service';
import { Request, Response } from 'express';
import { UserService } from '../services/user-service';
import { AuthenticatedRequest } from '../middleware/auth-middleware';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const user = await this.authService.validateUser(username, password);

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = this.authService.generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 3600000, // 1 hour
        domain:
          process.env.NODE_ENV === 'production'
            ? '.mockmydraft.com'
            : 'localhost',
      });
      res.json({
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin },
      });
    } catch (error) {
      console.error('Error logging in', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  };

  public getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    try {
      const user = await this.userService.findUserByUsername(req.user.username);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({ id: user.id, username: user.username, isAdmin: user.isAdmin });
    } catch (error) {
      console.error('Error getting current user', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const existingUser = await this.userService.findUserByUsername(username);
      if (existingUser) {
        res.status(409).json({ message: 'User already exists' });
        return;
      }
      const newUser = await this.userService.createUser({
        username,
        password,
        isAdmin: false,
      });
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          isAdmin: newUser.isAdmin,
        },
      });
    } catch (error) {
      console.error('Error registering user', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
