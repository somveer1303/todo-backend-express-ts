import { config } from '@/utils/config.utils';
import Redis from 'ioredis';

const redis = new Redis(config.redisUrl);

export default redis;
