/** Error codes and HTTP statuses from 04-API.md §1.5. Single source of truth. */
export const ERROR_STATUS = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  TOKEN_EXPIRED: 401,
  SESSION_ENDED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VERSION_CONFLICT: 409,
  ITEM_LOCKED: 409,
  ORDER_CLOSED: 409,
  TABLE_OCCUPIED: 409,
  ITEM_UNAVAILABLE: 422,
  BRANCH_CLOSED: 422,
  BRANCH_PAUSED: 422,
  NOT_DELIVERABLE: 422,
  MIN_ORDER_NOT_MET: 422,
  COUPON_INVALID: 422,
  PAYMENT_AMOUNT_MISMATCH: 422,
  PAYMENT_SIGNATURE_INVALID: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_STATUS;

export const ERROR_CODES = Object.keys(ERROR_STATUS) as ErrorCode[];

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && Object.hasOwn(ERROR_STATUS, value);
}

export interface ErrorDetail {
  field?: string;
  issue?: string;
  reason?: string;
  [key: string]: unknown;
}
