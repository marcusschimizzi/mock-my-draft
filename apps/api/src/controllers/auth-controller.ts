import { AuthService } from '../services/auth-service';
import { Request, Response } from 'express';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
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
      res.json({ token });
    } catch (error) {
      console.error('Error logging in', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
