import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Auth
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url().default("http://localhost:3000"),

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Resend
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@synovainfo.com"),

  // Sentry
  SENTRY_DSN: z.string().url().optional(),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://synovainfo.com"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Synova Infotech"),

  // Form
  NEXT_PUBLIC_FORM_ENDPOINT: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
