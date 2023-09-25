import { config } from '@utils/config.utils';

import { DataSource } from 'typeorm';
import { User } from '@entity/user.entity';
import { Task } from '@entity/task.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  url: config.databaseUrlSql,
  entities: [User, Task],
  synchronize: config.typeorm.synchronize,
  logging: config.typeorm.logging,
});
