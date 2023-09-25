import { Request } from 'express';
import { ISignInUser, ISignUpUser } from '@interfaces/users.interface';
import { CustomResponse } from '@interfaces/response.interface';
import AuthService from '@services/auth.service';
import { logger } from '@/utils/logger.utils';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: CustomResponse) => {
    try {
      const userData: ISignUpUser = req.body;
      const response = await this.authService.signup(userData);
      if (response.ok) {
        return res.success({ code: 201, data: {} });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public signIn = async (req: Request, res: CustomResponse) => {
    try {
      const userData: ISignInUser = req.body;
      const response = await this.authService.signIn(userData);

      if (response.ok) {
        res.setHeader('Set-Cookie', [response.data.cookie]);
        delete response.data.cookie;
        return res.success({ data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public signOut = async (req: Request, res: CustomResponse) => {
    try {
      const userData: ISignInUser = req.body;
      const response = await this.authService.signOut(userData);

      if (response.ok) {
        res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
        delete response.data.cookie;
        return res.success({ data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };
}

export default AuthController;
