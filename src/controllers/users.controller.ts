import { Request } from 'express';
import { ISignInUser, ISignUpUser, IUpdateUserRequest } from '@interfaces/users.interface';
import { CustomResponse } from '@interfaces/response.interface';
import userService from '@services/auth.service';
import { logger } from '@/utils/logger.utils';
import UserService from '@services/users.service';

class UsersController {
  public userService = new UserService();

  public getUserById = async (req: Request, res: CustomResponse) => {
    try {
      const userId: string = req.params.id;
      if (!userId) {
        return res.invalid({ msg: 'userId is missing' });
      }

      const response = await this.userService.findUserById(userId);
      if (response.ok) {
        return res.success({ code: 201, data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };

  public updateUser = async (req: Request, res: CustomResponse) => {
    try {
      const userData: IUpdateUserRequest = req.body;
      const userId: string = req.params.id;

      if (!userId) {
        return res.invalid({ msg: 'userId is missing' });
      }

      console.log(userId);

      const response = await this.userService.updateUser(userId, userData);
      if (response.ok) {
        return res.success({ code: 201, data: response.data });
      }

      return res.failure({ msg: response.err });
    } catch (error) {
      logger.error(error.stack);
      return res.failure({ code: 500 });
    }
  };
}

export default UsersController;
