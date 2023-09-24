import { NextFunction, Request, Response } from 'express';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // const findAllUsersData: User[] = await this.userService.findAllUser();

      res.status(200).json({ data: {}, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
