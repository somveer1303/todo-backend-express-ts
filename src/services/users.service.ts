import { User } from '@entity/user.entity';
import UserRepository from '@repository/users.repository';
import { IServiceResponse } from '@interfaces/service.interface';
import { hash } from 'bcrypt';
import { ISignUpUser } from '@/interfaces/users.interface';

class UserService {
  private usersRepository = new UserRepository();

  public async findUserById(userId: string): Promise<IServiceResponse<User>> {
    try {
      const user = await this.usersRepository.getUserById(userId);
      if (!user) {
        return {
          ok: false,
          err: 'User not found',
        };
      }

      delete user.password;

      return { ok: true, data: user };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  public async getUserByEmail(email: string): Promise<IServiceResponse<User>> {
    try {
      const user = await this.usersRepository.getUserByEmail(email);
      if (!user) {
        return {
          ok: false,
          err: 'User not found',
        };
      }

      return { ok: true, data: user };
    } catch (error) {
      throw error;
    }
  }

  public async createUser(userData: ISignUpUser): Promise<IServiceResponse<User>> {
    try {
      let user = await this.usersRepository.getUserByEmail(userData.email);
      if (user) {
        return {
          ok: false,
          err: `This email ${userData.email} already exists`,
        };
      }

      const hashedPassword = await hash(userData.password, 10);
      user = await this.usersRepository.createUser({ ...userData, password: hashedPassword });
      return {
        ok: true,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(userId: string, userData: ISignUpUser): Promise<IServiceResponse> {
    try {
      const user = await this.usersRepository.getUserByEmail(userData.email);
      if (!user) {
        return {
          ok: false,
          err: `This email ${userData.email} not exists`,
        };
      }

      const newUserData = new User();
      newUserData.id = userId;

      if (userData.password) {
        const hashedPassword = await hash(userData.password, 10);
        newUserData.password = hashedPassword;
      }
      if (userData.phone) newUserData.phone = userData.phone;
      if (userData.name) newUserData.name = userData.name;

      await this.usersRepository.updateUser(newUserData);
      return {
        ok: true,
        data: {},
      };
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
