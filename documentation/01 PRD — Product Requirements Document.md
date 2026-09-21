# Noodle Junction — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Noodle Junction Order Management & Booking System |
| **Version** | 1.0 (draft) |
| **Status** | Ready for module-by-module build |
| **Related docs** | [TRD](02-TRD.md) · [Database](03-DATABASE.md) · [API](04-API.md) · [Business rules](08-BUSINESS-RULES-AND-FLOWS.md) · [Modules](06-MODULES.md) · [Tracker](07-WORKFLOW-TRACKER.md) |

---

## 1. Overview

Noodle Junction is a restaurant with multiple physical branches. This product lets the restaurant run **dine-in, takeaway and delivery** orders from a single system:

- Dine-in guests **scan a QR code on their table**, see the menu, order and pay from their phone — no app, no account.
- Branch staff receive orders **instantly** (no page refresh) on a web dashboard and an Android app, even when the app is closed.
- Staff can also **create orders manually** (POS-style) and generate invoices.
- Online (takeaway/delivery) orders are **routed automatically to the nearest branch** using geofencing.
- The restaurant owner (Admin) manages the restaurant-wide setup: branches, master menu, staff, coupons, reports. **Each branch manages its own orders** and cannot see other branches' orders.

## 2. Goals and non-goals

### Goals
1. Remove the waiter-takes-order bottleneck for dine-in via QR ordering.
2. One live view of every running table, so add-ons (e.g. extra roti) go on the *existing* table order.
3. Reliable real-time order delivery to the kitchen/counter (web + Android push).
4. Strict per-branch data isolation.
5. Clean, correct billing (GST-ready invoices, COD + Razorpay).
6. Build in small independent modules that can ship one at a time.

### Non-goals (v1)
- Inventory / stock / recipe costing (only an "out of stock" toggle).
- Native iOS app, native customer app (customers use the web only).
- Own delivery-rider app and live rider tracking (delivery is handled manually by branch in v1).
- Loyalty points / wallet.
- Multi-restaurant SaaS (one restaurant, many branches; data model keeps `restaurantId` so this stays possible).
- Third-party aggregator integration (Zomato/Swiggy).

## 3. Users and personas

| Persona | Platform | Description |
|---|---|---|
| **Restaurant Admin (Owner)** | Web dashboard | Owns Noodle Junction. Creates branches, master menu, staff, coupons; views reports across branches. Does **not** operate orders. |
| **Branch Manager** | Web dashboard + Android app | Runs one branch: branch menu, tables, staff of that branch, discounts, cancellations, reports for the branch. |
| **Cashier / Counter** | Web dashboard (tablet/desktop) | Creates manual orders, edits table orders, generates bills, records payments. |
| **Kitchen** | Web dashboard (KDS view) / Android app | Sees tickets, marks items preparing / ready. |
| **Waiter** (P1) | Android app / web | Sees live tables, adds items, marks served. |
| **Dine-in Guest** | Customer web (via QR) | No account. Session tied to the table. |
| **Online Customer** | Customer web | Has an account (phone OTP) for takeaway/delivery. |
| **Delivery partner** (P2) | — | Out of scope v1; branch assigns manually. |

## 4. Order types

| Type | Who creates | Account needed | Where it goes |
|---|---|---|---|
| **Dine-in (QR)** | Guest scanning table QR | No | Branch that owns the table |
| **Dine-in (manual)** | Staff (POS) | No | Own branch |
| **Takeaway** | Customer web (or staff manually) | Yes (online) / No (manual) | Branch chosen by customer (nearest suggested) |
| **Delivery** | Customer web (or staff manually) | Yes | Nearest branch whose delivery zone contains the address |

## 5. Functional requirements

Priority: **P0** = MVP must-have · **P1** = needed for launch of full product · **P2** = later.

### 5.1 Authentication & access
| ID | Requirement | Pri |
|---|---|---|
| AUTH-1 | Staff log in with email/phone + password; JWT access + refresh tokens | P0 |
| AUTH-2 | Role-based access (Admin, Branch Manager, Cashier, Kitchen, Waiter) — see [Security & RBAC](09-SECURITY-AND-RBAC.md) | P0 |
| AUTH-3 | Branch users are locked to their branch; the branch is taken from the token, never from the request | P0 |
| AUTH-4 | Forgot / reset / change password | P1 |
| AUTH-5 | Online customers sign in via phone OTP (no password) | P1 |
| AUTH-6 | Dine-in guests need no account — table session only | P0 |

### 5.2 Restaurant & branches (Admin)
| ID | Requirement | Pri |
|---|---|---|
| BR-1 | Admin edits restaurant profile (name, logo, GSTIN, FSSAI, contact) | P0 |
| BR-2 | Admin creates/edits/deactivates branches (name, code, address, GPS location, phone, timings, GSTIN override) | P0 |
| BR-3 | Admin creates staff and assigns them to a branch and role | P0 |
| BR-4 | Branch settings: accepts dine-in / takeaway / delivery, auto-accept QR orders, delivery radius/zone, delivery fee slabs, min order value, packaging charge, tax mode, print settings | P0 |
| BR-5 | Branch can be paused ("not accepting orders") instantly | P1 |

### 5.3 Menu
| ID | Requirement | Pri |
|---|---|---|
| MENU-1 | **Master menu**: categories, items, variants (size), add-ons, veg/non-veg, images, tax rate, base price | P0 |
| MENU-2 | When a branch is created (or on demand), master menu is **copied** into the branch menu | P0 |
| MENU-3 | **Branch menu**: branch edits price, availability, sort order, hides items; can add its **own items/categories** | P0 |
| MENU-4 | Out-of-stock toggle takes effect on customer menus in real time | P0 |
| MENU-5 | Item schedules (breakfast/lunch), tags (bestseller, spicy), search & filter on customer menu | P1 |
| MENU-6 | "Pull new master items into my branch" (optional sync) | P2 |

### 5.4 Tables & QR
| ID | Requirement | Pri |
|---|---|---|
| TBL-1 | Branch creates areas/sections and tables (number, capacity) | P0 |
| TBL-2 | Each table has a unique **QR code** encoding a secure table token; QR sheet can be printed (PDF) | P0 |
| TBL-3 | QR can be regenerated (rotated) if compromised | P1 |
| TBL-4 | **Live tables board** — every table: Vacant / Occupied (ongoing meal) / Bill requested / Reserved | P0 |
| TBL-5 | Transfer order to another table, merge two tables' orders | P1 |

### 5.4a Table session (QR guest)
| ID | Requirement | Pri |
|---|---|---|
| SES-1 | First scan on a vacant table opens a **table session**; later scans (any phone) **join the same session** | P0 |
| SES-2 | Session stored as a secure cookie/token on the guest's phone, valid until the table is closed | P0 |
| SES-3 | While session is open, guest can view the running order, add items, and see live status | P0 |
| SES-4 | Session closes when the bill is settled/closed by staff; old links then show "Session ended – scan again" | P0 |
| SES-5 | Optional branch setting: staff must confirm the first order of a new session (anti-prank) | P1 |

### 5.5 Ordering (dine-in)
| ID | Requirement | Pri |
|---|---|---|
| ORD-1 | Guest browses menu, builds cart, places order; table number is attached automatically | P0 |
| ORD-2 | Order reaches branch dashboard/app in real time and prints/shows as a **KOT** | P0 |
| ORD-3 | **Add-on**: further orders from the same table are appended to the *same* order as a new KOT round | P0 |
| ORD-4 | Guest can **remove an item only while it is still PENDING** (kitchen hasn't started). Once PREPARING/READY/SERVED it is locked | P0 |
| ORD-5 | Staff can add/modify/cancel items on any open order (cancelling a prepared item needs manager approval + reason) | P0 |
| ORD-6 | Staff can **search an order by order ID / table / phone** and modify it (if not settled) | P0 |
| ORD-7 | "Ongoing meals" page: all open table orders with elapsed time, amount, item status | P0 |
| ORD-8 | Guest can request the bill from their phone | P1 |
| ORD-9 | Item-level notes (e.g. "less spicy") and order-level instructions | P1 |

### 5.6 Manual order / invoicing (POS)
| ID | Requirement | Pri |
|---|---|---|
| POS-1 | Cashier creates an order for dine-in / takeaway / delivery by picking items (search, categories, quick-add) | P0 |
| POS-2 | Optional table selection; if a table has an open session, the items are added to it | P0 |
| POS-3 | Apply discount/coupon, add customer name/phone, notes | P0 |
| POS-4 | Generate GST invoice (sequential invoice number per branch per financial year), print/PDF | P0 |
| POS-5 | Record payment: Cash, UPI, Card, Razorpay link, split payment | P0 |
| POS-6 | Reprint KOT and invoice | P1 |

### 5.7 Payments
| ID | Requirement | Pri |
|---|---|---|
| PAY-1 | **COD / Pay at counter** (cash, UPI, card recorded by staff) | P0 |
| PAY-2 | **Razorpay** online payment (UPI, cards, netbanking, wallets) with server-side verification + webhook | P0 |
| PAY-3 | Pay per round, or pay whole balance later — payments are recorded against the order balance | P0 |
| PAY-4 | Refunds (full/partial) for cancelled paid items | P1 |
| PAY-5 | Reconciliation report (payment mode × branch × day) | P1 |

### 5.8 Takeaway & delivery
| ID | Requirement | Pri |
|---|---|---|
| ONL-1 | Customer signs in with phone OTP to place takeaway/delivery orders | P1 |
| ONL-2 | Customer picks address on map/search; system finds the **nearest eligible branch** via geofence | P1 |
| ONL-3 | Delivery fee by distance slab, min order value, packaging charge | P1 |
| ONL-4 | Branch accepts/rejects; auto-reassign to the next nearest branch on reject/timeout (once) | P1 |
| ONL-5 | Status tracking page for the customer (Placed → Accepted → Preparing → Ready/Out for delivery → Delivered) | P1 |
| ONL-6 | Address book, order history, reorder | P1 |
| ONL-7 | Takeaway: pick branch, pickup ETA | P1 |

### 5.9 Coupons
| ID | Requirement | Pri |
|---|---|---|
| CPN-1 | Percent / flat coupons with min order, max discount, validity, usage limits (total, per user) | P1 |
| CPN-2 | Scope by order type and branch(es); first-order-only | P1 |
| CPN-3 | Admin creates global coupons; Branch Manager may create branch-only coupons (permission-controlled) | P1 |
| CPN-4 | Coupon usage report | P2 |

### 5.10 Notifications & real-time
| ID | Requirement | Pri |
|---|---|---|
| NOT-1 | New/updated orders appear **instantly** on the dashboard (WebSocket) with sound alert | P0 |
| NOT-2 | Android app receives **push even when closed** (FCM high priority) with loud alert | P1 |
| NOT-3 | Web push for dashboard when tab is in background | P2 |
| NOT-4 | Guest/customer sees live status changes without refresh | P0 |
| NOT-5 | SMS/WhatsApp for delivery customers (order confirmed, out for delivery) | P2 |

### 5.11 Table reservations (booking)
| ID | Requirement | Pri |
|---|---|---|
| RES-1 | Customer books a table: branch, date, time slot, party size, name, phone (OTP-verified) | P1 |
| RES-2 | Branch confirms/declines; reserved tables show on live board | P1 |
| RES-3 | Seat a reservation → opens a table session | P1 |
| RES-4 | Reminders, no-show marking, optional deposit via Razorpay | P2 |

### 5.12 Reports & audit
| ID | Requirement | Pri |
|---|---|---|
| REP-1 | Branch: daily sales, orders by type, payment modes, top items, cancelled items | P1 |
| REP-2 | Admin: same across branches with comparison, GST summary | P1 |
| REP-3 | CSV/PDF export | P2 |
| AUD-1 | Audit log for sensitive actions (price change, cancel, discount, refund, login) | P1 |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| **Performance** | Menu loads < 2 s on 4G; order appears on branch dashboard < 1 s after placing (p95) |
| **Availability** | 99.5 % target; branch counter must still be able to bill if customer QR flow is down (POS independent of guest flow) |
| **Isolation** | A branch user can never read or write another branch's orders (enforced server-side, covered by automated tests) |
| **Security** | HTTPS only, hashed passwords, signed sessions, webhook signature verification, rate limiting, audit trail |
| **Data integrity** | Money stored as integer paise; order/invoice numbers never duplicate; idempotent payment handling |
| **Usability** | Customer web mobile-first, usable one-handed, works on slow networks; dashboard usable on tablet |
| **Scalability** | Start with 1 API instance; design (Redis adapter, stateless API) to scale horizontally |
| **Compliance** | GST-compliant invoice fields; customer data handling per India's DPDP Act (consent, deletion on request) |
| **Localization** | English first; INR; IST timezone (store UTC); i18n-ready strings (Hindi later) |

## 7. Key user journeys (summary)

1. **QR dine-in** — Scan → menu → add items → place order (COD or pay online) → live status → add more items → request bill → pay → session closes.
2. **Walk-in via counter** — Cashier picks items → applies coupon → bill → payment → invoice printed.
3. **Add-on** — Guest at table asks waiter for roti → waiter/cashier finds the table in *Live Tables* → adds roti → new KOT goes to kitchen, running bill updates.
4. **Delivery** — Customer logs in with OTP → address → nearest branch found → fee shown → pay → branch accepts → status updates → delivered.
5. **New branch** — Admin creates branch → master menu copied → manager sets prices/tables/staff → prints QR sheet → goes live.

Detailed flows: [08-BUSINESS-RULES-AND-FLOWS.md](08-BUSINESS-RULES-AND-FLOWS.md).

## 8. Success metrics

- ≥ 60 % of dine-in orders placed via QR within 3 months of rollout at a branch.
- Order-to-kitchen latency p95 < 1 s.
- < 1 % orders with billing correction after settlement.
- Average table turnaround time reduced (baseline to be measured).
- Zero cross-branch data leak incidents.

## 9. Release phases

| Phase | Scope | Modules |
|---|---|---|
| **1 – Dine-in MVP** | Auth, branches, menus, tables/QR, table sessions, orders, real-time dashboard, live tables, customer web ordering, COD + Razorpay, manual POS + invoice | M0 – M12 |
| **2 – Online orders** | Coupons, customer accounts, takeaway, delivery + geofencing | M13 – M15 |
| **3 – Mobile & growth** | Android app + push, reservations, reports | M16 – M18 |
| **4 – Launch hardening** | Load/security testing, monitoring, go-live | M19 |

> You asked for the Android app early for reliable push. The Phase-1 web dashboard already gets real-time alerts with sound while the tab is open; if you need closed-app notifications from day one, pull M16 forward right after M8/M9 — nothing else depends on it.

## 10. Assumptions (please confirm)

1. Noodle Junction is **one restaurant brand** (single tenant). Admin = owner account(s).
2. Admin has **read-only reporting**, not order operations (as you described: "the Admin can only manage the restaurant").
3. Prices are **GST-exclusive or inclusive per restaurant setting**; tax rates are configurable per item (confirm rates and SAC with your CA).
4. Dine-in guests may pay **at any point** (per round, or the full balance at the end).
5. Delivery is fulfilled by the branch's own riders in v1 (status updated manually).
6. Razorpay uses **one merchant account** for the restaurant; branch-wise reconciliation is done in our reports.
7. Orders that are settled are **immutable**; corrections use cancellation/credit note.

## 11. Open questions

1. Delivery zone per branch: simple **radius** (e.g. 5 km) or drawn **polygon**? (Design supports both; MVP = radius.)
2. Which map/geocoding provider? (Google Maps vs Mappls vs Mapbox — cost vs accuracy in your cities.)
3. SMS/OTP provider (MSG91 / Twilio / Firebase) — needs DLT registration in India.
4. Should a guest see prices including tax, and is a service charge applied on dine-in?
5. Do branches need thermal-printer auto-print at launch, or is browser print enough?
6. Should table reservations require an advance payment?
7. Cancellation policy for online-paid orders (auto-refund window).

## 12. Risks

| Risk | Mitigation |
|---|---|
| Fake/prank orders from someone who photographed the QR | Optional staff-confirmation of first order, geolocation soft-check, rate limits, rotate QR |
| Android kills background app and misses push | FCM high-priority + notification channel + foreground service + battery-optimization onboarding + escalation alerts |
| Payment succeeded but customer closed the tab | Razorpay webhook is the source of truth, idempotent |
| Menu drift between branches | Master → branch copy keeps `masterItemId` link; optional sync later |
| Poor internet at branch | Dashboard reconnect + catch-up fetch; POS works with short retries; (offline mode is P2) |