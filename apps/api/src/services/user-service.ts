import { AppDataSource } from '../database';
import { User } from '../database/entities/user';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    user.password = await bcrypt.hash(user.password, 10);
    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    const updatedUser = this.userRepository.merge(user, data);

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return false;
    }

    await this.userRepository.softDelete(user);

    return true;
  }
}
