import { IConfigApp, DeepPartial } from '@config/constraint';

const configProduction: DeepPartial<IConfigApp> = {
  port: 5656,
  logDir: '../logs',
  typeorm: {
    synchronize: false,
  },
};

module.exports = configProduction;
