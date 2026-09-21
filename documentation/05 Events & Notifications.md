# Noodle Junction — Real-time Events & Notifications

Related: [TRD §7–8](02-TRD.md) · [API](04-API.md)

## 1. Socket.IO setup

| Namespace | Auth | Who |
|---|---|---|
| `/staff` | `auth: { token: <accessToken> }` in handshake | Dashboard + Android app |
| `/guest` | `auth: { token: <table-session token> }` or cookie | Dine-in guests |
| `/customer` | `auth: { token: <customer accessToken> }` | Online customers (order tracking) |

### Rooms (joined **server-side** from the verified token — clients cannot choose)
| Room | Members | Purpose |
|---|---|---|
| `branch:{branchId}` | All staff of the branch | Orders, tables, alerts |
| `branch:{branchId}:kitchen` | Kitchen role | KOT tickets |
| `session:{sessionId}` | Guests at that table | Session/order updates |
| `order:{orderId}` | Guest / customer / staff viewing order | Status changes |
| `customer:{customerId}` | Online customer | All of their orders |
| `branch:{branchId}:menu` | Guests of the branch | Availability changes |

### Envelope
```json
{ "eventId": "evt_01H…", "type": "order:new", "at": "2026-09-21T13:05:11.120Z", "branchId": "b_1", "data": { } }
```
Client rules: de-duplicate by `eventId`; store `lastSeenAt`; on `connect`/reconnect call `GET /branch/orders?updatedSince=` to catch up.

## 2. Event catalogue

### Server → Staff (`/staff`)
| Event | When | Payload (`data`) | Dashboard action |
|---|---|---|---|
| `order:new` | New order placed (QR / online / POS by another device) | `order` summary: `id, orderNo, type, tableNumber?, items[], total, awaitingConfirmation, createdAt` | Add to list, **play alert sound**, toast |
| `order:round_added` | Add-on round on an open order | `orderId, orderNo, tableNumber, roundNo, kotNo, items[]` | Highlight order, new KOT to kitchen, sound |
| `order:updated` | Any change (qty, discount, coupon, transfer) | `order` summary | Refresh row |
| `order:item_status` | Item/KOT status changed | `orderId, itemIds[], status, by` | Update badges |
| `order:item_removed` | Guest removed a PENDING item | `orderId, itemId, name, qty` | Kitchen removes from ticket |
| `order:cancelled` | Order cancelled | `orderId, reason` | Remove / mark |
| `order:fulfillment` | Takeaway/delivery status change | `orderId, status` | |
| `order:awaiting_confirmation` | First QR order needs staff OK | `orderId, tableNumber` | Show confirm button |
| `table:updated` | Table status changed | `tableId, status, sessionId?, orderId?` | Update tile |
| `table:bill_requested` | Guest requested bill | `tableId, tableNumber, orderId, total` | Flash tile, sound |
| `payment:updated` | Payment paid/failed/refunded | `orderId, paymentId, status, method, amountPaise, balancePaise` | Update order payment badge |
| `reservation:new` / `reservation:updated` | Booking activity | `reservation` | Bookings list |
| `menu:availability` | Item toggled | `branchItemId, isAvailable` | Sync |
| `alert:unaccepted_order` | Escalation (no action within timeout) | `orderId, ageSeconds` | Persistent alarm |
| `system:force_logout` | Account deactivated | — | Log out |

### Server → Guest (`/guest`) and Customer (`/customer`)
| Event | Payload | Guest UI |
|---|---|---|
| `order:updated` | full order summary | Refresh cart/order screen |
| `order:item_status` | `itemIds[], status` | Show Preparing / Ready / Served chips |
| `order:confirmed` | `orderId` | "Your order is confirmed" |
| `order:rejected` / `order:cancelled` | `reason` | Show reason |
| `payment:updated` | `status, balancePaise` | Payment result screen |
| `session:closed` | `reason` | "Thank you! Scan again to order" |
| `menu:availability` | `branchItemId, isAvailable` | Grey-out item |
| `order:fulfillment` (customer) | `status, etaMins?, rider?` | Tracking stepper |

### Client → Server
| Event | Purpose |
|---|---|
| `staff:ack_order` `{ orderId }` | Staff acknowledged alert (stops escalation & sound on other devices) |
| `ping` | Keep-alive (built-in) |

> Mutations go through REST, not sockets. Sockets are **read/notify only** (except ack), so every action is validated, audited and idempotent in one place.

## 3. Push notification catalogue (FCM → Android)

Audience = active devices in `devices` for the branch whose user role is allowed.

| Trigger | Recipients | Title / Body | Channel |
|---|---|---|---|
| New dine-in QR order | Manager, Cashier, Kitchen, Waiter | "New order · T-12" / "3 items · ₹546" | `new_orders` (HIGH, alarm-style sound) |
| Add-on round | Kitchen, Cashier | "Add-on · T-12" / "Butter Roti ×4" | `new_orders` |
| New delivery/takeaway order | Manager, Cashier, Kitchen | "New Delivery · NJ-…-0043" | `new_orders` |
| Order awaiting confirmation | Cashier, Manager | "Confirm order · T-7" | `new_orders` |
| Bill requested | Cashier, Waiter | "Bill requested · T-12" | `table_alerts` (HIGH) |
| Unaccepted order > timeout | Manager (+ all) | "⚠ Order waiting 60 s" | `urgent` (MAX-like, repeating) |
| Payment received online | Cashier | "₹546 paid · T-12" | `payments` (DEFAULT) |
| Reservation request / reminder | Manager, Cashier | | `general` |
| Item marked out of stock by another device | — (socket only) | | |

FCM payload (data + notification, `priority: high`, `ttl` ≈ 2 min for new orders):
```json
{
  "token": "<fcmToken>",
  "android": { "priority": "high", "ttl": "120s", "notification": { "channel_id": "new_orders", "sound": "order_bell" } },
  "notification": { "title": "New order · T-12", "body": "3 items · ₹546" },
  "data": { "type": "order:new", "orderId": "o_5501", "orderNo": "NJ-NOI01-260921-0042", "branchId": "b_1", "eventId": "evt_01H…" }
}
```
App behaviour:
- **Foreground**: socket delivers event → play sound in-app; ignore the FCM duplicate (match `eventId`/`orderId`).
- **Background / killed**: FCM notification shown by OS; tapping deep-links to `/orders/{orderId}`.
- **Escalation** stops when any staff acknowledges (`POST /branch/notifications/:id/ack` or `staff:ack_order`).

## 4. Customer-facing notifications (P2)
SMS/WhatsApp for delivery/takeaway: order confirmed, out for delivery, delivered, cancelled/refunded. Guest dine-in uses on-screen only.

## 5. Sound & UX rules
- Dashboard: modal "Enable sound alerts" at login (browser autoplay policy). Sound loops until the order is opened/acknowledged; mute toggle in header (persist per user).
- Distinct sounds: new order (bell), add-on (short double chime), bill request (soft ding), urgent (repeating alarm).
- Tab title shows unacknowledged count `(3) Noodle Junction`.
- Visual: new order row slides in with red/gold pulse until acknowledged.

## 6. Reliability checklist
- [ ] Server emits after DB commit (never before).
- [ ] Event payloads are small; clients refetch detail by ID if needed.
- [ ] Redis adapter enabled before running >1 API instance.
- [ ] Reconnect + `updatedSince` catch-up implemented in dashboard and app.
- [ ] FCM invalid tokens are pruned.
- [ ] Load test: 200 concurrent staff sockets + 500 guest sockets.