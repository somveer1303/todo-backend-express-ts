import { decrypt } from '@/utils/RSAEncryption';

import { NextFunction, Request } from 'express';
import { config } from '@utils/config.utils';
import { HttpException } from '@exceptions/HttpException';
import { CustomResponse } from '@/interfaces/response.interface';
import { logger } from '@/utils/logger.utils';
const payloadDecryptMiddleware = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const appId: string = req.header(config.headers.appId);
    if (appId && Object.values(config.appIds).includes(appId)) {
      const body = req.body;
      if (appId === config.appIds.app) {
        const decrypted = decrypt(body.data, config.rsaKeys.internal.privateKey, undefined);
        if (!decrypted) {
          logger.error('Received bad data');
          res.unauthorized({ msg: 'Received bad data' });
        }

        try {
          req.body = JSON.parse(decrypted);
        } catch (error) {
          logger.error(error);
        }
      }
      next();
    } else {
      logger.error('appId header missing');
      next(new HttpException(403, 'appId header missing'));
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(401, 'Wrong encryption token'));
  }
};

export default payloadDecryptMiddleware;
