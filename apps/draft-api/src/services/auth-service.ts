import { User } from '../database/models/user';
import { UsersService } from './users-service';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFRESH_THRESHOLD = 10 * 60; // 10 minutes

export interface AuthToken {
  exp: number;
  iat: number;
}

export class AuthService {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      await this.usersService.updateUser(user.id, { lastLogin: new Date() });
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
        issuer: 'draft-api',
      },
    );
  }

  verifyToken(token: string): JwtPayload | string | null {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  }

  shouldRefreshToken(token: AuthToken): boolean {
    const now = Math.floor(Date.now() / 1000);
    return token.exp - now < REFRESH_THRESHOLD;
  }
}
