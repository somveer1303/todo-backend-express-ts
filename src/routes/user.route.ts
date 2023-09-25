import { Router } from 'express';
import UserController from '@/controllers/users.controller';
import { Routes } from '@interfaces/routes.interface';
import { userSignInSchemaZ, userSignUpSchemaZ } from '@dtos/auth.dtos';
import { UserUpdateSchemaZ, UserIdSchemaZ } from '@dtos/users.dtos';

import { validateRequestBody, validateRequestParams } from '@middlewares/validation.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public usersController = new UserController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id`,
      //  validateRequestParams(UserIdSchemaZ),
      this.usersController.getUserById,
    );
    this.router.put(
      `${this.path}/:id`,
      validateRequestBody(UserUpdateSchemaZ),
      // validateRequestParams(UserIdSchemaZ),
      this.usersController.updateUser,
    );
  }
}
export default UserRoute;
