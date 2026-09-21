# Noodle Junction — API Documentation (v1)

Base URL: `https://api.noodlejunction.in/api/v1` (local: `http://localhost:5000/api/v1`)

Related: [TRD](02-TRD.md) · [Events](05-EVENTS-AND-NOTIFICATIONS.md) · [Business rules](08-BUSINESS-RULES-AND-FLOWS.md)

> Status legend used in [07-WORKFLOW-TRACKER.md](07-WORKFLOW-TRACKER.md): each endpoint group maps to a module (M#). Update this doc as you implement; endpoints marked **(P2)** are later.

---

## 1. Conventions

### 1.1 Authentication
| Actor | How | Header / cookie |
|---|---|---|
| Staff (Admin, Manager, Cashier, Kitchen, Waiter) | JWT access token | `Authorization: Bearer <accessToken>` |
| Online customer | JWT access token (`role: CUSTOMER`) | `Authorization: Bearer <accessToken>` |
| Dine-in guest | Table-session token | Cookie `nj_ts` (HttpOnly) **or** header `X-Table-Session: <token>` |
| Public | none | — |

### 1.2 Response envelope
Success
```json
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 20, "total": 134 } }
```
Error
```json
{
  "success": false,
  "error": {
    "code": "ITEM_LOCKED",
    "message": "This item is already being prepared and can't be removed.",
    "details": [{ "field": "itemId", "issue": "status=PREPARING" }]
  },
  "requestId": "req_8f2c…"
}
```

### 1.3 Common query params (lists)
`page` (default 1) · `limit` (default 20, max 100) · `sort` (e.g. `-createdAt`) · `q` (search) · `from`, `to` (ISO dates)

### 1.4 Headers
| Header | Use |
|---|---|
| `Idempotency-Key` | Required on `POST` order create & payment create. Same key → same response |
| `X-Request-Id` | Optional client trace id |
| `X-App-Version` | Mobile app version (force-update support) |

### 1.5 Error codes
| HTTP | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Body/query invalid (details list fields) |
| 401 | `UNAUTHENTICATED`, `TOKEN_EXPIRED` | Missing/expired token |
| 401 | `SESSION_ENDED` | Table session closed |
| 403 | `FORBIDDEN` | Role lacks permission |
| 404 | `NOT_FOUND` | Also returned for other branch's resources |
| 409 | `CONFLICT`, `VERSION_CONFLICT` | Concurrent edit |
| 409 | `ITEM_LOCKED` | Item no longer removable |
| 409 | `ORDER_CLOSED` | Order already settled/cancelled |
| 409 | `TABLE_OCCUPIED` | |
| 422 | `ITEM_UNAVAILABLE` | Out of stock / not in schedule |
| 422 | `BRANCH_CLOSED`, `BRANCH_PAUSED` | Not accepting orders |
| 422 | `NOT_DELIVERABLE` | Address outside all delivery zones |
| 422 | `MIN_ORDER_NOT_MET` | |
| 422 | `COUPON_INVALID` (+ reason) | expired, min-order, used, scope |
| 422 | `PAYMENT_AMOUNT_MISMATCH`, `PAYMENT_SIGNATURE_INVALID` | |
| 429 | `RATE_LIMITED` | |
| 500 | `INTERNAL_ERROR` | |

### 1.6 Money and dates
All amounts are **integer paise**. Dates are ISO-8601 UTC strings.

---

## 2. Auth — Staff (M1)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | public | Email/phone + password |
| POST | `/auth/refresh` | refresh cookie/body | Rotate tokens |
| POST | `/auth/logout` | Bearer | Revoke refresh token (+ device token) |
| GET | `/auth/me` | Bearer | Current user, role, branch |
| POST | `/auth/change-password` | Bearer | |
| POST | `/auth/forgot-password` | public | Sends reset link/OTP |
| POST | `/auth/reset-password` | public | |

**POST /auth/login**
```json
// request
{ "identifier": "manager.noi@noodlejunction.in", "password": "••••••", "deviceId": "android-9f1a", "platform": "web" }
// 200
{
  "success": true,
  "data": {
    "accessToken": "eyJ…",
    "refreshToken": "opaque…",            // omitted for web (httpOnly cookie)
    "expiresIn": 900,
    "user": { "id": "u_1", "name": "Ravi", "role": "BRANCH_MANAGER",
              "restaurantId": "r_1", "branchId": "b_1", "branchName": "Noida Sector 62" }
  }
}
```

## 3. Auth — Customer (M14)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/customer/auth/otp/request` | public | `{ phone }` |
| POST | `/customer/auth/otp/verify` | public | `{ phone, otp, name? }` → tokens |
| POST | `/customer/auth/refresh` | — | |
| POST | `/customer/auth/logout` | Bearer | |
| GET | `/customer/me` | Bearer | |
| PATCH | `/customer/me` | Bearer | name, email |
| GET/POST/PATCH/DELETE | `/customer/addresses[/:id]` | Bearer | Address book |

---

## 4. Restaurant, branches, staff — Admin (M2)

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/admin/restaurant` | ADMIN | |
| PATCH | `/admin/restaurant` | ADMIN | Profile, GSTIN, settings |
| GET | `/admin/branches` | ADMIN | List |
| POST | `/admin/branches` | ADMIN | Create (+ optional `importMasterMenu: true`) |
| GET | `/admin/branches/:branchId` | ADMIN | |
| PATCH | `/admin/branches/:branchId` | ADMIN | |
| PATCH | `/admin/branches/:branchId/status` | ADMIN | `{ isActive }` |
| POST | `/admin/branches/:branchId/import-master-menu` | ADMIN | Copy master → branch (idempotent) |
| GET | `/admin/staff` | ADMIN | Filter by branch/role |
| POST | `/admin/staff` | ADMIN | Create staff (any branch) |
| PATCH | `/admin/staff/:userId` | ADMIN | |
| PATCH | `/admin/staff/:userId/status` | ADMIN | activate/deactivate |
| POST | `/admin/staff/:userId/reset-password` | ADMIN | |
| GET | `/branch/me` | Branch roles | Own branch profile & settings |
| PATCH | `/branch/settings` | MANAGER | Branch settings, delivery config, pause |
| GET/POST/PATCH | `/branch/staff[/:userId]` | MANAGER | Manage staff of own branch (not managers/admin) |

**POST /admin/branches**
```json
{
  "name": "Noodle Junction – Sector 62",
  "code": "NOI01",
  "address": { "line1": "…", "city": "Noida", "state": "Uttar Pradesh", "pincode": "201309" },
  "location": { "lat": 28.6271, "lng": 77.3649 },
  "phone": "+91…",
  "services": { "dineIn": true, "takeaway": true, "delivery": true },
  "delivery": { "radiusKm": 5, "feeSlabs": [{ "uptoKm": 2, "feePaise": 2000 }, { "uptoKm": 5, "feePaise": 4000 }], "minOrderPaise": 20000 },
  "importMasterMenu": true
}
```

---

## 5. Master menu — Admin (M3)

| Method | Path | Description |
|---|---|---|
| GET/POST | `/admin/master-menu/categories` | |
| PATCH/DELETE | `/admin/master-menu/categories/:id` | |
| PATCH | `/admin/master-menu/categories/reorder` | `{ ids: [] }` |
| GET/POST | `/admin/master-menu/items` | Filter: `categoryId`, `q`, `foodType` |
| GET/PATCH/DELETE | `/admin/master-menu/items/:id` | |
| POST | `/admin/media/upload` | multipart → `{ url }` (image ≤ 2 MB, jpeg/png/webp) |

**POST /admin/master-menu/items**
```json
{
  "categoryId": "c_noodles", "name": "Hakka Noodles", "description": "Wok-tossed…",
  "foodType": "VEG", "basePricePaise": 18000, "taxRate": 5, "hsnSac": "9963",
  "variants": [{ "name": "Half", "pricePaise": 12000 }, { "name": "Full", "pricePaise": 18000 }],
  "addonGroups": [{ "name": "Extras", "min": 0, "max": 2, "options": [{ "name": "Extra veggies", "pricePaise": 2000 }] }],
  "tags": ["BESTSELLER"], "imageUrl": "https://…"
}
```

## 6. Branch menu (M4)

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/branch/menu` | Branch roles | Full menu tree (categories → items) |
| POST | `/branch/menu/import-master` | MANAGER | Copy master items not yet imported |
| GET/POST/PATCH/DELETE | `/branch/menu/categories[/:id]` | MANAGER | Custom categories |
| GET | `/branch/menu/items` | Branch roles | List/search |
| POST | `/branch/menu/items` | MANAGER | Add **custom** item (`isCustom: true`) |
| PATCH | `/branch/menu/items/:id` | MANAGER | Price, description, variants, tax, schedule, hidden |
| PATCH | `/branch/menu/items/:id/availability` | MANAGER, CASHIER, KITCHEN | `{ isAvailable }` — real-time to guests |
| DELETE | `/branch/menu/items/:id` | MANAGER | Soft delete |
| GET | `/branch/menu/master-updates` | MANAGER | **(P2)** New/changed master items diff |

---

## 7. Tables & QR (M5)

| Method | Path | Role | Description |
|---|---|---|---|
| GET/POST/PATCH/DELETE | `/branch/areas[/:id]` | MANAGER | Sections |
| GET | `/branch/tables` | Branch roles | With current status |
| POST | `/branch/tables` | MANAGER | `{ number, areaId?, capacity }` or bulk `{ from: 1, to: 20, prefix: "T-" }` |
| PATCH | `/branch/tables/:id` | MANAGER | |
| DELETE | `/branch/tables/:id` | MANAGER | Only when no open session |
| POST | `/branch/tables/:id/qr/rotate` | MANAGER | New `qrToken`; old one stops working |
| GET | `/branch/tables/:id/qr` | Branch roles | PNG/SVG (`?format=svg`) |
| GET | `/branch/tables/qr-sheet` | MANAGER | PDF with all/selected tables (`?ids=`) |

QR encodes: `https://order.noodlejunction.in/t/{qrToken}`

---

## 8. Public + Guest — table session and ordering (M6, M10)

### 8.1 Public (no auth)
| Method | Path | Description |
|---|---|---|
| GET | `/public/qr/:qrToken` | Resolve table → `{ branch{name,isOpen,services}, table{number}, hasOpenSession }` |
| POST | `/public/table-sessions` | Body `{ qrToken, deviceId, name? }` → start/join; sets `nj_ts` cookie |
| GET | `/public/branches/:branchId/menu` | Menu for online ordering (takeaway/delivery browse) |

**GET /public/qr/:qrToken** → 200
```json
{ "success": true, "data": {
  "branch": { "id": "b_1", "name": "Noodle Junction – Sector 62", "isOpen": true, "acceptingOrders": true },
  "table": { "number": "T-12", "area": "AC Hall" },
  "hasOpenSession": false
} }
```
Errors: `NOT_FOUND` (bad/rotated token), `BRANCH_CLOSED`, `BRANCH_PAUSED`.

**POST /public/table-sessions** → 201
```json
{ "success": true, "data": {
  "sessionId": "ts_91", "joined": false,
  "table": { "id": "t_12", "number": "T-12" },
  "orderId": null,
  "token": "eyJ…"      // also set as HttpOnly cookie nj_ts
} }
```

### 8.2 Guest (table-session token)
| Method | Path | Description |
|---|---|---|
| GET | `/guest/session` | Session, table, branch, current order summary |
| GET | `/guest/menu` | Categories + items (available flag, schedules applied) |
| POST | `/guest/cart/quote` | Price preview for a cart (+ coupon) — no order created |
| POST | `/guest/order/rounds` | **Place order / add more items** (creates order on first call, appends KOT round afterwards) |
| GET | `/guest/order` | Full running order with item statuses |
| DELETE | `/guest/order/items/:itemId` | Remove item — only if `PENDING` (else `ITEM_LOCKED`) |
| PATCH | `/guest/order/items/:itemId` | Reduce qty — only if `PENDING` |
| POST | `/guest/order/request-bill` | Notify counter; table → `BILL_REQUESTED` |
| POST | `/guest/order/coupon` | `{ code }` apply coupon |
| DELETE | `/guest/order/coupon` | |
| POST | `/guest/payments/razorpay/order` | Create Razorpay order for **current balance** |
| POST | `/guest/payments/razorpay/verify` | Verify signature after checkout |
| POST | `/guest/payments/pay-later` | `{ mode: "COUNTER" }` mark preferred COD/counter |

**POST /guest/order/rounds** (header `Idempotency-Key`)
```json
{
  "items": [
    { "branchItemId": "i_101", "variantId": "v_full", "qty": 2,
      "addonOptionIds": ["ao_1"], "notes": "less spicy" },
    { "branchItemId": "i_240", "qty": 4 }
  ],
  "instructions": "Serve together",
  "paymentPreference": "COUNTER"          // or "ONLINE"
}
```
→ 201 (first round) / 200 (add-on)
```json
{ "success": true, "data": {
  "orderId": "o_5501", "orderNo": "NJ-NOI01-260921-0042", "roundNo": 2, "kotNo": 118,
  "awaitingConfirmation": false,
  "order": {
    "status": "OPEN",
    "items": [
      { "id": "oi_1", "name": "Hakka Noodles (Full)", "qty": 2, "roundNo": 1, "status": "PREPARING", "linePricePaise": 40000 },
      { "id": "oi_9", "name": "Butter Roti", "qty": 4, "roundNo": 2, "status": "PENDING", "linePricePaise": 12000 }
    ],
    "pricing": { "subtotalPaise": 52000, "taxPaise": 2600, "totalPaise": 54600 },
    "payment": { "status": "UNPAID", "paidPaise": 0, "balancePaise": 54600 }
  }
} }
```

**DELETE /guest/order/items/:itemId** → 409
```json
{ "success": false, "error": { "code": "ITEM_LOCKED", "message": "This item is already being prepared and can't be removed." } }
```

**POST /guest/payments/razorpay/order** → 201
```json
{ "success": true, "data": {
  "razorpayOrderId": "order_Nx…", "amountPaise": 54600, "currency": "INR",
  "keyId": "rzp_live_xxx", "paymentId": "p_77",
  "prefill": { "name": "Guest T-12" }
} }
```
**POST /guest/payments/razorpay/verify**
```json
{ "razorpay_order_id": "order_Nx…", "razorpay_payment_id": "pay_Nx…", "razorpay_signature": "…" }
```
→ `{ "data": { "paymentStatus": "PAID", "order": { "payment": { "status": "PAID", "balancePaise": 0 } } } }`

---

## 9. Branch order management (M7, M9, M12)

Roles: MANAGER, CASHIER (all), WAITER (view, add items, serve), KITCHEN (kitchen endpoints, item status). Admin has **read-only** access under `/admin/reports`, not here.

### 9.1 Orders
| Method | Path | Description |
|---|---|---|
| GET | `/branch/orders` | Filters: `type, status, fulfillmentStatus, tableId, paymentStatus, from, to, updatedSince, q` |
| GET | `/branch/orders/search?q=` | Search by **orderNo, tokenNo, table number, customer phone/name** |
| GET | `/branch/orders/:orderId` | Full detail (by id **or** orderNo) |
| POST | `/branch/orders` | **Manual/POS order** (creates or appends to table's open order) |
| POST | `/branch/orders/:orderId/rounds` | Add items (add-on) to open order |
| PATCH | `/branch/orders/:orderId/items/:itemId` | Change qty / notes (PENDING only, or manager) |
| POST | `/branch/orders/:orderId/items/:itemId/cancel` | `{ reason }` — PREPARING+ needs manager approval (`approvedBy` / PIN) |
| PATCH | `/branch/orders/:orderId/items/:itemId/status` | `{ status: PREPARING|READY|SERVED }` |
| PATCH | `/branch/orders/:orderId/items/status` | Bulk `{ itemIds[], status }` (e.g. whole KOT ready) |
| POST | `/branch/orders/:orderId/confirm` | Confirm order awaiting confirmation |
| POST | `/branch/orders/:orderId/accept` | Takeaway/delivery accept `{ etaMins }` |
| POST | `/branch/orders/:orderId/reject` | `{ reason }` (triggers reassign for delivery) |
| PATCH | `/branch/orders/:orderId/fulfillment` | `{ status: PREPARING|READY|OUT_FOR_DELIVERY|DELIVERED|PICKED_UP, rider? }` |
| POST | `/branch/orders/:orderId/discount` | Manual discount `{ type, value, reason }` (manager) |
| POST | `/branch/orders/:orderId/coupon` | `{ code }` |
| POST | `/branch/orders/:orderId/transfer-table` | `{ toTableId }` |
| POST | `/branch/orders/:orderId/merge` | `{ intoOrderId }` |
| POST | `/branch/orders/:orderId/cancel` | `{ reason }` — unpaid/whole order |
| POST | `/branch/orders/:orderId/bill` | Generate invoice → `{ invoiceId, invoiceNo }` |
| POST | `/branch/orders/:orderId/payments` | Record payment(s) — cash/UPI/card (supports split) |
| POST | `/branch/orders/:orderId/payments/razorpay/order` | Razorpay order/link for balance (P2 link) |
| POST | `/branch/orders/:orderId/close` | Settle & close (balance must be 0 or forced by manager) → closes session, table vacant |

**POST /branch/orders** (manual order)
```json
{
  "type": "DINE_IN",
  "tableId": "t_12",                    // optional for TAKEAWAY/DELIVERY
  "customer": { "name": "Amit", "phone": "98…" },
  "items": [{ "branchItemId": "i_101", "variantId": "v_full", "qty": 2 }],
  "couponCode": "NOODLE10",
  "delivery": { "address": { "line1": "…", "location": { "lat": 28.6, "lng": 77.3 } } },   // DELIVERY only
  "payNow": { "method": "CASH", "amountPaise": 54600 }                                     // optional
}
```
If `tableId` has an OPEN session/order → items are appended as a new round (response has `appended: true`).

### 9.2 Live tables ("ongoing meals") — M9
| Method | Path | Description |
|---|---|---|
| GET | `/branch/live-tables` | All tables + status + running order summary `{ orderNo, total, balance, itemsPending, minutesSinceSeated }` |
| POST | `/branch/tables/:id/open-session` | Staff opens session (walk-in, no QR) |
| GET | `/branch/orders/ongoing` | Open dine-in orders (feeds ongoing meals page) |

### 9.3 Kitchen (KDS) — M9
| Method | Path | Description |
|---|---|---|
| GET | `/branch/kitchen/tickets` | Items grouped by KOT: `status=PENDING,PREPARING` |
| PATCH | `/branch/kitchen/tickets/:orderId/:roundNo/status` | Start/Ready for whole KOT |
| POST | `/branch/kitchen/tickets/:orderId/:roundNo/reprint` | |

### 9.4 Invoices
| Method | Path | Description |
|---|---|---|
| GET | `/branch/invoices` | List/filter |
| GET | `/branch/invoices/:id` | JSON |
| GET | `/branch/invoices/:id/pdf` | PDF (A4) |
| GET | `/branch/invoices/:id/print` | HTML for 58/80 mm thermal |
| POST | `/branch/invoices/:id/credit-note` | Manager (P1) |

---

## 10. Coupons (M13)

| Method | Path | Role | Description |
|---|---|---|---|
| GET/POST | `/admin/coupons` | ADMIN | Global or branch-scoped |
| GET/PATCH/DELETE | `/admin/coupons/:id` | ADMIN | |
| GET/POST/PATCH | `/branch/coupons[/:id]` | MANAGER (if permitted) | Branch-only coupons |
| POST | `/coupons/validate` | guest / customer / staff | `{ code, orderContext }` → discount preview |
| GET | `/customer/coupons/available` | customer | Eligible list |

**POST /coupons/validate** → 200
```json
{ "success": true, "data": { "code": "NOODLE10", "type": "PERCENT", "discountPaise": 5200, "message": "10% off applied" } }
```
422 example: `{ "error": { "code": "COUPON_INVALID", "details": [{ "reason": "MIN_ORDER_NOT_MET", "minOrderPaise": 30000 }] } }`

---

## 11. Online ordering — takeaway & delivery (M14, M15)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/customer/branches/nearby?lat=&lng=&type=TAKEAWAY` | public/customer | Branches sorted by distance (takeaway pick) |
| POST | `/customer/delivery/check` | public/customer | `{ lat, lng }` → `{ deliverable, branch{id,name}, distanceKm, feePaise, etaMins }` |
| POST | `/customer/checkout/quote` | customer | Cart + address/branch + coupon → full price breakdown (server assigns branch for delivery) |
| POST | `/customer/orders` | customer | Place order (`Idempotency-Key`). Body `paymentMode: ONLINE|COD` |
| POST | `/customer/orders/:id/payments/razorpay/order` | customer | |
| POST | `/customer/orders/:id/payments/razorpay/verify` | customer | |
| GET | `/customer/orders` | customer | History |
| GET | `/customer/orders/:id` | customer | Live status |
| POST | `/customer/orders/:id/cancel` | customer | Only before `ACCEPTED`/`PREPARING` per policy |
| POST | `/customer/orders/:id/reorder` | customer | Rebuild cart |

**POST /customer/delivery/check**
```json
// request
{ "lat": 28.6271, "lng": 77.3649 }
// 200
{ "success": true, "data": { "deliverable": true,
  "branch": { "id": "b_1", "name": "Noodle Junction – Sector 62" },
  "distanceKm": 3.2, "feePaise": 4000, "etaMins": 40, "minOrderPaise": 20000 } }
// 422 NOT_DELIVERABLE
```

**POST /customer/orders**
```json
{
  "type": "DELIVERY",
  "items": [{ "branchItemId": "i_101", "qty": 2 }],
  "addressId": "addr_2",
  "couponCode": "NOODLE10",
  "paymentMode": "ONLINE",
  "instructions": "Ring the bell twice"
}
```
Note: `branchItemId` refers to the **assigned** branch's items; the client fetches the menu via `/customer/checkout/quote` (which returns the resolved `branchId` and the item mapping by `masterItemId`). Custom branch-only items may be unavailable for other branches.

---

## 12. Payments — webhook (M11)

| Method | Path | Description |
|---|---|---|
| POST | `/webhooks/razorpay` | Signature-verified (`X-Razorpay-Signature`, raw body). Events: `payment.captured`, `payment.failed`, `refund.processed`, `order.paid`. Always returns 200 quickly after enqueue; idempotent |
| POST | `/branch/payments/:paymentId/refund` | Manager. `{ amountPaise, reason }` |
| GET | `/branch/payments` | List/filter/reconcile |

---

## 13. Notifications & devices (M8, M16)

| Method | Path | Description |
|---|---|---|
| POST | `/devices/register` | `{ fcmToken, deviceId, platform, appVersion }` |
| DELETE | `/devices/:deviceId` | On logout |
| GET | `/branch/notifications` | Recent alerts feed |
| POST | `/branch/notifications/:id/ack` | Acknowledge (stops escalation) |

Real-time via Socket.IO: see [05-EVENTS-AND-NOTIFICATIONS.md](05-EVENTS-AND-NOTIFICATIONS.md).

---

## 14. Reservations (M17)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/public/branches/:id/availability?date=&partySize=` | public | Available slots |
| POST | `/public/reservations/otp` | public | Send OTP to phone |
| POST | `/public/reservations` | OTP-verified | Create (PENDING/CONFIRMED by branch setting) |
| GET | `/public/reservations/:code` | with phone | Status |
| POST | `/public/reservations/:code/cancel` | with phone | |
| GET | `/branch/reservations` | Branch roles | Filter by date/status |
| PATCH | `/branch/reservations/:id` | Branch roles | confirm / decline / assign tables / no-show |
| POST | `/branch/reservations/:id/seat` | Branch roles | Opens table session, table → OCCUPIED |

---

## 15. Reports (M18)

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/branch/reports/sales` | MANAGER | `from,to,groupBy=day|hour|type|payment` |
| GET | `/branch/reports/items` | MANAGER | Top / bottom items |
| GET | `/branch/reports/cancellations` | MANAGER | Cancelled items with reasons |
| GET | `/branch/reports/tax` | MANAGER | GST summary |
| GET | `/admin/reports/sales` | ADMIN | Across branches; `branchId?` filter |
| GET | `/admin/reports/branches-comparison` | ADMIN | |
| GET | `/admin/reports/coupons` | ADMIN | |
| GET | `/admin/audit-logs` | ADMIN | |
| GET | `…/export?format=csv` | | Append to any report (P2) |

---

## 16. Health & utility
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness (DB, Redis status) |
| GET | `/version` | API + min supported app version |

---

## 17. Rate limits (defaults)
| Scope | Limit |
|---|---|
| Login | 5 / 15 min / identifier+IP |
| OTP request | 3 / 10 min / phone, 10 / hour / IP |
| Guest order create | 10 / min / session |
| Public QR resolve | 30 / min / IP |
| General authenticated | 300 / min / user |

## 18. Postman / OpenAPI
Generate an OpenAPI 3 spec from the zod schemas (`zod-to-openapi`) at `/api/docs` in non-production, and export a Postman collection per module as each module is completed.