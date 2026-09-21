import { rateLimit } from 'express-rate-limit';
import type { Request } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

interface LimiterOptions {
  windowMs: number;
  limit: number;
  keyGenerator?: (req: Request) => string;
}

// In-memory store is fine for one instance. Move to a Redis store before
// running more than one API instance (see 05-EVENTS §6 reliability checklist).
export function createRateLimiter(opts: LimiterOptions) {
  return rateLimit({
    windowMs: opts.windowMs,
    limit: opts.limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
    ...(opts.keyGenerator ? { keyGenerator: opts.keyGenerator } : {}),
    handler: (_req, _res, next) =>
      next(new AppError('RATE_LIMITED', 'Too many requests. Please try again shortly.')),
  });
}

/** Default: 300 requests / minute (04-API.md §17). Per-route limits come with their modules. */
export const generalLimiter = createRateLimiter({ windowMs: 60_000, limit: 300 });
