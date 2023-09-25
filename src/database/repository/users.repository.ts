import { Repository } from 'typeorm';
import { User } from '@entity/user.entity';
import { AppDataSource } from '@/utils/typeorm';

export default class UserRepository {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }
  async createUser(userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Unable to create user: ${error.message}`);
    }
  }

  async updateUser(userData: Partial<User>): Promise<void> {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .update('users')
        .set({ ...userData })
        .where('id = :id', { id: userData.id })
        .execute();
    } catch (error) {
      throw new Error(`Unable to create user: ${error.message}`);
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new Error(`Unable to fetch user: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new Error(`Unable to fetch user by email: ${error.message}`);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Unable to delete user: ${error.message}`);
    }
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return !!user;
    } catch (error) {
      throw new Error(`Error checking if user exists by email: ${error.message}`);
    }
  }
}
