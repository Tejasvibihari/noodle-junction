import type { ApiSuccess, PageMeta } from '@nj/shared';
import type { Response } from 'express';

export type { PageMeta };

/** Success envelope from 04-API.md §1.2. */
export function sendSuccess<T>(
  res: Response,
  data: T,
  opts: { status?: number; meta?: PageMeta } = {},
): Response {
  const body: ApiSuccess<T> = { success: true, data, ...(opts.meta ? { meta: opts.meta } : {}) };
  return res.status(opts.status ?? 200).json(body);
}
