import { IConfigApp } from '@config/constraint';

const config: IConfigApp = {
  port: 4000,
  logDir: '../logs',
  origin: '*',
  credentials: true,
  aws: {
    S3: {
      s3Path: 'users/insurances/uat/cronJobs',
    },
  },
  headers: {
    authorization: 'Authorization',
    appId: 'app-Id',
  },
  cookies: {
    authorization: 'Authorization',
  },
  appIds: {
    app: 'com.propFTX.app',
    web: 'com.propFTX.web',
  },
  redisKeys: {
    fileTransactionsJob: 'fileTransactionsJob',
  },
  redisUrl: 'redis://localhost:6379',
  typeorm: {
    Type: 'mysql',
    synchronize: false,
    logging: ['error'],
  },
};

export default config;
