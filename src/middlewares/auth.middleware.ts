import { NextFunction, Response, Request } from 'express';
import { config } from '@/utils/config.utils';
import * as context from '@utils/context.utils';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger.utils';
import { ServiceResponse } from '@/interfaces/service.interface';
import UserService from '@/services/users.service';
import { CustomResponse } from '@/interfaces/response.interface';
import { CustomRequest } from '@/interfaces/request.interface';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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

export default authMiddleware;
