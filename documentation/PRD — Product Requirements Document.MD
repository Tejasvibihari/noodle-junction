# Product Requirements Document (PRD)

## Smart Restaurant QR Ordering & Management System

**Version:** 1.0
**Date:** September 18, 2026
**Status:** Draft — MVP Planning
**Product Type:** Restaurant ordering and management software

---

## 1. Product Overview

### 1.1 Product Name

Smart Restaurant QR Ordering & Management System

### 1.2 Product Summary

A restaurant ordering platform that allows customers to scan QR codes placed on dining tables or at takeaway counters, browse the restaurant menu, select food items, place orders, and pay online or by cash.

The system provides an admin mobile application for restaurant staff to receive and manage orders, modify orders, manage menu items, generate invoices, apply discounts, manage coupons, and view sales reports.

The platform will also support online ordering from home with customer accounts and delivery-area validation.

### 1.3 Problem Statement

Traditional restaurant ordering often requires:

* Manual order-taking by waiters.
* Customers waiting for staff.
* Manual calculation of bills.
* Difficulty tracking all orders.
* Errors in quantity or price.
* Limited visibility into sales.
* Separate handling of dine-in, takeaway, and delivery orders.

The product aims to centralize ordering, pricing, payments, invoicing, and reporting in one system.

### 1.4 Product Goals

1. Enable QR-based ordering without customer registration for dine-in and takeaway.
2. Reduce manual order-taking and order-entry errors.
3. Allow customers and admins to modify orders before invoice locking.
4. Provide real-time order visibility to restaurant admins.
5. Support cash and online payments.
6. Allow admins to manage menus, variants, add-ons, and availability.
7. Record manually created orders for complete sales tracking.
8. Provide sales, revenue, and best-selling food reports.
9. Support home delivery with customer accounts and delivery zones.
10. Build a scalable monolithic backend using service-based architecture.

---

## 2. Scope

### 2.1 MVP Scope

* Admin authentication.
* Restaurant setup and settings.
* Menu categories.
* Menu items.
* Variants and quantities.
* Variant-specific descriptions and prices.
* Food images.
* Add-ons and add-on groups.
* Dine-in QR codes.
* Takeaway QR codes.
* Guest customer sessions.
* Customer menu web application.
* Cart and order placement.
* Cash / pay-later payment.
* Online payment integration.
* Admin push notifications.
* Order status management.
* Customer and admin order modification.
* Order locking after invoice generation.
* Admin discounts.
* Coupon system.
* Manual admin order creation.
* Invoice generation.
* Basic sales reports.
* Enable/disable menu items.
* Restaurant ordering availability settings.

### 2.2 Post-MVP Scope

* Customer accounts and home delivery.
* Delivery geofencing.
* Delivery fees.
* Customer order history.
* Delivery staff management.
* Advanced analytics.
* Kitchen display system.
* Inventory management.
* Multiple restaurant branches.
* Loyalty programs.
* Customer reviews.
* Advanced accounting.

---

## 3. User Roles

### 3.1 Customer — Guest

A customer who orders through a QR code without creating an account.

Permissions:

* View menu.
* Select food items.
* Add variants and add-ons.
* Place orders.
* Pay online or by cash/pay later.
* View active order.
* Modify order while permitted.
* View invoice after generation.

### 3.2 Customer — Registered

A customer who orders from home.

Permissions:

* Register and login.
* Manage profile.
* Manage addresses.
* Browse menu.
* Place delivery orders.
* Apply coupons.
* Pay online or COD where enabled.
* View order history.
* Track order status.

### 3.3 Admin

Restaurant owner or authorized staff.

Permissions:

* Manage restaurant settings.
* Manage categories and menu.
* Manage tables and QR codes.
* Create manual orders.
* Accept and reject orders.
* Update order status.
* Modify customer orders.
* Apply discounts.
* Manage coupons.
* Generate invoices.
* View sales and reports.
* Manage payment records.
* Receive push notifications.

### 3.4 Super Admin — Future

For managing multiple restaurants, subscriptions, restaurant onboarding, and platform administration.

---

## 4. Ordering Modes

### 4.1 Dine-In

Customer scans a table QR code.

Expected behavior:

* Order mode is automatically DINE_IN.
* Table is identified from QR.
* Menu opens directly.
* Guest session is created or restored.
* Customer can order without login.
* Customer can modify the active order before it is locked.
* Order is served at the table.
* Payment is completed.
* Invoice is generated.
* Order becomes locked.

### 4.2 Takeaway

Customer scans the takeaway QR code.

Expected behavior:

* Order mode is automatically TAKEAWAY.
* No table is required.
* Customer browses the menu.
* Customer places an order.
* Admin accepts and prepares the order.
* Customer collects the order.
* Payment and invoice are completed.

### 4.3 Delivery

Customer opens the online ordering website from home.

Expected behavior:

* Customer must log in or register.
* Customer selects delivery address.
* Backend validates delivery availability.
* Customer browses menu.
* Customer applies coupon.
* Customer selects online payment or COD.
* Admin accepts and prepares order.
* Order is dispatched and delivered.
* Invoice is generated.

---

## 5. Functional Requirements

### FR-001: Admin Authentication

The system shall allow admins to:

* Register or be created by authorized staff.
* Login securely.
* Logout.
* Reset password.
* Manage profile.
* Use role-based permissions.

Acceptance criteria:

* Unauthorized users cannot access admin APIs.
* Passwords are securely hashed.
* Admin sessions/tokens expire according to policy.
* Disabled admins cannot access protected functionality.

### FR-002: Restaurant Settings

Admin shall be able to configure:

* Restaurant name.
* Logo.
* Address.
* Phone.
* Opening hours.
* Restaurant open/closed status.
* Dine-in enabled/disabled.
* Takeaway enabled/disabled.
* Delivery enabled/disabled.
* Online payment enabled/disabled.
* Cash payment enabled/disabled.
* Coupon enabled/disabled.
* Tax configuration.
* Service charge.
* Packaging charge.
* Delivery fee.
* Delivery zone.

Acceptance criteria:

* Disabled order modes cannot accept new orders.
* Existing orders remain accessible.
* Settings are validated on the backend.

### FR-003: Menu Management

Admin shall be able to:

* Create categories.
* Update categories.
* Delete categories where permitted.
* Create food items.
* Update food items.
* Upload food images.
* Add multiple variants.
* Add variant-specific prices.
* Add variant-specific descriptions.
* Add add-on groups.
* Add add-on options.
* Enable/disable food items.
* Mark items out of stock.
* Set preparation time.

Menu item fields:

* Name.
* Description.
* Category.
* Image.
* Veg/non-veg indicator.
* Variants.
* Add-ons.
* Availability.
* Active status.
* Preparation time.

### FR-004: QR Code Management

Admin shall be able to:

* Create a table by table number.
* Update table details.
* Generate dine-in QR.
* Generate takeaway QR.
* Download QR.
* Print QR.
* Deactivate QR.
* Regenerate QR token.

Acceptance criteria:

* Each active table has a unique QR reference.
* Takeaway QR does not require a table.
* Invalid QR codes cannot create orders.
* Deactivated QR codes cannot start new sessions.

### FR-005: Guest Ordering

The system shall allow customers to order without an account for dine-in and takeaway.

Requirements:

* Create a secure guest session.
* Store session token on customer device.
* Restore active order when QR is scanned again.
* Show existing active order.
* Allow modification until locked.
* Expire inactive sessions according to policy.
* Do not rely only on device ID.

### FR-006: Cart

Customer shall be able to:

* Add menu item.
* Select variant.
* Select add-ons.
* Change quantity.
* Remove item.
* Add special instructions.
* View subtotal.
* View discount.
* View coupon.
* View tax and charges.
* View final total.

The backend shall recalculate authoritative pricing.

### FR-007: Order Creation

Customer or admin shall be able to create an order.

Order sources:

* QR.
* ADMIN.
* ONLINE.

Order modes:

* DINE_IN.
* TAKEAWAY.
* DELIVERY.

The system shall:

* Validate restaurant status.
* Validate menu item availability.
* Validate variants and add-ons.
* Calculate pricing.
* Create order number.
* Store item price snapshots.
* Create payment record.
* Send notification to admin.
* Return order details.

### FR-008: Order Status

Supported statuses:

* PENDING.
* ACCEPTED.
* PREPARING.
* READY.
* SERVED.
* OUT_FOR_DELIVERY.
* PICKED_UP.
* COMPLETED.
* REJECTED.
* CANCELLED.

Valid status transitions shall be enforced by the backend.

### FR-009: Order Modification

Customer and admin may modify an order before it is locked.

Allowed changes:

* Add item.
* Remove item.
* Update quantity.
* Add/remove add-ons.
* Change item notes.
* Apply permitted discounts.

Every modification shall record:

* Order ID.
* Actor type.
* Actor ID where available.
* Action.
* Previous value.
* New value.
* Reason.
* Timestamp.

### FR-010: Order Locking

An order shall be locked when its invoice is generated.

When locked:

* Customer cannot modify the order.
* Admin cannot modify the order.
* Items cannot be added or removed.
* Pricing cannot be changed.
* Coupon cannot be changed.

Post-invoice corrections shall use a separate adjustment/refund process.

### FR-011: Payment

Supported payment methods:

* CASH.
* ONLINE.

Supported payment types:

* PAY_NOW.
* PAY_LATER.

Payment statuses:

* PENDING.
* PAID.
* FAILED.
* REFUNDED.
* PARTIALLY_REFUNDED.

Online payment must be verified by the backend or payment provider webhook.

### FR-012: Discounts

Admin may apply:

* Percentage discount.
* Fixed amount discount.

Discount must record:

* Type.
* Value.
* Calculated amount.
* Applied by.
* Reason.

Discount permissions shall be configurable by role.

### FR-013: Coupons

Admin shall be able to:

* Create coupon.
* Update coupon.
* Enable/disable coupon.
* Set discount type.
* Set discount value.
* Set maximum discount.
* Set minimum order amount.
* Set usage limit.
* Set customer usage limit.
* Set start/end dates.
* Restrict order modes.

The backend must validate coupon eligibility at checkout and order creation.

### FR-014: Manual Orders

Admin shall be able to create an order manually.

Required fields:

* Order mode.
* Table number where applicable.
* Items.
* Variants.
* Add-ons.
* Quantity.
* Discount.
* Coupon where applicable.
* Payment method.
* Customer details where required.

Manual orders shall be included in reports.

### FR-015: Invoice

Admin shall be able to generate an invoice.

Invoice must contain:

* Invoice number.
* Order number.
* Restaurant details.
* Customer details where available.
* Items.
* Variants.
* Add-ons.
* Quantity.
* Unit price.
* Discounts.
* Coupon.
* Tax.
* Charges.
* Grand total.
* Payment details.
* Generated timestamp.

Invoice generation locks the order.

### FR-016: Notifications

Admin shall receive push notifications for:

* New order.
* Payment success.
* Order modification.
* Customer cancellation.
* Order issue.

Customer shall receive notifications for:

* Order accepted.
* Order preparing.
* Order ready.
* Order served/dispatched.
* Order completed.
* Payment status changes.

### FR-017: Sales Reports

Admin shall be able to view:

* Total orders.
* Gross sales.
* Net sales.
* Discounts.
* Coupon discounts.
* Tax collected.
* Refunds.
* Payment collections.
* Dine-in sales.
* Takeaway sales.
* Delivery sales.
* Best-selling food items.
* Average order value.
* Date-range reports.

Cancelled orders shall not be counted as completed sales.

### FR-018: Delivery

The system shall support:

* Customer registration.
* Address management.
* Delivery zone validation.
* Delivery enable/disable.
* Delivery fee.
* Minimum order amount.
* COD.
* Delivery status.
* Customer delivery tracking.

Initial delivery implementation may use a radius-based delivery zone.

---

## 6. Non-Functional Requirements

### Performance

* Menu should load quickly on mobile networks.
* APIs should use pagination for large datasets.
* Order creation should prevent duplicate submissions.
* Reports should use optimized queries.
* Images should be optimized and stored separately from MongoDB documents.

### Security

* Secure authentication.
* Password hashing.
* Authorization middleware.
* Input validation.
* Rate limiting.
* Secure QR tokens.
* Payment verification.
* Audit logs.
* Protection against unauthorized order modification.

### Availability

* Orders should be persisted before notification is sent.
* Admin should be able to refresh active orders.
* Push notification failure must not lose orders.
* Database backups should be configured.

### Usability

* Customer menu must be mobile-first.
* Admin app must work on Android phones and tablets.
* Food images should be clear.
* Prices must be visible before checkout.
* Order status should be easy to understand.

---

## 7. MVP Acceptance Criteria

The MVP is ready when:

1. Admin can create restaurant settings.
2. Admin can create menu categories and food items.
3. Admin can add variants and add-ons.
4. Admin can create table QR codes.
5. Customer can scan QR and open menu.
6. Customer can order without account.
7. Customer can restore active order through the same device/session.
8. Admin receives new order notification.
9. Admin can accept and prepare order.
10. Customer can view order status.
11. Admin can create manual orders.
12. Customer/admin can modify unlocked orders.
13. Invoice generation locks the order.
14. Cash and online payment flows are supported.
15. Admin can apply discounts and coupons.
16. Admin can enable/disable menu items.
17. Admin can view basic sales reports.
18. Unauthorized order modifications are rejected by backend.

---

## 8. Future Enhancements

* Kitchen display system.
* Inventory and ingredient management.
* Delivery staff application.
* Multi-restaurant SaaS.
* Multiple branches.
* Loyalty points.
* Customer reviews.
* Table reservation.
* Advanced analytics.
* WhatsApp notifications.
* Printer integration.
* Offline POS mode.
* Accounting integrations.

---

## 9. Product Success Metrics

* Percentage of orders placed through QR.
* Average time from order placement to acceptance.
* Average order preparation time.
* Order modification rate.
* Payment failure rate.
* Order cancellation rate.
* Menu item sales.
* Daily sales.
* Average order value.
* Customer repeat ordering.
* Manual order entry accuracy.

---

## 10. Assumptions

* Initial release targets one restaurant.
* Admin application is Android-first.
* Customer ordering is through Next.js web.
* Backend is a monolithic Express application.
* MongoDB is the primary database.
* Online payment provider will be selected during technical planning.
* Delivery is a later phase.
* Invoice generation is the order locking point.
* Admin permissions may be expanded in future versions.

---

## 11. Open Decisions

1. Single restaurant or multi-restaurant SaaS?
2. Shared table order or separate orders per customer?
3. Which online payment gateway?
4. Should admin approve every order?
5. Is invoice generated manually or automatically?
6. What is the exact guest session expiry?
7. Should orders be editable during preparation?
8. Should coupons apply to dine-in, takeaway, and delivery?
9. Is tax calculated before or after discounts?
10. Will delivery be managed by restaurant staff or a separate delivery app?

**End of PRD**
