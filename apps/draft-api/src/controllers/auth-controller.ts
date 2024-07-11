import { Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { UsersService } from '../services/users-service';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  private authService: AuthService;
  private usersService: UsersService;

  constructor() {
    this.authService = new AuthService();
    this.usersService = new UsersService();
  }

  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.validateUser(username, password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
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
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  }

  public async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const user = await this.usersService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin },
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      let existingUser = await this.usersService.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      existingUser = await this.usersService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const user = await this.usersService.createUser({
        username,
        password,
        isAdmin: false,
        email,
      });
      res.status(201).json({
        user: { id: user.id, username: user.username, isAdmin: user.isAdmin },
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
