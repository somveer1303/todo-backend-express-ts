import { IConfigApp, DeepPartial } from '@config/constraint';

const config: DeepPartial<IConfigApp> = {
  port: 2323,
  logDir: '../logs',
  typeorm: {
    synchronize: true,
  },
};

module.exports = config;
