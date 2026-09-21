import { z } from 'zod';

// Each enum = a const tuple (runtime values), a union type, and a zod schema.
// Values mirror 03-DATABASE.md; do not rename without a migration.

export const ROLES = [
  'RESTAURANT_ADMIN',
  'BRANCH_MANAGER',
  'CASHIER',
  'KITCHEN',
  'WAITER',
  'CUSTOMER',
  'GUEST',
] as const;
export type Role = (typeof ROLES)[number];
export const roleSchema = z.enum(ROLES);

/** Roles stored on `users` (staff accounts). */
export const STAFF_ROLES = [
  'RESTAURANT_ADMIN',
  'BRANCH_MANAGER',
  'CASHIER',
  'KITCHEN',
  'WAITER',
] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export const staffRoleSchema = z.enum(STAFF_ROLES);

/** Staff roles locked to a single branch (branchId comes from the JWT). */
export const BRANCH_ROLES = ['BRANCH_MANAGER', 'CASHIER', 'KITCHEN', 'WAITER'] as const;
export type BranchRole = (typeof BRANCH_ROLES)[number];

export const ORDER_TYPES = ['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const;
export type OrderType = (typeof ORDER_TYPES)[number];
export const orderTypeSchema = z.enum(ORDER_TYPES);

export const ORDER_SOURCES = ['QR', 'POS', 'WEB'] as const;
export type OrderSource = (typeof ORDER_SOURCES)[number];
export const orderSourceSchema = z.enum(ORDER_SOURCES);

/** Order lifecycle (dine-in food progress is read from item statuses). */
export const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'OPEN',
  'BILL_REQUESTED',
  'COMPLETED',
  'CANCELLED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const orderStatusSchema = z.enum(ORDER_STATUSES);

/** Takeaway / delivery progress. */
export const FULFILLMENT_STATUSES = [
  'PLACED',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'PICKED_UP',
  'REJECTED',
] as const;
export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];
export const fulfillmentStatusSchema = z.enum(FULFILLMENT_STATUSES);

export const ITEM_STATUSES = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];
export const itemStatusSchema = z.enum(ITEM_STATUSES);

export const PAYMENT_STATUSES = [
  'UNPAID',
  'PARTIAL',
  'PAID',
  'REFUNDED',
  'PARTIAL_REFUND',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);

/** Status of a single `payments` record. */
export const PAYMENT_RECORD_STATUSES = [
  'CREATED',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIAL_REFUND',
] as const;
export type PaymentRecordStatus = (typeof PAYMENT_RECORD_STATUSES)[number];
export const paymentRecordStatusSchema = z.enum(PAYMENT_RECORD_STATUSES);

export const PAYMENT_METHODS = ['RAZORPAY', 'CASH', 'UPI', 'CARD', 'COD'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);

/** What the guest/customer chose at order time (not a recorded payment). */
export const PAYMENT_PREFERENCES = ['ONLINE', 'COD', 'COUNTER'] as const;
export type PaymentPreference = (typeof PAYMENT_PREFERENCES)[number];
export const paymentPreferenceSchema = z.enum(PAYMENT_PREFERENCES);

export const TABLE_STATUSES = [
  'VACANT',
  'OCCUPIED',
  'BILL_REQUESTED',
  'RESERVED',
  'DISABLED',
] as const;
export type TableStatus = (typeof TABLE_STATUSES)[number];
export const tableStatusSchema = z.enum(TABLE_STATUSES);

export const TABLE_SESSION_STATUSES = ['OPEN', 'CLOSED', 'EXPIRED'] as const;
export type TableSessionStatus = (typeof TABLE_SESSION_STATUSES)[number];
export const tableSessionStatusSchema = z.enum(TABLE_SESSION_STATUSES);

export const TABLE_SESSION_OPENED_VIA = ['QR', 'STAFF', 'RESERVATION'] as const;
export type TableSessionOpenedVia = (typeof TABLE_SESSION_OPENED_VIA)[number];

export const FOOD_TYPES = ['VEG', 'NON_VEG', 'EGG'] as const;
export type FoodType = (typeof FOOD_TYPES)[number];
export const foodTypeSchema = z.enum(FOOD_TYPES);

export const COUPON_TYPES = ['PERCENT', 'FLAT'] as const;
export type CouponType = (typeof COUPON_TYPES)[number];
export const couponTypeSchema = z.enum(COUPON_TYPES);

export const COUPON_SCOPES = ['GLOBAL', 'BRANCH'] as const;
export type CouponScope = (typeof COUPON_SCOPES)[number];
export const couponScopeSchema = z.enum(COUPON_SCOPES);

export const RESERVATION_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
  'COMPLETED',
  'NO_SHOW',
  'CANCELLED',
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export const reservationStatusSchema = z.enum(RESERVATION_STATUSES);

export const MENU_TAGS = ['BESTSELLER', 'SPICY', 'CHEF_SPECIAL'] as const;
export type MenuTag = (typeof MENU_TAGS)[number];
export const menuTagSchema = z.enum(MENU_TAGS);
