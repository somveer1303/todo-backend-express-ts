import { ParsedQs } from 'qs';

import { RequestHandler, Request, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { z } from 'zod';
import { function as F, either as E } from 'fp-ts';

import { parseZ, parseZodError } from '@utils/zod.utils';
import { RequestContentLocation } from '@interfaces/zod.interface';
import { CustomResponse } from '@interfaces/response.interface';
import { logger } from '@/utils/logger.utils';

export type APIResponseBodyFailure<T> = {
  success: false;
  result: null;
  error: T;
};

export const validateRequest =
  <T>({
    requestContentLocation,
    zodType,
  }: {
    requestContentLocation: RequestContentLocation;
    zodType: z.ZodType<T>;
  }): RequestHandler =>
  (req: Request, res: CustomResponse, next: NextFunction) => {
    const requestContentParser = parseZ(zodType);
    const requestContent = req[requestContentLocation];

    return F.pipe(
      requestContentParser(requestContent),
      E.fold(
        err => {
          logger.error('Validation error: ' + err.toString());
          return res.invalid({ msg: parseZodError(err) });
        },
        () => next(),
      ),
    );
  };

export const validateRequestBody = <T>(zodType: z.ZodType<T>): RequestHandler<any, any, T, any, any> =>
  validateRequest({ requestContentLocation: 'body', zodType });

export const validateRequestQueries = <T extends ParsedQs>(
  zodType: z.ZodType<T>,
): RequestHandler<any, any, any, T, any> => validateRequest({ requestContentLocation: 'query', zodType });

export const validateRequestParams = <T extends ParamsDictionary>(
  zodType: z.ZodType<T>,
): RequestHandler<T, any, any, any, any> => validateRequest({ requestContentLocation: 'params', zodType });

// export const transformToAPIFailureResponse: ErrorRequestHandler<any, APIResponseBodyFailure<unknown>> = (
//   err,
//   _,
//   res,
//   next,
// ) => {
//   if (err instanceof RequestValidationError) {
//     const { requestContentLocation: location, zodError } = err;

//     return res.status(400).json({
//       success: false,
//       result: null,
//       error: {
//         location,
//         zodErrors: zodError.errors,
//       },
//     });
//   }

//   // Handle other errors here.

//   return next(err);
// };
