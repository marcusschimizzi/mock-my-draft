import { User } from '../database/models/user';
import { UserService } from './users-service';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByUsername(username);

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
      {
        expiresIn: '1h',
      }
    );
  }

  verifyToken(token: string): JwtPayload | string {
    return jwt.verify(token, SECRET_KEY);
  }
}
