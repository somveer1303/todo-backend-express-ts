import { config } from '@utils/config.utils';

import { DataSource } from 'typeorm';
import { User } from '@/database/entity/user';

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: config.databaseUrlSql,
  entities: [User],
  synchronize: config.typeorm.synchronize,
  logging: config.typeorm.logging,
});
