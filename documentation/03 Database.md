# Noodle Junction — Database Design (MongoDB)

Conventions
- IDs: `ObjectId` (exposed as strings). All docs have `createdAt`, `updatedAt`.
- Money: **integer paise** (₹1 = 100). Percentages as numbers (e.g. `5` = 5 %).
- Times: UTC `Date`. Display in IST.
- `restaurantId` on every business document (single restaurant today, keeps multi-tenant possible).
- `branchId` on every branch-owned document → **every branch query filters by it** (see [TRD §4](02-TRD.md)).
- Soft delete via `isActive` / `deletedAt` for menu, staff, tables (orders/invoices are never deleted).

---

## 1. Collections overview

| Collection | Owner | Purpose |
|---|---|---|
| `restaurants` | Admin | Restaurant profile & global settings |
| `branches` | Admin | Physical outlets, location, timings, settings |
| `users` | Admin / Branch | Staff accounts |
| `refreshTokens` | System | Rotating refresh tokens (staff + customers) |
| `devices` | System | FCM tokens per staff device |
| `customers` | Online customers | Phone-OTP accounts, addresses |
| `masterCategories`, `masterItems` | Admin | Master menu |
| `branchCategories`, `branchItems` | Branch | Branch menu (copy + custom) |
| `areas`, `tables` | Branch | Sections and tables, QR tokens |
| `tableSessions` | System | One per table sitting |
| `orders` | Branch | Orders with embedded items/rounds |
| `payments` | Branch | Every payment attempt / record |
| `invoices` | Branch | Immutable tax invoices |
| `coupons`, `couponRedemptions` | Admin / Branch | Discounts |
| `reservations` | Branch | Table bookings |
| `counters` | System | Sequences (orderNo, kotNo, invoiceNo) |
| `auditLogs` | System | Sensitive-action trail |
| `notifications` | System | In-app notification feed (optional) |
| `idempotencyKeys` | System | (or Redis) |

---

## 2. Schemas

### 2.1 `restaurants`
```ts
{
  _id, name: 'Noodle Junction', slug, logoUrl, brandColor?,
  legalName, gstin?, fssai?, pan?,
  contact: { phone, email, website },
  settings: {
    priceIncludesTax: boolean,          // default menu price mode
    defaultTaxRate: number,             // e.g. 5
    currency: 'INR', timezone: 'Asia/Kolkata',
    serviceChargePercent: number        // 0 = disabled
  },
  isActive
}
```

### 2.2 `branches`
```ts
{
  _id, restaurantId, name, code: 'NOI01' /* unique per restaurant */,
  address: { line1, line2?, city, state, pincode },
  location: { type: 'Point', coordinates: [lng, lat] },   // 2dsphere
  phone, email?, gstin? /* override */, fssai?,
  timings: [{ day: 0-6, open: '10:00', close: '23:00', isClosed }],
  isActive, isPaused,                   // paused = not accepting online/QR orders
  services: { dineIn, takeaway, delivery },
  settings: {
    autoAcceptQrOrders: boolean,
    requireStaffConfirmationFirstOrder: boolean,
    acceptTimeoutSeconds: number,       // escalate/reassign
    packagingChargePaise: number,
    printKotOnNewOrder: boolean,
    guestCanRequestBill: boolean
  },
  delivery: {
    radiusKm: number,
    zone?: { type: 'Polygon', coordinates: [...] },
    feeSlabs: [{ uptoKm, feePaise }],
    minOrderPaise: number,
    freeDeliveryAbovePaise?: number,
    avgPrepMins: number
  },
  invoiceSeries: { prefix: 'NJ/NOI01' },
  menuImportedFromMasterAt?: Date
}
```
Indexes: `{restaurantId, code}` unique · `location` 2dsphere · `{restaurantId, isActive}`

### 2.3 `users` (staff)
```ts
{
  _id, restaurantId, branchId /* null for RESTAURANT_ADMIN */,
  name, email?, phone, passwordHash,
  role: 'RESTAURANT_ADMIN'|'BRANCH_MANAGER'|'CASHIER'|'KITCHEN'|'WAITER',
  permissions?: string[],               // optional overrides
  isActive, lastLoginAt, failedLoginCount, lockedUntil?
}
```
Indexes: `{email}` unique sparse · `{phone}` unique · `{branchId, role}`

### 2.4 `refreshTokens`
`{ _id, subjectType: 'USER'|'CUSTOMER', subjectId, familyId, tokenHash, deviceInfo, expiresAt, revokedAt?, replacedBy? }`
Index: `{tokenHash}` unique · TTL on `expiresAt`.

### 2.5 `devices`
`{ _id, userId, branchId, fcmToken, deviceId, platform: 'android', appVersion, lastSeenAt, isActive }`
Index: `{fcmToken}` unique · `{branchId, isActive}`

### 2.6 `customers`
```ts
{
  _id, restaurantId, phone /*unique*/, name?, email?,
  addresses: [{ _id, label, line1, landmark?, pincode, location: {type:'Point', coordinates}, isDefault }],
  isBlocked, lastOrderAt, totalOrders
}
```

### 2.7 Master menu
`masterCategories`: `{ _id, restaurantId, name, description?, imageUrl?, sortOrder, isActive }`

`masterItems`:
```ts
{
  _id, restaurantId, categoryId, name, description, imageUrl?, images[],
  foodType: 'VEG'|'NON_VEG'|'EGG',
  basePricePaise, taxRate, hsnSac?,
  variants: [{ _id, name: 'Half', pricePaise }],           // optional
  addonGroups: [{
    _id, name: 'Extras', min: 0, max: 3,
    options: [{ _id, name: 'Extra cheese', pricePaise }]
  }],
  tags: ['BESTSELLER','SPICY','CHEF_SPECIAL'],
  prepTimeMins?, isActive, sortOrder
}
```

### 2.8 Branch menu
`branchCategories`: same as master + `{ branchId, masterCategoryId | null, isCustom }`

`branchItems`: same shape as `masterItems` plus:
```ts
{
  branchId, masterItemId: ObjectId | null, isCustom: boolean,
  isAvailable: boolean,          // out-of-stock toggle
  isHidden: boolean,
  schedule?: [{ days: [0..6], from: '08:00', to: '11:30' }]
}
```
Indexes: `{branchId, categoryId, sortOrder}` · `{branchId, masterItemId}` (skip duplicates on re-import) · text index `{name, tags}` per branch.

### 2.9 `areas` and `tables`
`areas`: `{ _id, branchId, name: 'AC Hall', sortOrder, isActive }`

`tables`:
```ts
{
  _id, restaurantId, branchId, areaId?, number: 'T-12', label?, capacity,
  qrToken: 'k9F2x…',              // unique, opaque, rotatable
  qrVersion: 1,
  status: 'VACANT'|'OCCUPIED'|'BILL_REQUESTED'|'RESERVED'|'DISABLED',
  currentSessionId?: ObjectId, currentOrderId?: ObjectId,
  isActive
}
```
Indexes: `{qrToken}` unique · `{branchId, number}` unique (partial: isActive true)

### 2.10 `tableSessions`
```ts
{
  _id, restaurantId, branchId, tableId,
  status: 'OPEN'|'CLOSED'|'EXPIRED',
  orderId?,                           // the single running order
  participants: [{ deviceId, name?, joinedAt, userAgent, ipHash }],
  openedVia: 'QR'|'STAFF'|'RESERVATION',
  reservationId?,
  openedAt, closedAt?, closedBy?, closeReason?,
  lastActivityAt,
  requiresConfirmation: boolean, confirmedAt?
}
```
Indexes: **partial unique** `{tableId}` where `status='OPEN'` · `{branchId, status}` · TTL/cleanup job on `lastActivityAt`.

### 2.11 `orders`
```ts
{
  _id, restaurantId, branchId,
  orderNo, tokenNo?,
  type: 'DINE_IN'|'TAKEAWAY'|'DELIVERY',
  source: 'QR'|'POS'|'WEB',
  status: 'PENDING_PAYMENT'|'OPEN'|'BILL_REQUESTED'|'COMPLETED'|'CANCELLED',   // lifecycle
  fulfillmentStatus?: 'PLACED'|'ACCEPTED'|'PREPARING'|'READY'|'OUT_FOR_DELIVERY'|'DELIVERED'|'PICKED_UP'|'REJECTED',
  awaitingConfirmation: boolean,       // QR first order needing staff OK

  // dine-in
  tableId?, tableNumber?, tableSessionId?,

  // who
  customerId?, guest: { name?, phone?, deviceId? },
  createdBy: { kind: 'GUEST'|'CUSTOMER'|'STAFF', id? },

  // delivery
  delivery?: {
    address: { line1, landmark?, pincode, location },
    distanceKm, feePaise, assignedAt, reassignedFrom?: branchId[],
    riderName?, riderPhone?, dispatchedAt?, deliveredAt?
  },
  takeaway?: { pickupEta? },

  items: [{
    _id, branchItemId, name, foodType, variant?: { _id, name },
    addons: [{ name, pricePaise }],
    qty, unitPricePaise, linePricePaise, taxRate,
    notes?, roundNo,
    status: 'PENDING'|'PREPARING'|'READY'|'SERVED'|'CANCELLED',
    statusAt: { preparingAt?, readyAt?, servedAt?, cancelledAt? },
    cancelledBy?, cancelReason?, approvedBy?
  }],
  rounds: [{ roundNo, kotNo, placedAt, placedBy, itemCount }],
  instructions?,

  pricing: {
    subtotalPaise, discountPaise, taxPaise, cgstPaise, sgstPaise,
    chargesPaise: { packaging, delivery, service }, roundOffPaise, totalPaise,
    priceIncludesTax: boolean
  },
  coupon?: { couponId, code, discountPaise },
  manualDiscount?: { type, value, reason, approvedBy },

  payment: {
    status: 'UNPAID'|'PARTIAL'|'PAID'|'REFUNDED'|'PARTIAL_REFUND',
    paidPaise, balancePaise, preferredMode?: 'ONLINE'|'COD'|'COUNTER'
  },

  invoiceId?, billedAt?,
  cancelledAt?, cancelReason?, cancelledBy?,
  version: number,                     // optimistic concurrency
  completedAt?
}
```
Indexes:
- `{branchId, createdAt:-1}`
- `{branchId, status, createdAt:-1}`
- `{branchId, orderNo}` unique
- `{branchId, tableSessionId}`
- `{branchId, "items.status"}` (kitchen board)
- `{customerId, createdAt:-1}`
- `{branchId, "guest.phone"}` (search)

### 2.12 `payments`
```ts
{
  _id, restaurantId, branchId, orderId, invoiceId?,
  method: 'RAZORPAY'|'CASH'|'UPI'|'CARD'|'COD',
  amountPaise, status: 'CREATED'|'PAID'|'FAILED'|'REFUNDED'|'PARTIAL_REFUND',
  razorpay?: { orderId, paymentId, signature, method, vpa?, bank?, cardLast4?, rawWebhookEventId? },
  recordedBy?: { kind: 'STAFF'|'GUEST'|'CUSTOMER'|'WEBHOOK', id? },
  refunds: [{ refundId, amountPaise, reason, at, razorpayRefundId? }],
  paidAt?, failureReason?
}
```
Indexes: `{razorpay.paymentId}` unique sparse · `{razorpay.orderId}` · `{branchId, orderId}` · `{branchId, paidAt}`

### 2.13 `invoices`
```ts
{
  _id, restaurantId, branchId, orderId,
  invoiceNo, fy: '2026-27', seq,
  issuedAt,
  seller: { legalName, address, gstin, fssai },
  buyer?: { name, phone, gstin? },
  lines: [{ name, hsnSac, qty, unitPricePaise, taxablePaise, taxRate, cgstPaise, sgstPaise, totalPaise }],
  totals: { ...same shape as order.pricing },
  payments: [{ method, amountPaise }],
  status: 'ISSUED'|'CANCELLED',
  creditNotes: [{ noteNo, amountPaise, reason, at }],
  pdfUrl?
}
```
Index: `{branchId, fy, seq}` unique · `{invoiceNo}` unique. **Immutable** after issue.

### 2.14 `coupons`
```ts
{
  _id, restaurantId, scope: 'GLOBAL'|'BRANCH', branchIds: [],
  code: 'NOODLE10' (unique per restaurant, upper-case),
  title, description,
  type: 'PERCENT'|'FLAT', value, maxDiscountPaise?, minOrderPaise,
  orderTypes: ['DINE_IN','TAKEAWAY','DELIVERY'],
  validFrom, validTo, activeDays?, activeHours?,
  usageLimitTotal?, usageLimitPerUser?, firstOrderOnly,
  usedCount, isActive, createdBy
}
```
`couponRedemptions`: `{ couponId, orderId, customerId?/phone?, branchId, discountPaise, at }` — unique `{couponId, orderId}`.

### 2.15 `reservations`
```ts
{
  _id, restaurantId, branchId, code, name, phone, partySize,
  date, slotStart, slotEnd, tableIds: [], notes?,
  status: 'PENDING'|'CONFIRMED'|'SEATED'|'COMPLETED'|'NO_SHOW'|'CANCELLED',
  depositPaymentId?, tableSessionId?
}
```
Index: `{branchId, date, status}`

### 2.16 `counters`
`{ _id: 'order:NOI01:260921', seq: 42 }` · `{ _id: 'kot:…' }` · `{ _id: 'invoice:NOI01:2026-27', seq }`

### 2.17 `auditLogs`
`{ _id, restaurantId, branchId?, actor: { id, role, name }, action: 'ORDER_ITEM_CANCEL', entity: { type, id }, before?, after?, reason?, ip, at }`
Index: `{branchId, at:-1}` · `{entity.type, entity.id}`

---

## 3. Relationships

```
restaurants 1 ─── * branches 1 ─── * users(staff)
                     │ 1 ─── * tables ─── 1 tableSessions(open) ─── 1 orders ─── * payments
                     │ 1 ─── * branchItems  (copied from masterItems via masterItemId)
                     │ 1 ─── * orders ─── 0..1 invoices
customers 1 ─── * orders
coupons 1 ─── * couponRedemptions
```

## 4. Transactions required
Use multi-document transactions for:
1. Branch creation + master menu copy.
2. Invoice generation (counter allocation + invoice insert + order update).
3. Payment verification (payment update + order balance + coupon usage).
4. Table session close (session, table, order updates).
5. Order transfer/merge between tables.

## 5. Data retention
- Orders, invoices, payments: keep ≥ 8 years (tax records; confirm with CA).
- Guest session data (ipHash, user agent): purge after 90 days.
- Customer data: deletion/anonymization on request.
- Audit logs: keep ≥ 2 years.

## 6. Seed data (development)
1 restaurant (Noodle Junction) · 1 admin · 2 branches (`NOI01`, `GNO01`) with manager/cashier/kitchen each · master menu of ~30 items (noodles, momos, rice, soups, roti/dal) · 10 tables per branch · sample coupons.