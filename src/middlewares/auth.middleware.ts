import { NextFunction, Response, Request } from 'express';
import { config } from '@/utils/config.utils';
import * as context from '@utils/context.utils';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger.utils';
import UserService from '@/services/users.service';
import { CustomResponse } from '@/interfaces/response.interface';
import { verify } from 'jsonwebtoken';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const userService = new UserService();

export const authInternalAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies[config.cookies.authorization] || req.header(config.headers.authorization);
    if (Authorization && Authorization === config.internalAccessToken) {
      next();
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const authMiddleware = async (req: RequestWithUser, res: CustomResponse, next: NextFunction) => {
  try {
    const Authorization =
      req.cookies['Authorization'] ||
      (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = config.internalAccessToken;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;

      const userId = verificationResponse._id;
      const userRes = await userService.findUserById(userId);
      if (userRes.ok) {
        req.user = userRes.data;
        context.addUserToContext(userRes);
        next();
      } else {
        return res.failure({ code: 401, msg: 'Wrong authentication token' });
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
      return res.failure({ code: 404, msg: 'Authentication token missing' });
    }
  } catch (error) {
    return res.failure({ code: 401, msg: 'Wrong authentication token' });
  }
};
