import { NextFunction, Request } from 'express';
import { config } from '@/utils/config.utils';
import { CustomResponse } from '@/interfaces/response.interface';
import { encrypt } from '@/utils/RSAEncryption';
import { logger } from '@/utils/logger.utils';

interface ResponseObject {
  ok: boolean;
  err: any;
  data: any;
  code?: number;
}

function encryptionWrapper(data: ResponseObject): string {
  return encrypt(JSON.stringify(data), config.rsaKeys.app.publicKey, undefined);
}

function sendResponse(data: ResponseObject, isEncryption: boolean) {
  return isEncryption ? encryptionWrapper(data) : data;
}

export default (req: Request, res: CustomResponse, next: NextFunction) => {
  let isEncryption = false;
  const appId: string = req.header(config.headers.appId);
  if (appId && Object.values(config.appIds).includes(appId)) {
    isEncryption = true;
  }
  res.invalid = ({ msg, code = 400 }) => {
    const responseData = sendResponse({ ok: false, err: msg || 'Invalid Parameters', code, data: null }, isEncryption);
    res.resBody = responseData;
    return res.status(code).json(responseData);
  };

  res.failure = ({ msg, code = 200 }) => {
    const responseData = sendResponse(
      {
        ok: false,
        err: msg || "Something is wrong! We're looking into it.",
        code,
        data: null,
      },
      isEncryption,
    );

    res.resBody = responseData;
    return res.status(code).json(responseData);
  };

  res.unauthorized = ({ msg }) => {
    const responseData = sendResponse({ ok: false, err: msg || 'Authentication Failed', data: null }, isEncryption);
    res.resBody = responseData;

    return res.status(401).json(responseData);
  };

  res.success = ({ data = {} }) => {
    const responseData = sendResponse({ ok: true, err: null, data }, isEncryption);
    res.resBody = responseData;

    return res.status(200).json(responseData);
  };

  res.sendEncryptedData = ({ data, code = 200 }) => {
    const responseData = encrypt(JSON.stringify(data), config.rsaKeys.app.publicKey, undefined);
    res.resBody = responseData;
    return res.status(code).send(responseData);
  };

  next();
};

export const logResponse = (_, res: CustomResponse, next: NextFunction) => {
  res.on('finish', () => {
    logger.info(
      `After Request: ${res.statusCode} ${res.statusMessage} ${res.get(
        'Content-Length',
      )} responseBody: ${JSON.stringify(res.resBody)}`,
    );
  });
  next();
};
