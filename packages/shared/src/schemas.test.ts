import { describe, expect, it } from 'vitest';
import {
  buildPageMeta,
  emailSchema,
  latLngSchema,
  objectIdSchema,
  paginationQuerySchema,
  phoneSchema,
  pincodeSchema,
  qtySchema,
} from './schemas';

describe('phoneSchema', () => {
  it.each([
    ['9812345678', '+919812345678'],
    ['+91 98123-45678', '+919812345678'],
    ['919812345678', '+919812345678'],
    ['09812345678', '+919812345678'],
    ['  6000000000 ', '+916000000000'],
  ])('normalises %s', (input, expected) => {
    expect(phoneSchema.parse(input)).toBe(expected);
  });

  it.each(['12345', '5812345678', '98123456789', 'abcdefghij', ''])('rejects %s', (input) => {
    expect(phoneSchema.safeParse(input).success).toBe(false);
  });
});

describe('objectIdSchema', () => {
  it('accepts 24-hex and rejects everything else', () => {
    expect(objectIdSchema.safeParse('64b7f0c2a1d3e4f5a6b7c8d9').success).toBe(true);
    expect(objectIdSchema.safeParse('xyz').success).toBe(false);
    expect(objectIdSchema.safeParse({ $ne: null }).success).toBe(false);
  });
});

describe('paginationQuerySchema', () => {
  it('applies defaults', () => {
    expect(paginationQuerySchema.parse({})).toMatchObject({ page: 1, limit: 20 });
  });
  it('coerces strings from the query string', () => {
    expect(paginationQuerySchema.parse({ page: '3', limit: '50' })).toMatchObject({
      page: 3,
      limit: 50,
    });
  });
  it('caps limit at 100 and rejects page < 1', () => {
    expect(paginationQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
    expect(paginationQuerySchema.safeParse({ page: '0' }).success).toBe(false);
  });
  it('validates sort format and parses dates', () => {
    expect(paginationQuerySchema.parse({ sort: '-createdAt' }).sort).toBe('-createdAt');
    expect(paginationQuerySchema.safeParse({ sort: '$where' }).success).toBe(false);
    expect(paginationQuerySchema.parse({ from: '2026-09-21' }).from).toBeInstanceOf(Date);
  });
  it('builds meta', () => {
    expect(buildPageMeta({ page: 2, limit: 20 }, 134)).toEqual({ page: 2, limit: 20, total: 134 });
  });
});

describe('misc schemas', () => {
  it('pincode', () => {
    expect(pincodeSchema.safeParse('201309').success).toBe(true);
    expect(pincodeSchema.safeParse('2013').success).toBe(false);
  });
  it('qty is 1..99 integer', () => {
    expect(qtySchema.safeParse(1).success).toBe(true);
    expect(qtySchema.safeParse(0).success).toBe(false);
    expect(qtySchema.safeParse(1.5).success).toBe(false);
  });
  it('email is trimmed and lower-cased', () => {
    expect(emailSchema.parse('  Manager.NOI@NoodleJunction.in ')).toBe(
      'manager.noi@noodlejunction.in',
    );
  });
  it('lat/lng bounds', () => {
    expect(latLngSchema.safeParse({ lat: 28.6271, lng: 77.3649 }).success).toBe(true);
    expect(latLngSchema.safeParse({ lat: 91, lng: 0 }).success).toBe(false);
  });
});
