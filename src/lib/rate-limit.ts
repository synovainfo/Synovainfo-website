import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

// ---------------------------------------------------------------------------
// Rate Limiter — In-Memory (sliding window) + Redis-backed for production
// ---------------------------------------------------------------------------

interface RateLimitOptions {
  interval: number; // Window size in milliseconds
  max: number; // Maximum requests per window
}

interface RateLimitResult {
  success: boolean;
  headers: Record<string, string>;
}

// ---------------------------------------------------------------------------
// In-memory store (fallback when Redis is unavailable)
// ---------------------------------------------------------------------------

interface WindowEntry {
  timestamps: number[];
}

class InMemoryStore {
  private windows = new Map<string, WindowEntry>();

  /** Clean up expired entries periodically */
  private cleanup(interval: number): void {
    const now = Date.now();
    for (const [key, entry] of this.windows.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < interval);
      if (entry.timestamps.length === 0) {
        this.windows.delete(key);
      }
    }
  }

  async check(key: string, { interval, max }: RateLimitOptions): Promise<RateLimitResult> {
    const now = Date.now();

    // Run cleanup every 60s (rate-limited to avoid perf overhead)
    if (Math.random() < 0.01) {
      this.cleanup(interval);
    }

    let entry = this.windows.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.windows.set(key, entry);
    }

    // Remove timestamps outside the current window
    entry.timestamps = entry.timestamps.filter((t) => now - t < interval);

    if (entry.timestamps.length >= max) {
      const oldest = entry.timestamps[0] ?? now;
      const retryAfter = Math.ceil((oldest + interval - now) / 1000);

      return {
        success: false,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(max),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(oldest / 1000) + interval / 1000),
        },
      };
    }

    entry.timestamps.push(now);

    return {
      success: true,
      headers: {
        "X-RateLimit-Limit": String(max),
        "X-RateLimit-Remaining": String(max - entry.timestamps.length),
        "X-RateLimit-Reset": String(Math.ceil((now + interval) / 1000)),
      },
    };
  }
}

const inMemoryStore = new InMemoryStore();

// ---------------------------------------------------------------------------
// Rate limiter factory
// ---------------------------------------------------------------------------

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

function buildKey(prefix: string, ip: string, pathname: string): string {
  return `ratelimit:${prefix}:${ip}:${pathname}`;
}

/**
 * Create a rate limit middleware function.
 *
 * Uses Redis when available via `src/lib/redis.ts`, otherwise falls back
 * to an in-memory sliding-window store.
 */
export function rateLimit({ interval, max }: RateLimitOptions) {
  return async (request: NextRequest): Promise<RateLimitResult> => {
    const ip = getClientIp(request);
    const pathname = request.nextUrl.pathname;
    const key = buildKey("default", ip, pathname);

    // Try Redis first (production path)
    try {
      const redisKey = `rl:${key}`;
      const current = await redis.get(redisKey);
      const count = current ? Number.parseInt(current, 10) : 0;

      if (count >= max) {
        // Get TTL for Retry-After
        // Note: in-memory fallback doesn't support TTL retrieval,
        // so we use interval as approximation
        const retryAfter = Math.ceil(interval / 1000);

        return {
          success: false,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + retryAfter),
          },
        };
      }

      // Increment counter
      const ttlSeconds = Math.ceil(interval / 1000);
      await redis.set(redisKey, String(count + 1), { ex: ttlSeconds });

      return {
        success: true,
        headers: {
          "X-RateLimit-Limit": String(max),
          "X-RateLimit-Remaining": String(max - count - 1),
          "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + ttlSeconds),
        },
      };
    } catch {
      // Redis unavailable — fall back to in-memory store
      return inMemoryStore.check(key, { interval, max });
    }
  };
}

// ---------------------------------------------------------------------------
// Default presets
// ---------------------------------------------------------------------------

/** Standard API rate limit: 100 requests per minute */
export const apiRateLimit = rateLimit({
  interval: 60_000,
  max: 100,
});

/** Strict auth rate limit: 5 requests per minute */
export const authRateLimit = rateLimit({
  interval: 60_000,
  max: 5,
});
