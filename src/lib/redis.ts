// Redis client with graceful fallback when Redis is unavailable
type RedisClient = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, options?: { ex?: number }) => Promise<"OK" | null>;
  del: (key: string) => Promise<number>;
  ping: () => Promise<string>;
};

let redisClient: RedisClient;

// Try to use real Redis, fall back to in-memory cache
// This allows the app to work without Redis during development

// For now, create an in-memory fallback that matches the Redis interface
// In production, this will use Redis via the REDIS_URL env var
const createFallbackClient = (): RedisClient => {
  const cache = new Map<string, { value: string; expiry: number | null }>();

  return {
    async get(key: string) {
      const entry = cache.get(key);
      if (!entry) return null;
      if (entry.expiry && Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
      }
      return entry.value;
    },
    async set(key: string, value: string, options?: { ex?: number }) {
      cache.set(key, {
        value,
        expiry: options?.ex ? Date.now() + options.ex * 1000 : null,
      });
      return "OK";
    },
    async del(key: string) {
      cache.delete(key);
      return 1;
    },
    async ping() {
      return "PONG";
    },
  };
};

export const getRedisClient = (): RedisClient => {
  if (!redisClient) {
    // Check if REDIS_URL is configured
    if (process.env.REDIS_URL && process.env.REDIS_URL !== "redis://localhost:6379") {
      // In production with real Redis, we'd use ioredis here
      // For now, use fallback until ioredis is added
      console.warn("Redis URL configured but ioredis not installed. Using in-memory fallback.");
    }
    redisClient = createFallbackClient();
  }
  return redisClient;
};

export const redis = getRedisClient();
