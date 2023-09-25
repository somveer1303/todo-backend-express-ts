import { Router } from 'express';
import AuthController from '@/controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { authMiddleware } from '@middlewares/auth.middleware';
import { userSignInSchemaZ, userSignUpSchemaZ } from '@dtos/auth.dtos';
import { validateRequestBody } from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-up`, validateRequestBody(userSignUpSchemaZ), this.authController.signUp);
    this.router.post(`${this.path}/sign-in`, validateRequestBody(userSignInSchemaZ), this.authController.signIn);
    this.router.post(
      `${this.path}/sign-out`,
      validateRequestBody(userSignInSchemaZ),
      authMiddleware,
      this.authController.signOut,
    );
  }
}

export default AuthRoute;
