import { User } from '../database/entities/user';
import { UserService } from './user-service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'thesupersecretkey';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      await this.userService.updateUser(user.id, { lastLogin: new Date() });
      return user;
    }

    return null;
  }

  generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      SECRET_KEY,
      { expiresIn: '1h' },
    );
  }

  verifyToken(token: string): any {
    return jwt.verify(token, SECRET_KEY);
  }
}
