import { AppDataSource } from '../database';
import { User } from '../database/models/user';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(data: Partial<User>): Promise<User> {
    if (!data.username || !data.email || !data.password) {
      throw new Error('Missing required fields');
    }

    const user = new User();
    user.username = data.username;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 10);

    return this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ username });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ email });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        return null;
      }

      const updatedUser = this.userRepository.merge(user, data);

      return this.userRepository.save(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.getUserById(id);

      if (!user) {
        return false;
      }

      await this.userRepository.delete(user);

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
