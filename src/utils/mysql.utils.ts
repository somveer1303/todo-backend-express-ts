import Knex, { Knex as KnexType } from 'knex';
import { config } from '@/utils/config.utils';

export function create() {
  const knex = Knex({
    client: 'mysql2',
    connection: config.databaseUrlSql,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
    // acquireConnectionTimeout: 2000,
  });

  return knex;
}
const knex: KnexType<any, unknown[]> = create();

export default knex;
