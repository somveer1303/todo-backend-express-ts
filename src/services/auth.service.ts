import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserConstant } from '@constants';

import { config } from '@utils/config.utils';

import UserRepository from '@repository/users.repository';

import { IServiceResponse } from '@interfaces/service.interface';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { ISignInUser, ISignUpUser, ISignInResponse } from '@interfaces/users.interface';

import UserService from '@services/users.service';

class AuthService {
  private usersRepository = new UserRepository();
  private userService = new UserService();

  public async signup(userData: ISignUpUser): Promise<IServiceResponse<ISignInResponse>> {
    try {
      const response = await this.userService.createUser(userData);

      if (!response.ok) {
        return response;
      }

      return await this.signIn(userData);
    } catch (error) {
      throw error;
    }
  }

  public async signIn(userData: ISignInUser): Promise<IServiceResponse<ISignInResponse>> {
    const userRes = await this.userService.getUserByEmail(userData.email);
    if (!userRes.ok) {
      return {
        ok: false,
        err: `This email ${userData.email} was not found`,
      };
    }

    const user = userRes.data;

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) {
      return {
        ok: false,
        err: 'Password is not matching',
      };
    }

    const tokenData = this.createToken(user?.id);
    const cookie = this.createCookie(tokenData);

    return {
      ok: true,
      data: { name: user.name, phone: user.phone, email: user.email, cookie },
    };
  }

  public async signOut(userData: ISignInUser): Promise<IServiceResponse<ISignInResponse>> {
    const userRes = await this.userService.getUserByEmail(userData.email);
    if (!userRes.ok) {
      return {
        ok: false,
        err: `This email ${userData.email} was not found`,
      };
    }

    const user = userRes.data;

    const isPasswordMatching: boolean = await compare(userData.password, user.password);
    if (!isPasswordMatching) {
      return {
        ok: false,
        err: 'Invalid user',
      };
    }
    return {
      ok: true,
      data: { name: user.name, phone: user.phone, email: user.email },
    };
  }

  public createToken(userId): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: userId };
    const secretKey: string = config.internalAccessToken;
    const expiresIn: number = UserConstant.JWT.expireIn.week;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}`;
  }
}

export default AuthService;
