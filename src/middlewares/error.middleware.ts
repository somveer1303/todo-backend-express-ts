import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger.utils';
import { CustomResponse } from '@interfaces/response.interface';

const errorMiddleware = (error: HttpException, req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${error.stack}`);
    res.failure({ code: status, msg: message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
