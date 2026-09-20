# API Documentation

## Smart Restaurant QR Ordering & Management System

**Version:** 1.0
**Backend:** Node.js + Express.js
**Database:** MongoDB
**API Style:** REST
**Authentication:** JWT / Guest Session Token
**Status:** Draft API Contract

---

## 1. API Overview

### 1.1 Base URL

Development:

```text
http://localhost:5000/api/v1
```

Production:

```text
https://api.yourdomain.com/api/v1
```

Replace the production hostname with the actual deployed backend domain.

### 1.2 Content Type

```http
Content-Type: application/json
```

For image uploads:

```http
Content-Type: multipart/form-data
```

### 1.3 Authentication Headers

Admin or customer:

```http
Authorization: Bearer <access_token>
```

Guest session:

```http
X-Guest-Session-Token: <guest_session_token>
```

A guest token is only valid for its permitted restaurant/order session.

### 1.4 Standard Response

Success:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": null
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "items",
      "message": "At least one item is required"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### 1.5 HTTP Status Codes

| Status | Meaning           |
| ------ | ----------------- |
| 200    | Success           |
| 201    | Created           |
| 400    | Bad request       |
| 401    | Unauthorized      |
| 403    | Forbidden         |
| 404    | Not found         |
| 409    | Conflict          |
| 422    | Validation error  |
| 429    | Too many requests |
| 500    | Server error      |

---

# 2. Authentication APIs

## POST /auth/login

Login admin or registered customer.

Request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "Admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

## POST /auth/register

Register a customer.

Request:

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "customer_id",
      "name": "Rahul Kumar",
      "email": "rahul@example.com"
    },
    "accessToken": "jwt_token"
  }
}
```

## POST /auth/logout

Requires authentication.

Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## GET /auth/me

Returns current authenticated user.

---

# 3. Restaurant APIs

## GET /restaurants/:restaurantId

Get public restaurant details.

Response:

```json
{
  "success": true,
  "data": {
    "id": "restaurant_id",
    "name": "Food Corner",
    "logo": "image_url",
    "address": "Patna, Bihar",
    "isOpen": true
  }
}
```

## GET /restaurants/:restaurantId/settings

Get public ordering settings.

Response:

```json
{
  "success": true,
  "data": {
    "dineInEnabled": true,
    "takeawayEnabled": true,
    "deliveryEnabled": false,
    "onlinePaymentEnabled": true,
    "cashPaymentEnabled": true,
    "couponEnabled": true
  }
}
```

## PATCH /admin/restaurant/settings

Admin only.

Request:

```json
{
  "dineInEnabled": true,
  "takeawayEnabled": true,
  "deliveryEnabled": false,
  "onlinePaymentEnabled": true,
  "cashPaymentEnabled": true,
  "couponEnabled": true,
  "deliveryFee": 40,
  "minimumDeliveryAmount": 199
}
```

---

# 4. Category APIs

## GET /restaurants/:restaurantId/categories

Get active categories.

## POST /admin/categories

Admin only.

Request:

```json
{
  "name": "Chinese",
  "description": "Chinese food",
  "sortOrder": 1
}
```

## PATCH /admin/categories/:categoryId

Update category.

## DELETE /admin/categories/:categoryId

Delete category where permitted.

---

# 5. Menu APIs

## GET /restaurants/:restaurantId/menu

Get public menu.

Query parameters:

```text
?page=1&limit=20&categoryId=category_id&search=pizza
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "item_id",
      "name": "Chicken Chilli",
      "description": "Spicy chilli chicken",
      "image": "image_url",
      "categoryId": "category_id",
      "isVeg": false,
      "isAvailable": true,
      "variants": [
        {
          "id": "variant_id",
          "name": "Half",
          "description": "4-5 pieces",
          "price": 180
        },
        {
          "id": "variant_id_2",
          "name": "Full",
          "description": "8-10 pieces",
          "price": 320
        }
      ],
      "addonGroups": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## GET /menu/items/:itemId

Get one menu item.

## POST /admin/menu/items

Admin only.

Request:

```json
{
  "categoryId": "category_id",
  "name": "Veg Pizza",
  "description": "Fresh vegetable pizza",
  "isVeg": true,
  "variants": [
    {
      "name": "Regular",
      "description": "6 inch",
      "price": 149
    },
    {
      "name": "Medium",
      "description": "8 inch",
      "price": 249
    },
    {
      "name": "Large",
      "description": "10 inch",
      "price": 349
    }
  ],
  "addonGroupIds": [
    "crust_group_id",
    "toppings_group_id"
  ],
  "preparationTime": 20
}
```

## PATCH /admin/menu/items/:itemId

Update menu item.

## DELETE /admin/menu/items/:itemId

Delete menu item where permitted.

## PATCH /admin/menu/items/:itemId/availability

Enable/disable or mark out of stock.

Request:

```json
{
  "isAvailable": false
}
```

---

# 6. Add-on APIs

## POST /admin/addon-groups

Request:

```json
{
  "name": "Crust",
  "selectionType": "SINGLE",
  "required": false,
  "options": [
    {
      "name": "Normal",
      "price": 0
    },
    {
      "name": "Cheese Burst",
      "price": 60
    }
  ]
}
```

Selection types:

* SINGLE.
* MULTIPLE.

## GET /restaurants/:restaurantId/addon-groups

Get available add-ons.

## PATCH /admin/addon-groups/:addonGroupId

Update add-on group.

## DELETE /admin/addon-groups/:addonGroupId

Delete add-on group.

---

# 7. Table and QR APIs

## POST /admin/tables

Create table.

Request:

```json
{
  "tableNumber": "5",
  "capacity": 4
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "table_id",
    "tableNumber": "5",
    "type": "DINE_IN",
    "status": "ACTIVE"
  }
}
```

## GET /admin/tables

List restaurant tables.

## PATCH /admin/tables/:tableId

Update table.

## DELETE /admin/tables/:tableId

Delete or deactivate table.

## POST /admin/tables/:tableId/qr

Generate QR.

Response:

```json
{
  "success": true,
  "data": {
    "qrToken": "secure_random_token",
    "qrUrl": "https://yourdomain.com/order/qr/secure_random_token",
    "type": "DINE_IN"
  }
}
```

## POST /admin/qr/takeaway

Generate or retrieve takeaway QR.

Response:

```json
{
  "success": true,
  "data": {
    "qrToken": "secure_takeaway_token",
    "qrUrl": "https://yourdomain.com/order/qr/secure_takeaway_token",
    "type": "TAKEAWAY"
  }
}
```

## GET /public/qr/:qrToken

Resolve QR code.

Response:

```json
{
  "success": true,
  "data": {
    "restaurantId": "restaurant_id",
    "restaurantName": "Food Corner",
    "orderMode": "DINE_IN",
    "tableId": "table_id",
    "tableNumber": "5",
    "isActive": true
  }
}
```

---

# 8. Guest Session APIs

## POST /guest/sessions

Create or restore a guest session.

Request:

```json
{
  "qrToken": "secure_qr_token"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "guestSessionToken": "guest_session_token",
    "guestSessionId": "session_id",
    "restaurantId": "restaurant_id",
    "orderMode": "DINE_IN",
    "tableId": "table_id",
    "activeOrderId": null
  }
}
```

## GET /guest/sessions/current

Headers:

```http
X-Guest-Session-Token: <guest_session_token>
```

Returns current guest session and active order.

## POST /guest/sessions/join

Optional future API to join an existing table session.

---

# 9. Order APIs

## POST /orders

Create an order.

Authentication:

* Guest session for dine-in/takeaway.
* Customer JWT for delivery.
* Admin JWT for manual order.

Request:

```json
{
  "orderMode": "DINE_IN",
  "tableId": "table_id",
  "items": [
    {
      "menuItemId": "pizza_id",
      "variantId": "medium_variant_id",
      "quantity": 2,
      "addonIds": [
        "cheese_burst_id"
      ],
      "specialInstructions": "Less spicy"
    }
  ],
  "couponCode": "WELCOME20",
  "paymentType": "PAY_LATER",
  "paymentMethod": "CASH"
}
```

Backend must:

1. Validate restaurant.
2. Validate order mode.
3. Validate table/QR session.
4. Validate menu item.
5. Validate variant.
6. Validate add-ons.
7. Validate availability.
8. Calculate prices.
9. Apply coupon if eligible.
10. Calculate taxes and charges.
11. Create order.
12. Create payment record.
13. Notify admin.

Response:

```json
{
  "success": true,
  "data": {
    "orderId": "order_id",
    "orderNumber": "ORD-1021",
    "status": "PENDING",
    "isLocked": false,
    "paymentStatus": "PENDING",
    "totalAmount": 618
  }
}
```

## GET /orders/:orderId

Get order details.

Authorization must verify that the requester can access the order.

## GET /orders/my

Get authenticated customer's order history.

Query:

```text
?page=1&limit=20&status=COMPLETED
```

## GET /admin/orders

Admin list orders.

Query:

```text
?page=1&limit=20&status=PENDING&orderMode=DINE_IN&dateFrom=2026-09-18&dateTo=2026-09-18
```

## GET /admin/orders/:orderId

Admin order details.

## PATCH /admin/orders/:orderId/status

Update order status.

Request:

```json
{
  "status": "ACCEPTED"
}
```

Backend validates status transition.

## POST /admin/orders/:orderId/reject

Reject order.

Request:

```json
{
  "reason": "Item unavailable"
}
```

## POST /admin/orders/:orderId/cancel

Cancel order.

Request:

```json
{
  "reason": "Customer request"
}
```

---

# 10. Order Modification APIs

## POST /orders/:orderId/items

Add item to an unlocked order.

Request:

```json
{
  "menuItemId": "item_id",
  "variantId": "variant_id",
  "quantity": 1,
  "addonIds": []
}
```

## PATCH /orders/:orderId/items/:orderItemId

Update item quantity or options.

Request:

```json
{
  "quantity": 2
}
```

## DELETE /orders/:orderId/items/:orderItemId

Remove item from order.

## POST /admin/orders/:orderId/modify

Admin modification endpoint.

Request:

```json
{
  "action": "REMOVE_ITEM",
  "orderItemId": "order_item_id",
  "reason": "Out of stock"
}
```

## GET /orders/:orderId/modifications

Get modification history.

Response:

```json
{
  "success": true,
  "data": [
    {
      "action": "ITEM_ADDED",
      "performedBy": "CUSTOMER",
      "itemName": "French Fries",
      "quantity": 1,
      "createdAt": "2026-09-18T10:00:00Z"
    }
  ]
}
```

If the order is locked:

```json
{
  "success": false,
  "message": "Order can no longer be modified",
  "code": "ORDER_LOCKED"
}
```

---

# 11. Payment APIs

## POST /payments/create-order

Create payment gateway order.

Request:

```json
{
  "orderId": "order_id"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "gatewayOrderId": "gateway_order_id",
    "amount": 618,
    "currency": "INR"
  }
}
```

## POST /payments/verify

Verify payment after gateway checkout.

Request:

```json
{
  "orderId": "order_id",
  "gatewayPaymentId": "payment_id",
  "gatewayOrderId": "gateway_order_id",
  "signature": "signature"
}
```

The backend must verify the signature using the payment gateway SDK or API.

## POST /payments/webhook

Payment provider webhook.

Requirements:

* Verify webhook signature.
* Handle duplicate events.
* Update payment status.
* Update order payment status.
* Do not trust arbitrary client success responses.

## POST /admin/orders/:orderId/payment/cash

Record cash payment.

Request:

```json
{
  "amount": 618,
  "method": "CASH"
}
```

## GET /orders/:orderId/payments

Get payment history.

---

# 12. Invoice APIs

## POST /admin/orders/:orderId/invoice

Generate invoice.

Response:

```json
{
  "success": true,
  "data": {
    "invoiceId": "invoice_id",
    "invoiceNumber": "INV-2026-001021",
    "orderId": "order_id",
    "totalAmount": 618,
    "status": "GENERATED",
    "orderLocked": true
  }
}
```

Rules:

* Verify order exists.
* Verify admin permission.
* Verify order is invoiceable.
* Calculate final invoice.
* Persist invoice.
* Set `order.isLocked = true`.
* Prevent duplicate invoice generation.

## GET /invoices/:invoiceId

Get invoice details.

## GET /invoices/:invoiceId/pdf

Generate or return invoice PDF.

## GET /orders/:orderId/invoice

Get invoice for an order.

---

# 13. Discount APIs

## POST /admin/orders/:orderId/discount

Apply admin discount.

Request:

```json
{
  "type": "PERCENTAGE",
  "value": 10,
  "reason": "Regular customer"
}
```

## DELETE /admin/orders/:orderId/discount

Remove permitted discount.

Discount operations are rejected for locked orders.

---

# 14. Coupon APIs

## POST /admin/coupons

Create coupon.

Request:

```json
{
  "code": "WELCOME20",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "maxDiscount": 100,
  "minimumOrderAmount": 299,
  "usageLimit": 100,
  "usagePerCustomer": 1,
  "startDate": "2026-09-18T00:00:00Z",
  "endDate": "2026-10-18T23:59:59Z",
  "applicableOrderModes": [
    "DINE_IN",
    "TAKEAWAY",
    "DELIVERY"
  ],
  "enabled": true
}
```

## GET /restaurants/:restaurantId/coupons

Get public eligible coupons.

## POST /coupons/validate

Validate coupon at checkout.

Request:

```json
{
  "code": "WELCOME20",
  "orderMode": "DINE_IN",
  "items": [
    {
      "menuItemId": "item_id",
      "variantId": "variant_id",
      "quantity": 1
    }
  ]
}
```

## PATCH /admin/coupons/:couponId

Update coupon.

## DELETE /admin/coupons/:couponId

Delete or deactivate coupon.

---

# 15. Manual Order APIs

## POST /admin/orders/manual

Create manual order.

Request:

```json
{
  "orderMode": "TAKEAWAY",
  "orderSource": "ADMIN",
  "tableId": null,
  "customer": {
    "name": "Walk-in Customer",
    "phone": "9876543210"
  },
  "items": [
    {
      "menuItemId": "item_id",
      "variantId": "variant_id",
      "quantity": 2,
      "addonIds": []
    }
  ],
  "paymentType": "PAY_LATER",
  "paymentMethod": "CASH"
}
```

Response follows standard order creation response.

---

# 16. Reports APIs

## GET /admin/reports/summary

Query:

```text
?dateFrom=2026-09-18&dateTo=2026-09-18
```

Response:

```json
{
  "success": true,
  "data": {
    "totalOrders": 50,
    "completedOrders": 42,
    "cancelledOrders": 3,
    "grossSales": 50000,
    "discountAmount": 1500,
    "couponDiscount": 500,
    "taxCollected": 4000,
    "refundAmount": 0,
    "netSales": 48000,
    "cashCollection": 25000,
    "onlineCollection": 23000
  }
}
```

## GET /admin/reports/top-items

Query:

```text
?dateFrom=2026-09-01&dateTo=2026-09-18&limit=10
```

## GET /admin/reports/sales-by-mode

Returns sales grouped by:

* DINE_IN.
* TAKEAWAY.
* DELIVERY.

## GET /admin/reports/sales-by-day

Returns daily sales for selected date range.

## GET /admin/reports/payment-summary

Returns payment collections by method and status.

---

# 17. Delivery APIs — Future

## POST /customer/addresses

Create address.

## GET /customer/addresses

List customer addresses.

## PATCH /customer/addresses/:addressId

Update address.

## DELETE /customer/addresses/:addressId

Delete address.

## POST /delivery/check-availability

Request:

```json
{
  "latitude": 25.5941,
  "longitude": 85.1376
}
```

Response:

```json
{
  "success": true,
  "data": {
    "available": true,
    "deliveryFee": 40,
    "estimatedMinutes": 45
  }
}
```

## GET /admin/delivery/orders

List delivery orders.

## PATCH /admin/orders/:orderId/delivery

Assign delivery or update delivery status.

---

# 18. Notification APIs

## POST /devices/register

Register push notification token.

Request:

```json
{
  "token": "expo_push_token",
  "platform": "ANDROID",
  "deviceName": "Admin Phone"
}
```

## DELETE /devices/:deviceId

Remove device token.

## GET /notifications

List notifications.

## PATCH /notifications/:notificationId/read

Mark notification as read.

Push notifications should be triggered by backend business events, not directly by the client.

---

# 19. API Security Rules

1. Admin APIs require valid admin JWT.
2. Customer APIs require customer JWT where applicable.
3. Guest APIs require valid guest session.
4. Order access must be authorized.
5. Prices are calculated on the backend.
6. Invoice locking is enforced on the backend.
7. Payment webhooks require signature verification.
8. Rate limiting is applied to login, QR, and checkout endpoints.
9. Sensitive data is not returned to unauthorized users.
10. Audit logs are stored for important admin actions.

---

# 20. API Development Order

### Phase 1

* Auth.
* Restaurant.
* Category.
* Menu.
* Add-ons.
* Tables.
* QR.
* Guest session.

### Phase 2

* Order creation.
* Cart pricing.
* Order status.
* Order modification.
* Notifications.

### Phase 3

* Payment.
* Invoice.
* Discounts.
* Coupons.
* Manual orders.

### Phase 4

* Reports.
* Delivery.
* Customer accounts.

**End of API Documentation**
