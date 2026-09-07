import Redis from 'ioredis';
import { env } from './env';

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  password: env.redis.password,
  retryStrategy: (times: number) => {
    // Stop retrying after 3 attempts — prevents hanging on Render (no Redis)
    if (times > 3) return null;
    return Math.min(times * 500, 2000);
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis error:', err.message);
});

redis.on('reconnecting', () => {
  console.warn('⚠️  Redis reconnecting...');
});

export default redis;
