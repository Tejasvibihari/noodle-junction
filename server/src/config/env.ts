import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const csv = z
  .string()
  .default('')
  .transform((v) =>
    v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),

  APP_URL_API: z.url().default('http://localhost:5000'),
  APP_URL_CLIENT: z.url().default('http://localhost:3000'),
  CORS_ORIGINS: csv.pipe(z.array(z.url()).min(1)).default(['http://localhost:3000']),
  COOKIE_DOMAIN: z
    .string()
    .optional()
    .transform((v) => (v ? v : undefined)),

  MONGODB_URI: z
    .string()
    .min(1)
    .refine((v) => /^mongodb(\+srv)?:\/\//.test(v), 'must start with mongodb:// or mongodb+srv://'),
  REDIS_URL: z
    .string()
    .min(1)
    .refine((v) => /^rediss?:\/\//.test(v), 'must start with redis:// or rediss://'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DEFAULT_TIMEZONE: z.string().default('Asia/Kolkata'),
});

export type Env = z.infer<typeof envSchema>;

/** Validate a raw env map. Throws with a readable, secret-free message. */
export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const lines = result.error.issues.map(
      (i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`,
    );
    throw new Error(`Invalid environment configuration:\n${lines.join('\n')}`);
  }
  return result.data;
}

function load(): Env {
  try {
    return parseEnv(process.env);
  } catch (err) {
    // Fail fast on boot; never start with a half-valid config.
    console.error((err as Error).message);
    process.exit(1);
  }
}

export const env: Env = load();
