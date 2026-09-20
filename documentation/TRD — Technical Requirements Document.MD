# Technical Requirements Document (TRD)

## Smart Restaurant QR Ordering & Management System

**Version:** 1.0
**Date:** September 18, 2026
**Architecture:** Monolithic, Service-Based Backend
**Frontend:** Next.js + Tailwind CSS + Redux Toolkit
**Admin App:** React Native + Expo
**Backend:** Node.js + Express.js
**Database:** MongoDB + Mongoose

---

# 1. Technical Overview

## 1.1 System Objective

Build a restaurant ordering and management system with:

* QR-based guest ordering.
* Dine-in, takeaway, and delivery.
* Menu management.
* Order lifecycle management.
* Order modification.
* Payment processing.
* Invoice generation.
* Coupon and discount management.
* Manual order entry.
* Sales reporting.
* Admin push notifications.

## 1.2 Architecture Decision

The application will use a **monolithic architecture** with service-based organization.

All backend services run inside one deployable Node.js application.

Example:

```text
One Backend Application
        │
        ├── Auth Service
        ├── Menu Service
        ├── Table Service
        ├── QR Service
        ├── Guest Session Service
        ├── Order Service
        ├── Pricing Service
        ├── Payment Service
        ├── Invoice Service
        ├── Coupon Service
        ├── Notification Service
        └── Report Service
```

Advantages:

* Simple deployment.
* Easy local development.
* Shared database.
* Low operational complexity.
* Services can be extracted into microservices later if needed.

---

# 2. High-Level Architecture

```text
                    ┌────────────────────┐
                    │   Customer Web App │
                    │     Next.js        │
                    │     Tailwind       │
                    └─────────┬──────────┘
                              │
                              │ REST API
                              │
                    ┌─────────▼──────────┐
                    │   Express Backend  │
                    │    Monolithic      │
                    ├────────────────────┤
                    │ Routes             │
                    │ Controllers        │
                    │ Services           │
                    │ Models             │
                    │ Validators         │
                    │ Middleware         │
                    └─────┬─────┬────────┘
                          │     │
                ┌─────────▼┐   ┌▼─────────────┐
                │ MongoDB  │   │ External     │
                │ Database │   │ Services     │
                └──────────┘   ├──────────────┤
                               │ Payment      │
                               │ Push         │
                               │ Image Storage│
                               │ PDF          │
                               └──────────────┘
                                      ▲
                                      │
                    ┌─────────────────┴─────┐
                    │ Admin Mobile App      │
                    │ React Native + Expo   │
                    │ Redux Toolkit         │
                    └───────────────────────┘
```

---

# 3. Frontend Technical Requirements

## 3.1 Customer Web App

### Technology

* Next.js.
* Tailwind CSS.
* Redux Toolkit.
* RTK Query.
* JavaScript initially or TypeScript after confirmation.

### Responsibilities

* QR resolution.
* Menu rendering.
* Food details.
* Variant selection.
* Add-on selection.
* Cart.
* Checkout.
* Guest session.
* Order status.
* Customer authentication for delivery.
* Customer order history.

### Suggested folder structure

```text
customer-web/
├── app/
│   ├── page.jsx
│   ├── order/
│   │   └── qr/
│   │       └── [token]/
│   │           └── page.jsx
│   ├── menu/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── account/
│
├── components/
│   ├── menu/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   └── common/
│
├── store/
│   ├── store.js
│   ├── slices/
│   └── services/
│
├── lib/
│   ├── apiClient.js
│   ├── guestSession.js
│   └── pricing.js
│
└── styles/
```

## 3.2 Admin Mobile App

### Technology

* React Native.
* Expo.
* Redux Toolkit.
* RTK Query.
* Expo Notifications.
* React Navigation.

### Screens

```text
Admin App
├── Login
├── Dashboard
├── Orders
│   ├── New
│   ├── Active
│   ├── Completed
│   └── Cancelled
├── Order Details
├── Create Manual Order
├── Menu
│   ├── Categories
│   ├── Items
│   ├── Variants
│   └── Add-ons
├── Tables & QR
├── Coupons
├── Reports
├── Notifications
├── Settings
└── Profile
```

### Admin app requirements

* Android phone support.
* Android tablet support.
* Responsive layouts.
* Push notification handling.
* Background notification tap navigation.
* Pull-to-refresh.
* Loading/error/empty states.
* Offline-friendly read cache.
* Role-based screen access.

---

# 4. Backend Technical Requirements

## 4.1 Node.js + Express

Backend responsibilities:

* REST APIs.
* Authentication.
* Authorization.
* Request validation.
* Business logic.
* Pricing.
* Order lifecycle.
* Payment integration.
* Invoice generation.
* Notifications.
* Reporting.
* Database operations.

## 4.2 Backend Folder Structure

```text
backend/
├── src/
│   ├── index.js
│   ├── app.js
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   ├── logger.js
│   │   ├── payment.js
│   │   └── notifications.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── restaurant.routes.js
│   │   ├── category.routes.js
│   │   ├── menu.routes.js
│   │   ├── addon.routes.js
│   │   ├── table.routes.js
│   │   ├── qr.routes.js
│   │   ├── guest.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── invoice.routes.js
│   │   ├── coupon.routes.js
│   │   ├── report.routes.js
│   │   ├── delivery.routes.js
│   │   └── notification.routes.js
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── restaurant.service.js
│   │   ├── menu.service.js
│   │   ├── table.service.js
│   │   ├── qr.service.js
│   │   ├── guestSession.service.js
│   │   ├── order.service.js
│   │   ├── orderPricing.service.js
│   │   ├── payment.service.js
│   │   ├── invoice.service.js
│   │   ├── coupon.service.js
│   │   ├── notification.service.js
│   │   ├── delivery.service.js
│   │   └── report.service.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Restaurant.js
│   │   ├── RestaurantSettings.js
│   │   ├── Category.js
│   │   ├── MenuItem.js
│   │   ├── AddonGroup.js
│   │   ├── Table.js
│   │   ├── QRCode.js
│   │   ├── GuestSession.js
│   │   ├── Customer.js
│   │   ├── Address.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── OrderModification.js
│   │   ├── Payment.js
│   │   ├── Invoice.js
│   │   ├── Coupon.js
│   │   ├── Notification.js
│   │   └── DeviceToken.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── guestSession.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── validators/
│   ├── utils/
│   ├── constants/
│   ├── jobs/
│   └── tests/
│
├── .env.example
├── package.json
└── README.md
```

---

# 5. Database Design

MongoDB is the primary database.

## 5.1 Restaurant

```js
{
  _id: ObjectId,
  name: String,
  slug: String,
  logo: String,
  phone: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [Number, Number]
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

GeoJSON coordinates use:

```text
[longitude, latitude]
```

## 5.2 RestaurantSettings

```js
{
  restaurantId: ObjectId,

  dineInEnabled: Boolean,
  takeawayEnabled: Boolean,
  deliveryEnabled: Boolean,

  onlinePaymentEnabled: Boolean,
  cashPaymentEnabled: Boolean,
  couponEnabled: Boolean,

  isOpen: Boolean,
  openingHours: [],

  deliveryRadiusKm: Number,
  deliveryFee: Number,
  minimumDeliveryAmount: Number,

  taxEnabled: Boolean,
  taxRate: Number,
  serviceChargeRate: Number,
  packagingCharge: Number,

  createdAt: Date,
  updatedAt: Date
}
```

## 5.3 Category

```js
{
  restaurantId: ObjectId,
  name: String,
  description: String,
  sortOrder: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 5.4 MenuItem

```js
{
  restaurantId: ObjectId,
  categoryId: ObjectId,

  name: String,
  description: String,
  image: String,

  isVeg: Boolean,
  isActive: Boolean,
  isAvailable: Boolean,

  variants: [
    {
      _id: ObjectId,
      name: String,
      description: String,
      price: Number,
      isAvailable: Boolean
    }
  ],

  addonGroupIds: [ObjectId],

  preparationTime: Number,

  createdAt: Date,
  updatedAt: Date
}
```

## 5.5 AddonGroup

```js
{
  restaurantId: ObjectId,
  name: String,
  selectionType: "SINGLE" | "MULTIPLE",
  required: Boolean,

  options: [
    {
      _id: ObjectId,
      name: String,
      price: Number,
      isAvailable: Boolean
    }
  ],

  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 5.6 Table

```js
{
  restaurantId: ObjectId,
  tableNumber: String,
  capacity: Number,
  status: "ACTIVE" | "INACTIVE",
  createdAt: Date,
  updatedAt: Date
}
```

## 5.7 QRCode

```js
{
  restaurantId: ObjectId,
  type: "DINE_IN" | "TAKEAWAY",
  tableId: ObjectId,
  tokenHash: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

The stored QR token should be securely hashed where practical. The public QR contains the token needed for lookup.

## 5.8 GuestSession

```js
{
  restaurantId: ObjectId,
  tableId: ObjectId,
  qrCodeId: ObjectId,

  sessionTokenHash: String,

  activeOrderId: ObjectId,

  status: "ACTIVE" | "EXPIRED" | "CLOSED",

  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 5.9 Customer

```js
{
  name: String,
  email: String,
  phone: String,
  passwordHash: String,

  role: "CUSTOMER",

  isActive: Boolean,

  createdAt: Date,
  updatedAt: Date
}
```

## 5.10 Order

```js
{
  restaurantId: ObjectId,

  orderNumber: String,

  orderMode: "DINE_IN" | "TAKEAWAY" | "DELIVERY",

  orderSource: "QR" | "ADMIN" | "ONLINE",

  tableId: ObjectId,
  guestSessionId: ObjectId,
  customerId: ObjectId,

  status: String,

  isLocked: Boolean,
  invoiceId: ObjectId,

  items: [
    {
      menuItemId: ObjectId,
      variantId: ObjectId,

      itemName: String,
      variantName: String,

      quantity: Number,
      unitPrice: Number,

      addons: [
        {
          addonId: ObjectId,
          name: String,
          price: Number
        }
      ],

      specialInstructions: String,

      lineTotal: Number
    }
  ],

  pricing: {
    subtotal: Number,
    discountAmount: Number,
    couponDiscount: Number,
    taxAmount: Number,
    serviceCharge: Number,
    packagingCharge: Number,
    deliveryFee: Number,
    grandTotal: Number
  },

  couponId: ObjectId,
  couponCode: String,

  paymentStatus: String,
  paymentMethod: String,
  paymentType: String,

  customerSnapshot: {
    name: String,
    phone: String,
    address: String
  },

  createdAt: Date,
  acceptedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  servedAt: Date,
  completedAt: Date,
  updatedAt: Date
}
```

## 5.11 OrderModification

```js
{
  restaurantId: ObjectId,
  orderId: ObjectId,

  actorType: "CUSTOMER" | "ADMIN",
  actorId: ObjectId,

  action: String,

  itemName: String,
  oldValue: Object,
  newValue: Object,

  reason: String,

  createdAt: Date
}
```

## 5.12 Payment

```js
{
  restaurantId: ObjectId,
  orderId: ObjectId,

  method: "CASH" | "ONLINE",
  paymentType: "PAY_NOW" | "PAY_LATER",

  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED",

  amount: Number,
  currency: "INR",

  gateway: String,
  gatewayOrderId: String,
  gatewayPaymentId: String,

  idempotencyKey: String,

  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 5.13 Invoice

```js
{
  restaurantId: ObjectId,
  orderId: ObjectId,

  invoiceNumber: String,

  items: [],
  pricing: {},

  paymentMethod: String,
  paymentStatus: String,

  totalAmount: Number,

  status: "GENERATED" | "VOID",

  generatedBy: ObjectId,
  generatedAt: Date,

  pdfUrl: String,

  createdAt: Date
}
```

## 5.14 Coupon

```js
{
  restaurantId: ObjectId,

  code: String,

  discountType: "PERCENTAGE" | "FIXED",
  discountValue: Number,
  maxDiscount: Number,

  minimumOrderAmount: Number,

  usageLimit: Number,
  usedCount: Number,
  usagePerCustomer: Number,

  startDate: Date,
  endDate: Date,

  applicableOrderModes: [
    "DINE_IN",
    "TAKEAWAY",
    "DELIVERY"
  ],

  enabled: Boolean,

  createdAt: Date,
  updatedAt: Date
}
```

---

# 6. Indexing Strategy

Recommended indexes:

```js
// Menu
{ restaurantId: 1, categoryId: 1, isActive: 1 }

// Menu availability
{ restaurantId: 1, isAvailable: 1 }

// Table uniqueness
{ restaurantId: 1, tableNumber: 1 }

// QR token lookup
{ tokenHash: 1 }

// Orders
{ restaurantId: 1, createdAt: -1 }

// Active orders
{ restaurantId: 1, status: 1, createdAt: -1 }

// Guest sessions
{ sessionTokenHash: 1 }

// Guest expiry
{ expiresAt: 1 }

// Payments
{ orderId: 1 }

// Invoices
{ restaurantId: 1, invoiceNumber: 1 }

// Coupons
{ restaurantId: 1, code: 1 }
```

Use unique indexes where business rules require uniqueness.

---

# 7. Service Layer Design

## 7.1 Auth Service

Responsibilities:

* Login.
* Registration.
* Password hashing.
* Token generation.
* Password reset.
* Role validation.

## 7.2 Menu Service

Responsibilities:

* Create menu item.
* Update menu item.
* Validate variants.
* Validate add-ons.
* Manage availability.
* Fetch public menu.

## 7.3 QR Service

Responsibilities:

* Generate secure QR token.
* Resolve QR.
* Validate table.
* Generate takeaway QR.
* Deactivate QR.

## 7.4 Guest Session Service

Responsibilities:

* Create session.
* Restore session.
* Validate session.
* Expire session.
* Associate active order.

## 7.5 Order Service

Responsibilities:

* Create order.
* Validate order mode.
* Validate status transition.
* Add item.
* Remove item.
* Modify order.
* Lock order.
* Cancel order.
* Record modifications.

## 7.6 Pricing Service

Responsibilities:

* Calculate item prices.
* Calculate variant prices.
* Calculate add-on prices.
* Calculate subtotal.
* Apply discounts.
* Validate coupon.
* Calculate tax.
* Calculate fees.
* Calculate grand total.

The pricing service must be shared by customer checkout and admin manual orders.

## 7.7 Payment Service

Responsibilities:

* Create payment.
* Initiate online payment.
* Verify gateway payment.
* Process webhook.
* Record cash payment.
* Handle refund.

## 7.8 Invoice Service

Responsibilities:

* Generate invoice.
* Generate invoice number.
* Store invoice snapshot.
* Generate PDF.
* Lock order.

## 7.9 Notification Service

Responsibilities:

* Store device tokens.
* Send push notification.
* Send admin notification.
* Send customer notification.
* Handle failed delivery.
* Support notification history.

## 7.10 Report Service

Responsibilities:

* Calculate sales.
* Calculate revenue metrics.
* Calculate payment collections.
* Calculate top-selling items.
* Generate date-range reports.

---

# 8. Order Lifecycle

## 8.1 State Machine

```text
PENDING
   │
   ├── REJECTED
   │
   ├── CANCELLED
   │
   └── ACCEPTED
          │
          ├── CANCELLED
          │
          └── PREPARING
                 │
                 └── READY
                       │
                       ├── SERVED       (DINE_IN)
                       ├── PICKED_UP    (TAKEAWAY)
                       └── OUT_FOR_DELIVERY (DELIVERY)
                                      │
                                      └── DELIVERED
```

After the food is served/picked up/delivered, the order can be completed.

Invoice generation locks the order.

## 8.2 Status Validation

Allowed transitions:

```js
const transitions = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["SERVED", "PICKED_UP", "OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  SERVED: ["COMPLETED"],
  PICKED_UP: ["COMPLETED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: []
};
```

Additional rules:

* Only authorized roles can update status.
* Status transition must be checked server-side.
* Locked orders cannot be modified.
* Cancelled and rejected orders cannot move to active states.
* Delivery statuses are valid only for delivery orders.
* Dine-in statuses are valid only for dine-in orders.

---

# 9. Pricing and Invoice Rules

## 9.1 Price Calculation

```text
Item price
× Quantity
+
Add-on prices
=
Line total
```

Then:

```text
Subtotal
- Admin discount
- Coupon discount
+ Tax
+ Service charge
+ Packaging charge
+ Delivery fee
=
Grand total
```

The exact tax and discount order must be configured and tested.

## 9.2 Price Snapshot

When an order is created, store:

* Item name.
* Variant name.
* Variant price.
* Add-on names.
* Add-on prices.
* Quantity.
* Line total.

Old orders must not change when menu prices change.

## 9.3 Invoice Lock

Invoice generation must be atomic with order locking.

Recommended logic:

```text
Start transaction
    ↓
Check order is not already locked
    ↓
Calculate final invoice
    ↓
Create invoice
    ↓
Set order.isLocked = true
    ↓
Commit transaction
```

If the database supports transactions for the involved collections, use a MongoDB session transaction.

---

# 10. Guest Session Design

## 10.1 Guest Flow

```text
Scan QR
    ↓
Resolve QR
    ↓
Check existing guest token
    ↓
If valid session exists
    ↓
Restore session
    ↓
Show active order
```

If no session exists:

```text
Create secure guest session
    ↓
Return guest session token
    ↓
Store token in customer browser
```

## 10.2 Security Requirements

* Do not use only table number as authorization.
* Use secure random tokens.
* Store token hashes when practical.
* Use expiration.
* Validate restaurant and table association.
* Rate-limit QR/session creation.
* Do not expose other customers' order details.
* Consider a table session PIN or join approval in a future version.

## 10.3 Guest Session Expiry

Initial proposed policy:

* Session expires after a configurable period of inactivity.
* Active orders remain accessible according to restaurant policy.
* Completed sessions are closed.
* Expired sessions require a new scan/session.

The exact expiry duration is an open product decision.

---

# 11. Payment Architecture

## 11.1 Payment Flow

```text
Customer selects online payment
        ↓
Backend creates payment intent/order
        ↓
Payment gateway checkout
        ↓
Customer completes payment
        ↓
Gateway callback/webhook
        ↓
Backend verifies payment
        ↓
Payment marked PAID
        ↓
Order payment status updated
```

## 11.2 Payment Rules

* Never trust client-provided payment success.
* Verify gateway signature/webhook.
* Use idempotency keys.
* Prevent duplicate payment.
* Store payment transaction records.
* Support failed payment retry.
* Handle refunds separately.
* Do not delete payment records.

---

# 12. Push Notification Architecture

Recommended initial implementation:

```text
Order Created
    ↓
Save order in MongoDB
    ↓
Publish internal order event
    ↓
Notification Service
    ↓
Push provider
    ↓
Admin Android app
```

The push provider can be Expo Notifications or another supported provider.

The system must persist the order before attempting notification.

Admin app should also refresh active orders after opening a notification.

Future real-time option:

* Socket.IO.
* WebSocket events.
* Background notification queue.

---

# 13. Security Requirements

## Authentication

* JWT or secure session authentication.
* Password hashing with bcrypt or Argon2.
* Refresh token strategy if required.
* Secure logout.
* Password reset.

## Authorization

* Admin role middleware.
* Restaurant-level data isolation.
* Order ownership checks.
* Guest session authorization.
* Permission checks for discounts and invoices.

## Input Validation

Use a validation library such as:

* Zod.
* Joi.
* express-validator.

Validate:

* Request body.
* Query parameters.
* Route parameters.
* Menu item IDs.
* Quantities.
* Coupon codes.
* Payment requests.

## API Security

* Helmet.
* CORS.
* Rate limiting.
* Request size limits.
* Sanitization.
* Secure secrets.
* HTTPS in production.
* Structured error handling.

## Payment Security

* Webhook signature verification.
* Idempotent payment updates.
* No client-authoritative totals.
* No sensitive gateway secrets in frontend.

---

# 14. Performance Requirements

Initial targets:

* Public menu API: target p95 response time under 500 ms under expected MVP load.
* Order creation: target p95 response time under 1 second excluding payment gateway latency.
* API error rate: monitor and alert on abnormal increases.
* Menu images: optimize and serve through object storage/CDN.
* Reports: paginate or aggregate large datasets.
* Active orders: use indexed queries.

These are engineering targets, not measured performance guarantees.

---

# 15. Deployment Architecture

## Development

```text
Developer Machine
├── Next.js Customer Web
├── Expo Admin App
├── Express Backend
└── MongoDB
```

## Production

```text
                    Internet
                       │
                       ▼
                    Nginx
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Next.js Web         Express API
             │                   │
             │                   ├── MongoDB
             │                   ├── Payment Gateway
             │                   ├── Push Provider
             │                   └── Object Storage
             │
             ▼
        Customer Browser

        Admin Android App
                │
                └── Express API
```

## Deployment Components

* Ubuntu VPS or cloud server.
* Nginx.
* Node.js.
* PM2 or container runtime.
* MongoDB Atlas or managed MongoDB.
* HTTPS/SSL.
* Domain and API subdomain.
* Environment variables.
* Logging and monitoring.
* Database backups.

---

# 16. Environment Variables

Example:

```env
NODE_ENV=development

PORT=5000

MONGO_URI=mongodb://localhost:27017/restaurant_ordering

JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

PAYMENT_KEY_ID=
PAYMENT_KEY_SECRET=
PAYMENT_WEBHOOK_SECRET=

EXPO_ACCESS_TOKEN=

STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

SENTRY_DSN=
```

Never commit real credentials to GitHub.

---

# 17. Testing Requirements

## Unit Tests

Test:

* Pricing calculation.
* Coupon validation.
* Discount calculation.
* Order status transitions.
* Invoice lock.
* Guest session validation.
* Delivery zone calculation.

## Integration Tests

Test:

* Create order.
* Modify order.
* Generate invoice.
* Payment verification.
* QR resolution.
* Admin manual order.
* Notification event creation.

## End-to-End Tests

Test:

1. Scan QR.
2. Open menu.
3. Add items.
4. Place order.
5. Admin receives order.
6. Admin accepts.
7. Order preparing.
8. Order served.
9. Payment.
10. Invoice generation.
11. Modification rejected after lock.

## Security Tests

* Unauthorized order access.
* Invalid guest token.
* Invalid QR token.
* Price manipulation.
* Duplicate payment.
* Coupon abuse.
* Admin privilege escalation.
* Rate limiting.

---

# 18. Monitoring and Logging

Recommended tools:

* Sentry for application errors.
* Structured logs using Pino or Winston.
* PM2 logs or container logs.
* MongoDB monitoring.
* Uptime monitoring.
* Payment webhook logging.
* Audit logs for admin actions.

Important events:

* Order created.
* Order accepted.
* Order modified.
* Order cancelled.
* Payment success/failure.
* Invoice generated.
* Order locked.
* Notification sent/failed.

---

# 19. Development Phases

## Phase 1 — Foundation

* Project setup.
* Database connection.
* Environment configuration.
* Auth.
* Restaurant settings.
* Common middleware.
* Error handling.
* Logging.

## Phase 2 — Menu and QR

* Categories.
* Menu items.
* Variants.
* Add-ons.
* Availability.
* Tables.
* QR generation.
* Guest session.

## Phase 3 — Ordering

* Customer menu.
* Cart.
* Pricing service.
* Order creation.
* Order status.
* Admin order screen.
* Push notifications.
* Order modification.

## Phase 4 — Payments and Invoice

* Payment gateway.
* Payment verification.
* Cash payment.
* Invoice generation.
* Order locking.
* Admin discount.
* Coupons.

## Phase 5 — Reports and Manual Orders

* Manual orders.
* Sales summary.
* Payment reports.
* Top-selling items.
* Date filters.
* Admin dashboard improvements.

## Phase 6 — Delivery

* Customer auth.
* Addresses.
* Delivery zone.
* Delivery fee.
* COD.
* Delivery statuses.

---

# 20. Technical Risks

| Risk                       | Mitigation                               |
| -------------------------- | ---------------------------------------- |
| Duplicate orders           | Idempotency keys and backend validation  |
| Price manipulation         | Calculate all prices server-side         |
| Guest session theft        | Secure random tokens, expiry, validation |
| QR screenshot misuse       | Token rotation and optional table PIN    |
| Payment mismatch           | Verify gateway webhook                   |
| Invoice race condition     | Database transaction/atomic locking      |
| Push notification failure  | Persist orders and refetch active orders |
| Menu price changes         | Store order price snapshots              |
| Large reports              | Indexes and aggregation pipelines        |
| Unauthorized admin changes | RBAC and audit logs                      |
| Image storage cost         | Object storage and image optimization    |

---

# 21. Recommended Technical Decisions

### Frontend

Use Next.js for the customer web app.

Use React Native + Expo for the admin Android app.

### State Management

Use Redux Toolkit + RTK Query.

Keep server state in RTK Query and avoid duplicating API data unnecessarily in local slices.

### Backend

Use Express with controllers and services.

Keep pricing, order, payment, and invoice logic inside services.

### Database

Use MongoDB with Mongoose.

Store snapshots for historical pricing and invoices.

### Architecture

Start as a monolith.

Design services with clear responsibilities so future extraction is possible.

### Payments

Use a payment provider with verified server-side callbacks.

### Notifications

Use push notifications plus persisted order retrieval.

---

# 22. Open Technical Decisions

1. JavaScript or TypeScript?
2. Next.js App Router or Pages Router?
3. MongoDB Atlas or self-hosted MongoDB?
4. Razorpay or another payment gateway?
5. Expo push notifications or Firebase Cloud Messaging directly?
6. Cloudinary, S3, or another image storage provider?
7. PDF generation using Puppeteer or another library?
8. JWT access token and refresh token strategy?
9. Single restaurant now or multi-tenant database design?
10. Socket.IO now or later?
11. Exact tax calculation rules?
12. Exact guest session expiry?
13. Invoice numbering strategy?
14. Whether invoices can be voided or corrected through a separate workflow?

---

## 23. Final Technical Recommendation

For the initial version:

```text
Customer:
Next.js + Tailwind + Redux Toolkit

Admin:
React Native + Expo + Redux Toolkit

Backend:
Node.js + Express + Mongoose

Database:
MongoDB

Architecture:
Monolithic Service-Based

Notifications:
Expo Notifications / Push Provider

Payments:
Payment Gateway

Storage:
Object Storage

Deployment:
Nginx + PM2 + HTTPS

Monitoring:
Sentry + Structured Logs
```

**End of TRD**
