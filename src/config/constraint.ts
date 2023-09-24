export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export interface IConfigApp {
  nodeEnv?: string;
  port?: number;
  credentials: boolean;
  internalAccessToken?: string;
  databaseUrlSql?: string;
  logDir: string;
  origin: string;
  aws?: Partial<AWS>;
  encryption?: Encryption;
  headers: Headers;
  cookies: Cookies;
  appIds: AppIds;
  rsaKeys?: RSAKeys;
  redisUrl?: string;
  redisKeys: RedisKeys;
  typeorm?: Typeorm;
  isMockEnable?: boolean;
}

interface S3 {
  s3Path: string;
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  signatureVersion: string;
}

interface SES {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface AWS {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  S3: Partial<S3>;
  SES: SES;
}

interface Encryption {
  encryptionKey1: string;
  encryptionKey2: string;
}

interface Headers {
  authorization: string;
  appId: string;
}
interface Cookies {
  authorization: string;
}

interface AppIds {
  app: string;
  web: string;
}

interface RSAKeys {
  internal: {
    privateKey: string;
    publicKey: string;
  };
  app: {
    privateKey?: string;
    publicKey: string;
  };
}

interface RedisKeys {
  fileTransactionsJob: string;
}

type LoggingOptions = 'error' | 'query';

export interface Typeorm {
  Type: string;
  database?: string;
  synchronize: boolean;
  logging: [LoggingOptions] | [LoggingOptions, LoggingOptions];
  entities?: [];
}
