import { z } from 'zod';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from './constants';

/** MongoDB ObjectId as a 24-char hex string. IDs are strings in the API. */
export const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid id');

/** Integer paise, zero or more. */
export const paiseSchema = z.number().int().nonnegative();

/** Quantity of an order line: 1..99. */
export const qtySchema = z.number().int().min(1).max(99);

/** Tax / discount percentage, 0..100, up to 2 decimals. */
export const percentSchema = z.number().min(0).max(100);

export const pincodeSchema = z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits');

/**
 * Indian mobile number. Accepts "98xxxxxxxx", "+91 98xxx-xxxxx", "0 98xxxxxxxx",
 * "91xxxxxxxxxx" and normalises to E.164 "+919812345678".
 */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ''))
  .transform((v) => v.replace(/^(\+91|91|0)(?=[6-9]\d{9}$)/, ''))
  .refine((v) => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit Indian mobile number')
  .transform((v) => `+91${v}`);

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);
export const latLngSchema = z.object({ lat: latitudeSchema, lng: longitudeSchema });

/** Common list query params (04-API.md §1.3). */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT),
  /** e.g. "-createdAt" (desc) or "name" (asc). Fields are whitelisted per endpoint. */
  sort: z
    .string()
    .regex(/^-?[a-zA-Z][a-zA-Z0-9_.]*$/, 'Invalid sort')
    .optional(),
  q: z.string().trim().min(1).max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/** Build the `meta` block for a paginated response. */
export function buildPageMeta(query: { page: number; limit: number }, total: number) {
  return { page: query.page, limit: query.limit, total };
}
