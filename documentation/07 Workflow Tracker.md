# Noodle Junction — Workflow & Implementation Tracker

> **This is the living document.** Update it after every module/task. It answers: *what are we building, what is done, what is left.*
> Status: ⬜ Not started · 🟨 In progress · ✅ Done · ⏸ Blocked · 🔻 Deferred

**Last updated:** 2026-09-21 · **Current phase:** Phase 1 — Dine-in MVP · **Current module:** M0 (not started)

---

## 1. What we are building (one paragraph)
A multi-branch restaurant platform for **Noodle Junction**: QR-based dine-in ordering with table sessions and add-on orders, real-time branch dashboard + Android app with push alerts, manual POS invoicing, COD + Razorpay payments, takeaway and geofenced delivery, coupons, and table reservations. Admin manages the restaurant; each branch manages only its own orders.

## 2. Progress summary

| Phase | Modules | Progress |
|---|---|---|
| Documentation | PRD, TRD, DB, API, Events, Theme, Modules, Tracker … | ✅ Done (v1.0) |
| **Phase 1 – Dine-in MVP** | M0–M12 | 0 / 13 |
| **Phase 2 – Online orders** | M13–M15 | 0 / 3 |
| **Phase 3 – Mobile, bookings, reports** | M16–M18 | 0 / 3 |
| **Phase 4 – Launch** | M19 | 0 / 1 |

## 3. Module status board

| # | Module | Status | Backend | Dashboard UI | Customer UI | App | Tests | Docs synced | Notes |
|---|---|---|---|---|---|---|---|---|---|
| M0 | Project foundation | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M1 | Auth & RBAC | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M2 | Restaurant, Branches, Staff | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M3 | Master Menu | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M4 | Branch Menu | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M5 | Tables & QR | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M6 | Table Session | ⬜ | ⬜ | — | ⬜ | — | ⬜ | ⬜ | |
| M7 | Order Engine (API) | ⬜ | ⬜ | — | — | — | ⬜ | ⬜ | |
| M8 | Real-time Layer | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M9 | Branch Dashboard (ops) | ⬜ | — | ⬜ | — | — | ⬜ | ⬜ | |
| M10 | Customer Web Ordering (QR) | ⬜ | — | — | ⬜ | — | ⬜ | ⬜ | |
| M11 | Payments (COD + Razorpay) | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M12 | POS / Manual Invoicing | ⬜ | ⬜ | ⬜ | — | — | ⬜ | ⬜ | |
| M13 | Coupons | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M14 | Customer Accounts & Takeaway | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M15 | Delivery & Geofencing | ⬜ | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | |
| M16 | Android App + Push | ⬜ | ⬜ | — | — | ⬜ | ⬜ | ⬜ | |
| M17 | Reservations | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |
| M18 | Reports & Audit | ⬜ | ⬜ | ⬜ | — | ⬜ | ⬜ | ⬜ | |
| M19 | Hardening & Go-live | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | |

---

## 4. Detailed checklists

Tick items as they are **merged and working on staging**.

### M0 — Foundation
- [ ] Monorepo (pnpm + turbo), TS config, ESLint/Prettier, Husky
- [ ] `apps/api` skeleton: env validation, Mongo, Redis, logger, error handler, envelope
- [ ] `packages/shared`: enums, money utils, error codes, zod base
- [ ] `packages/design-tokens` + Tailwind preset
- [ ] `apps/dashboard` + `apps/customer-web` scaffolds
- [ ] Docker Compose (Mongo replica set, Redis)
- [ ] CI (lint, test, build)
- [ ] `/health` endpoint

### M1 — Auth & RBAC
- [ ] User model + seed Admin
- [ ] Login / refresh (rotation) / logout / me
- [ ] Change / forgot / reset password
- [ ] `authenticate`, `authorize`, `branchScope` middlewares
- [ ] Rate limit + lockout
- [ ] Dashboard login + guards + role redirects
- [ ] Isolation test helper

### M2 — Restaurant, Branches, Staff
- [ ] Restaurant profile API + UI
- [ ] Branch CRUD + location picker + timings + services + settings
- [ ] Staff CRUD (admin + manager scopes)
- [ ] Pause/activate branch
- [ ] Audit log entries

### M3 — Master Menu
- [ ] Category CRUD + reorder
- [ ] Item CRUD (variants, add-ons, tax, tags)
- [ ] Image upload
- [ ] Admin menu UI

### M4 — Branch Menu
- [ ] Import-from-master service (transaction + idempotent)
- [ ] Auto-import on branch creation
- [ ] Branch item edit / availability / hide / schedule
- [ ] Custom items + categories
- [ ] Branch menu UI

### M5 — Tables & QR
- [ ] Areas + tables CRUD (+ bulk)
- [ ] qrToken generate / rotate
- [ ] QR PNG/SVG + printable PDF sheet
- [ ] `GET /public/qr/:token`
- [ ] Tables UI

### M6 — Table Session
- [ ] TableSession model + partial unique index
- [ ] Start/join + cookie + header fallback
- [ ] `guestAuth` middleware
- [ ] Session expiry/close job
- [ ] Optional staff-confirmation setting
- [ ] `/t/[token]` page + session-ended page

### M7 — Order Engine
- [ ] Order model + counters (orderNo, kotNo)
- [ ] Pricing engine (shared) + tests
- [ ] Create order / add-on round
- [ ] Item state machine + remove rules
- [ ] Table status sync
- [ ] Search, transfer, merge, cancel
- [ ] Idempotency + optimistic concurrency
- [ ] Audit log for sensitive actions
- [ ] Domain events emitted

### M8 — Real-time
- [ ] Socket server + namespaces + auth
- [ ] Room joins + Redis adapter
- [ ] Event emitter bridge
- [ ] Dashboard `useLiveOrders` + reconnect catch-up
- [ ] Sound alerts
- [ ] Guest socket updates

### M9 — Branch Dashboard
- [ ] Live orders board
- [ ] Kitchen (KDS) view
- [ ] Live tables / ongoing meals
- [ ] Order search + detail + edit drawer
- [ ] Confirmation flow

### M10 — Customer Web Ordering
- [ ] Menu UI (search, veg filter, item sheet)
- [ ] Cart + place order
- [ ] Running order + live status
- [ ] Add-on ordering
- [ ] Remove pending items (locked otherwise)
- [ ] Request bill
- [ ] Error/empty states

### M11 — Payments
- [ ] Payment model + record cash/UPI/card
- [ ] Razorpay create + verify
- [ ] Webhook (idempotent)
- [ ] Balance logic with add-ons
- [ ] Refunds
- [ ] Guest checkout UI + dashboard payment UI

### M12 — POS / Invoicing
- [ ] POS screen
- [ ] Append to table order
- [ ] Invoice numbering + generation
- [ ] PDF + thermal print
- [ ] Settle & close flow
- [ ] KOT print/reprint
- [ ] Manual discount with approval

### M13 — Coupons
- [ ] Coupon model + rules engine
- [ ] Admin/branch CRUD UI
- [ ] Apply on guest / customer / POS
- [ ] Redemption tracking

### M14 — Customer Accounts & Takeaway
- [ ] OTP provider + login
- [ ] Profile + addresses
- [ ] Takeaway checkout + history + tracking
- [ ] Branch accept/reject/ready/picked-up

### M15 — Delivery & Geofencing
- [ ] Maps provider integrated
- [ ] Delivery config UI (radius/polygon/fees)
- [ ] `assignBranch` + delivery check + quote
- [ ] Delivery workflow + rider details
- [ ] Auto-reassign / escalation

### M16 — Android App + Push
- [ ] RN project + auth
- [ ] Live orders + detail + actions
- [ ] Live tables + kitchen view
- [ ] FCM + channels + Notifee
- [ ] Device registration + deep links
- [ ] Background reliability (battery, foreground svc)
- [ ] Internal testing release

### M17 — Reservations
- [ ] Slot engine + availability
- [ ] Booking flow (OTP)
- [ ] Branch management + seat
- [ ] Live board RESERVED state

### M18 — Reports & Audit
- [ ] Branch reports
- [ ] Admin reports + comparison
- [ ] GST summary
- [ ] Audit log viewer

### M19 — Hardening & Go-live
- [ ] Load test
- [ ] Security review
- [ ] Backups + restore drill
- [ ] Monitoring + alerts
- [ ] UAT + training
- [ ] Production cutover

---

## 5. Currently implemented vs not implemented (quick view)

| Capability | Implemented? |
|---|---|
| Staff login | ❌ |
| Branch/staff management | ❌ |
| Master & branch menu | ❌ |
| Tables & QR | ❌ |
| Table session (scan → session) | ❌ |
| Place order / add-on / remove rule | ❌ |
| Real-time dashboard | ❌ |
| Live tables (ongoing meals) | ❌ |
| Kitchen board | ❌ |
| COD / Razorpay | ❌ |
| Manual invoicing (POS) | ❌ |
| Coupons | ❌ |
| Customer OTP accounts | ❌ |
| Takeaway | ❌ |
| Delivery + nearest branch | ❌ |
| Android app + push | ❌ |
| Reservations | ❌ |
| Reports | ❌ |

## 6. Decision log

| Date | Decision | Notes |
|---|---|---|
| 2026-09-21 | Table-scoped session + signed cookie; opaque QR token | See TRD §5.3 |
| 2026-09-21 | Master → branch menu is a **copy** with `masterItemId` link | See TRD §11 |
| 2026-09-21 | Money in integer paise | |
| 2026-09-21 | Razorpay webhook is source of truth | |
| 2026-09-21 | Admin is read-only on orders (reports only) | **Confirm** |
| | | |

## 7. Open questions / blockers

| # | Question | Owner | Status |
|---|---|---|---|
| Q1 | Delivery zone: radius vs polygon for M# Noodle Junction — QA & Testing Plan

Related: [Modules](06-MODULES.md) · [Business rules](08-BUSINESS-RULES-AND-FLOWS.md) · [Security](09-SECURITY-AND-RBAC.md)

## 1. Strategy

| Level | Tools | What |
|---|---|---|
| Unit | Vitest/Jest | Pricing engine, coupon rules, state machines, geofence math, invoice numbering |
| Integration (API) | Supertest + MongoDB Memory Server (replica set) + Redis mock/container | Endpoints, transactions, RBAC, isolation |
| Contract | zod/OpenAPI | Request/response shapes shared with web/app |
| Real-time | socket.io-client in tests | Room membership, events, catch-up |
| E2E web | Playwright | QR flow, POS flow, dashboard live updates (two browser contexts) |
| Mobile | Detox / manual checklist | Login, push in background/killed |
| Payments | Razorpay **test mode** + webhook replay | Success, failure, duplicate webhook |
| Load | k6 / Artillery | Order create, socket fan-out |
| Security | OWASP ZAP, manual | Auth, injection, session, webhook |
| UAT | Real branch staff | Scripted scenarios |

Coverage target: ≥ 80 % on services; **100 % of business-rule branches** listed below.

## 2. Critical test cases (must automate)

### 2.1 Isolation
- [ ] Branch A user cannot GET/PATCH/DELETE any Branch B order/menu/table/staff/payment (404).
- [ ] Branch A socket never receives Branch B events.
- [ ] Guest of session S1 cannot read order of S2.
- [ ] Customer cannot read another customer's orders.
- [ ] Admin cannot call branch-operation endpoints (403) but can call reports.
- [ ] `branchId` in request body/query is ignored for branch users.

### 2.2 Auth
- [ ] Login success/failure/lockout; refresh rotation; reuse of old refresh token revokes family.
- [ ] Expired access token → refresh flow works silently in dashboard.
- [ ] Deactivated user immediately loses access (force logout).
- [ ] OTP expiry, max attempts, resend cooldown.

### 2.3 QR & table session
- [ ] Valid token resolves table; rotated token returns 404.
- [ ] Two devices join the same session; one open session per table (unique index race test).
- [ ] After close, old cookie → `SESSION_ENDED`; new scan creates new session.
- [ ] Branch closed/paused blocks session start.

### 2.4 Orders
- [ ] First order creates order + round 1 + KOT; add-on creates round 2 on the same order.
- [ ] Pricing: variants, add-ons, tax inclusive/exclusive, discount, round-off — table-driven tests with paise integers.
- [ ] Remove PENDING item ✔; remove PREPARING/READY/SERVED as guest → `ITEM_LOCKED`.
- [ ] Manager cancel of PREPARING requires reason, writes audit log.
- [ ] Concurrent add-ons from two phones both persist (version retry).
- [ ] Idempotency key returns the same order on retry.
- [ ] Unavailable item rejected; price snapshot unchanged after menu edit.
- [ ] Transfer table, merge orders update tables/session correctly.
- [ ] Closed order is immutable.

### 2.5 Payments
- [ ] Amount computed server-side; tampered client amount ignored.
- [ ] Valid/invalid signature; webhook signature valid/invalid; duplicate webhook is a no-op.
- [ ] Payment then add-on → correct balance; second payment closes.
- [ ] Failed payment leaves order unpaid; retry works.
- [ ] Refund (full/partial) updates payment + order.
- [ ] Webhook before verify; verify before webhook.

### 2.6 Invoice
- [ ] Sequential, gap-free numbering under concurrent generation (parallel test).
- [ ] FY rollover (31 Mar → 1 Apr).
- [ ] Tax split CGST/SGST sums equal tax total; totals equal payments.
- [ ] Invoice immutable; credit note flow.

### 2.7 Coupons
- [ ] Each rule: min order, cap, validity, days/hours, usage limit total/per user, order type, branch scope, first-order.
- [ ] Re-evaluated after item removal; removed if invalid.
- [ ] Concurrent redemption at usage limit − 1 (only one succeeds).

### 2.8 Delivery / geofencing
- [ ] Point inside/outside radius and polygon; boundary points.
- [ ] Nearest branch chosen; closed/paused/disabled skipped.
- [ ] No eligible branch → `NOT_DELIVERABLE`.
- [ ] Reject/timeout → single reassign; order disappears from first branch.
- [ ] Fee slabs and min-order enforcement.

### 2.9 Real-time & push
- [ ] Order appears on 2 dashboards < 1 s after creation.
- [ ] Reconnect after offline → missed orders fetched.
- [ ] Sound plays once per event (no duplicates).
- [ ] App killed → push received, tap opens the order.
- [ ] Escalation triggers if unacknowledged; stops when acknowledged.

### 2.10 Reservations
- [ ] Availability respects capacity/overlaps; double-booking prevented (concurrent).
- [ ] Seat → creates session and marks table occupied.

## 3. Manual UAT scripts (per branch before go-live)
1. Scan QR at T-1 → order 2 items → kitchen sees ticket with sound.
2. Kitchen marks preparing → guest sees status; guest tries to remove → blocked.
3. Guest adds roti → new KOT round; waiter adds another roti from Live Tables.
4. Guest requests bill; cashier bills; pays via UPI (Razorpay) and cash split.
5. Close table → T-1 vacant; old phone shows "session ended".
6. Cashier creates walk-in POS order; prints invoice on thermal printer.
7. Search order by order ID and table number; modify before payment.
8. Toggle item out of stock → disappears/greys on guest phone live.
9. Place delivery order from a test address → correct branch gets it; other branch does not.
10. Turn off Wi-Fi on dashboard for 1 min → banner → reconnect → no missed orders.
11. Android app closed → new order → notification + sound.
12. Coupon apply/remove; invalid coupon message.

## 4. Non-functional tests
| Test | Target |
|---|---|
| Menu page LCP on 4G | < 2.5 s |
| Order create p95 | < 400 ms |
| Order → dashboard latency p95 | < 1 s |
| Sockets | 500 concurrent guests + 100 staff per instance |
| Payment webhook burst | 50/s without loss |
| Browser support | Chrome, Safari iOS 15+, Samsung Internet, Firefox (latest 2) |
| Devices | Android 9+ (app), 360×640 minimum web |

## 5. Bug triage
| Severity | Definition | Fix SLA |
|---|---|---|
| S1 | Orders/payments lost, data leak, site down | Immediately |
| S2 | Major flow broken with workaround | 1 day |
| S3 | Minor functional/UI | Next release |
| S4 | Cosmetic | Backlog |

## 6. Test data
Seeds: 2 branches, 3 tables each with known `qrToken`s, users per role, master menu, coupons (valid/expired/limit-1), Razorpay test keys, test delivery coordinates inside/outside zones.# Noodle Junction — QA & Testing Plan

Related: [Modules](06-MODULES.md) · [Business rules](08-BUSINESS-RULES-AND-FLOWS.md) · [Security](09-SECURITY-AND-RBAC.md)

## 1. Strategy

| Level | Tools | What |
|---|---|---|
| Unit | Vitest/Jest | Pricing engine, coupon rules, state machines, geofence math, invoice numbering |
| Integration (API) | Supertest + MongoDB Memory Server (replica set) + Redis mock/container | Endpoints, transactions, RBAC, isolation |
| Contract | zod/OpenAPI | Request/response shapes shared with web/app |
| Real-time | socket.io-client in tests | Room membership, events, catch-up |
| E2E web | Playwright | QR flow, POS flow, dashboard live updates (two browser contexts) |
| Mobile | Detox / manual checklist | Login, push in background/killed |
| Payments | Razorpay **test mode** + webhook replay | Success, failure, duplicate webhook |
| Load | k6 / Artillery | Order create, socket fan-out |
| Security | OWASP ZAP, manual | Auth, injection, session, webhook |
| UAT | Real branch staff | Scripted scenarios |

Coverage target: ≥ 80 % on services; **100 % of business-rule branches** listed below.

## 2. Critical test cases (must automate)

### 2.1 Isolation
- [ ] Branch A user cannot GET/PATCH/DELETE any Branch B order/menu/table/staff/payment (404).
- [ ] Branch A socket never receives Branch B events.
- [ ] Guest of session S1 cannot read order of S2.
- [ ] Customer cannot read another customer's orders.
- [ ] Admin cannot call branch-operation endpoints (403) but can call reports.
- [ ] `branchId` in request body/query is ignored for branch users.

### 2.2 Auth
- [ ] Login success/failure/lockout; refresh rotation; reuse of old refresh token revokes family.
- [ ] Expired access token → refresh flow works silently in dashboard.
- [ ] Deactivated user immediately loses access (force logout).
- [ ] OTP expiry, max attempts, resend cooldown.

### 2.3 QR & table session
- [ ] Valid token resolves table; rotated token returns 404.
- [ ] Two devices join the same session; one open session per table (unique index race test).
- [ ] After close, old cookie → `SESSION_ENDED`; new scan creates new session.
- [ ] Branch closed/paused blocks session start.

### 2.4 Orders
- [ ] First order creates order + round 1 + KOT; add-on creates round 2 on the same order.
- [ ] Pricing: variants, add-ons, tax inclusive/exclusive, discount, round-off — table-driven tests with paise integers.
- [ ] Remove PENDING item ✔; remove PREPARING/READY/SERVED as guest → `ITEM_LOCKED`.
- [ ] Manager cancel of PREPARING requires reason, writes audit log.
- [ ] Concurrent add-ons from two phones both persist (version retry).
- [ ] Idempotency key returns the same order on retry.
- [ ] Unavailable item rejected; price snapshot unchanged after menu edit.
- [ ] Transfer table, merge orders update tables/session correctly.
- [ ] Closed order is immutable.

### 2.5 Payments
- [ ] Amount computed server-side; tampered client amount ignored.
- [ ] Valid/invalid signature; webhook signature valid/invalid; duplicate webhook is a no-op.
- [ ] Payment then add-on → correct balance; second payment closes.
- [ ] Failed payment leaves order unpaid; retry works.
- [ ] Refund (full/partial) updates payment + order.
- [ ] Webhook before verify; verify before webhook.

### 2.6 Invoice
- [ ] Sequential, gap-free numbering under concurrent generation (parallel test).
- [ ] FY rollover (31 Mar → 1 Apr).
- [ ] Tax split CGST/SGST sums equal tax total; totals equal payments.
- [ ] Invoice immutable; credit note flow.

### 2.7 Coupons
- [ ] Each rule: min order, cap, validity, days/hours, usage limit total/per user, order type, branch scope, first-order.
- [ ] Re-evaluated after item removal; removed if invalid.
- [ ] Concurrent redemption at usage limit − 1 (only one succeeds).

### 2.8 Delivery / geofencing
- [ ] Point inside/outside radius and polygon; boundary points.
- [ ] Nearest branch chosen; closed/paused/disabled skipped.
- [ ] No eligible branch → `NOT_DELIVERABLE`.
- [ ] Reject/timeout → single reassign; order disappears from first branch.
- [ ] Fee slabs and min-order enforcement.

### 2.9 Real-time & push
- [ ] Order appears on 2 dashboards < 1 s after creation.
- [ ] Reconnect after offline → missed orders fetched.
- [ ] Sound plays once per event (no duplicates).
- [ ] App killed → push received, tap opens the order.
- [ ] Escalation triggers if unacknowledged; stops when acknowledged.

### 2.10 Reservations
- [ ] Availability respects capacity/overlaps; double-booking prevented (concurrent).
- [ ] Seat → creates session and marks table occupied.

## 3. Manual UAT scripts (per branch before go-live)
1. Scan QR at T-1 → order 2 items → kitchen sees ticket with sound.
2. Kitchen marks preparing → guest sees status; guest tries to remove → blocked.
3. Guest adds roti → new KOT round; waiter adds another roti from Live Tables.
4. Guest requests bill; cashier bills; pays via UPI (Razorpay) and cash split.
5. Close table → T-1 vacant; old phone shows "session ended".
6. Cashier creates walk-in POS order; prints invoice on thermal printer.
7. Search order by order ID and table number; modify before payment.
8. Toggle item out of stock → disappears/greys on guest phone live.
9. Place delivery order from a test address → correct branch gets it; other branch does not.
10. Turn off Wi-Fi on dashboard for 1 min → banner → reconnect → no missed orders.
11. Android app closed → new order → notification + sound.
12. Coupon apply/remove; invalid coupon message.

## 4. Non-functional tests
| Test | Target |
|---|---|
| Menu page LCP on 4G | < 2.5 s |
| Order create p95 | < 400 ms |
| Order → dashboard latency p95 | < 1 s |
| Sockets | 500 concurrent guests + 100 staff per instance |
| Payment webhook burst | 50/s without loss |
| Browser support | Chrome, Safari iOS 15+, Samsung Internet, Firefox (latest 2) |
| Devices | Android 9+ (app), 360×640 minimum web |

## 5. Bug triage
| Severity | Definition | Fix SLA |
|---|---|---|
| S1 | Orders/payments lost, data leak, site down | Immediately |
| S2 | Major flow broken with workaround | 1 day |
| S3 | Minor functional/UI | Next release |
| S4 | Cosmetic | Backlog |

## 6. Test data
Seeds: 2 branches, 3 tables each with known `qrToken`s, users per role, master menu, coupons (valid/expired/limit-1), Razorpay test keys, test delivery coordinates inside/outside zones.
| Q2 | Maps provider (Google / Mappls / Mapbox) | | Open |
| Q3 | SMS/OTP provider + DLT registration | | Open |
| Q4 | GST rates / service charge rules (CA) | | Open |
| Q5 | Thermal printer model & auto-print need | | Open |
| Q6 | Reservation deposit? | | Open |
| Q7 | Online-payment cancellation/refund policy | | Open |

## 8. Changelog

| Date | Module | Change | By |
|---|---|---|---|
| 2026-09-21 | Docs | v1.0 documentation set created | |
| | | | |

## 9. How to update this file
1. When you start a module set its status to 🟨 and update **Current module** at the top.
2. Tick the sub-checklist items as they are merged.
3. When all boxes for a module are ticked and staging demo passes → ✅, update the progress summary counts and the "implemented" table.
4. Add a changelog row and, if you changed an API/DB shape, update [04-API.md](04-API.md) / [03-DATABASE.md](03-DATABASE.md) in the same PR.