require('ts-node/register');
import { config } from './src/utils/config.utils';
module.exports = {
  client: 'mysql',
  connection: config.databaseUrlSql,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
  acquireConnectionTimeout: 2000,
  timezone: 'UTC',
};
