import redis from '../config/redis';
import { env } from '../config/env';

const isRedisEnabled = env.redis.enabled;

// ─── Get a cached value ───────────────────────────────────────
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (!isRedisEnabled) return null;
  try {
    const val = await redis.get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
};

// ─── Set a cached value with TTL (seconds) ────────────────────
export const cacheSet = async (
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<void> => {
  if (!isRedisEnabled) return;
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Non-fatal — just skip caching
  }
};

// ─── Delete a cached value (or pattern) ──────────────────────
export const cacheDel = async (key: string): Promise<void> => {
  if (!isRedisEnabled) return;
  try {
    await redis.del(key);
  } catch {
    // Non-fatal
  }
};

// ─── Delete all keys matching a prefix pattern ────────────────
export const cacheDelPattern = async (pattern: string): Promise<void> => {
  if (!isRedisEnabled) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Non-fatal
  }
};

// ─── Helper: cache-aside wrapper ─────────────────────────────
export const withCache = async <T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> => {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetchFn();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
};
