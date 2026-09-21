import { describe, expect, it } from 'vitest';
import { ERROR_CODES, ERROR_STATUS, isErrorCode } from './errors';
import { isApiError } from './api';
import {
  ITEM_STATUSES,
  ORDER_TYPES,
  itemStatusSchema,
  roleSchema,
  ROLES,
  STAFF_ROLES,
} from './enums';

describe('error codes', () => {
  it('maps codes to the statuses in 04-API.md', () => {
    expect(ERROR_STATUS.ITEM_LOCKED).toBe(409);
    expect(ERROR_STATUS.NOT_DELIVERABLE).toBe(422);
    expect(ERROR_STATUS.RATE_LIMITED).toBe(429);
    expect(ERROR_STATUS.INTERNAL_ERROR).toBe(500);
    expect(ERROR_CODES).toHaveLength(21);
  });
  it('isErrorCode guards unknown strings', () => {
    expect(isErrorCode('ITEM_LOCKED')).toBe(true);
    expect(isErrorCode('toString')).toBe(false);
    expect(isErrorCode(42)).toBe(false);
  });
  it('isApiError detects the error envelope', () => {
    expect(isApiError({ success: false, error: { code: 'NOT_FOUND', message: 'x' } })).toBe(true);
    expect(isApiError({ success: true, data: {} })).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});

describe('enums', () => {
  it('match the documented values', () => {
    expect(ITEM_STATUSES).toEqual(['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED']);
    expect(ORDER_TYPES).toEqual(['DINE_IN', 'TAKEAWAY', 'DELIVERY']);
  });
  it('zod schemas accept members only', () => {
    expect(itemStatusSchema.safeParse('PREPARING').success).toBe(true);
    expect(itemStatusSchema.safeParse('preparing').success).toBe(false);
  });
  it('staff roles are a subset of all roles; customers/guests are not staff', () => {
    for (const r of STAFF_ROLES) expect(ROLES).toContain(r);
    expect(STAFF_ROLES).not.toContain('CUSTOMER');
    expect(roleSchema.safeParse('GUEST').success).toBe(true);
  });
});
