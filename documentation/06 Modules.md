# Noodle Junction — Module Breakdown & Build Order

Build **one module at a time**. Each module is a vertical slice: API → dashboard/customer UI (→ app when noted) → tests → docs. After finishing a module, update [07-WORKFLOW-TRACKER.md](07-WORKFLOW-TRACKER.md).

**Definition of Done (every module)**
1. API endpoints implemented per [04-API.md](04-API.md) with zod validation.
2. Branch-isolation tests pass (for branch-scoped modules).
3. Unit + integration tests for business rules.
4. UI screens per [12-SCREENS-AND-SITEMAP.md](12-SCREENS-AND-SITEMAP.md) using the [theme](10-THEME-DESIGN-SYSTEM.md).
5. Postman collection / OpenAPI updated.
6. Tracker + API doc updated. Deployed to staging.

---

## Dependency map

```
M0 Foundation
 └─ M1 Auth & RBAC
     └─ M2 Restaurant, Branches, Staff
         ├─ M3 Master Menu ──► M4 Branch Menu ─┐
         └─ M5 Tables & QR ──► M6 Table Session ┤
                                                 ▼
                                   M7 Order Engine (API)
                                                 ▼
                                   M8 Realtime Layer
                                     ├─► M9 Branch Dashboard (live orders, kitchen, live tables, search/modify)
                                     ├─► M10 Customer Web Ordering (QR)
                                     └─► M11 Payments (COD + Razorpay)
                                                 ▼
                                   M12 POS / Manual Invoicing
                                                 ▼
                       ── Phase 1 (Dine-in MVP) complete ──
   M13 Coupons ─ M14 Customer Accounts & Takeaway ─ M15 Delivery & Geofencing
                       ── Phase 2 complete ──
   M16 Android App + Push ─ M17 Reservations ─ M18 Reports
                       ── Phase 3 complete ──
   M19 Hardening & Go-live
```

---

## Phase 1 — Dine-in MVP

### M0 — Project foundation
**Goal:** repo, tooling and skeleton so every later module drops in cleanly.
- pnpm + Turborepo monorepo (`apps/api`, `apps/dashboard`, `apps/customer-web`, `packages/shared`, `packages/design-tokens`)
- Express app: config/env validation (zod), Mongo + Redis connection, pino logger, request-id, global error handler, response envelope, CORS, helmet, rate-limit
- Shared package: enums (roles, statuses), money helpers, zod base schemas, error codes
- Next.js apps with Tailwind + theme tokens, API client (axios/fetch wrapper with refresh handling)
- ESLint, Prettier, Husky, commit lint, GitHub Actions (lint + test + build)
- Docker Compose for local Mongo (replica set) + Redis
- Seed script skeleton, `/health` endpoint

**Done when:** `pnpm dev` runs API + both web apps; CI green; `/health` OK.

### M1 — Authentication & RBAC
**Goal:** staff can log in; every request knows role + branch.
- Users model; seed the first `RESTAURANT_ADMIN`
- Login, refresh (rotation + reuse detection), logout, me, change/forgot/reset password
- Middlewares: `authenticate`, `authorize(roles/perms)`, `branchScope`
- Login lockout + rate limit; audit log for login
- Dashboard: login page, auth context, route guards, role-based redirects (`/admin` vs `/branch`)
- Isolation test harness (helper to create 2 branches + users) — reused by all later modules

**Done when:** Admin and Branch users can log in, refresh silently, and are blocked from the wrong area (API + UI).

### M2 — Restaurant, Branches & Staff
**Goal:** Admin sets up Noodle Junction and its branches.
- Restaurant profile (name, GSTIN, FSSAI, logo)
- Branch CRUD, GPS location (map pin picker), timings, services, branch settings (incl. delivery config stub)
- Staff CRUD (Admin → any branch; Manager → own branch, non-manager roles)
- Pause/resume branch; activate/deactivate
- Admin dashboard: branches list, branch detail, staff list

**Done when:** Admin creates a branch + manager; manager logs in and sees only that branch.

### M3 — Master Menu
**Goal:** create the menu once.
- Categories, items, variants, add-on groups, veg/non-veg, tax, images (upload), tags, sort order
- Admin UI: category sidebar + item grid, item form, drag-sort, bulk activate/deactivate
- Image upload with validation/compression

**Done when:** Admin can build a complete menu with variants/add-ons and images.

### M4 — Branch Menu
**Goal:** each branch gets its own editable copy.
- `importMasterMenu` service (transaction, idempotent, keeps `masterItemId`), auto-run on branch creation
- Branch UI: view menu, edit price/description/availability/hidden/sort, schedule, add **custom** items/categories
- Quick availability toggle (usable by kitchen/cashier)
- Menu cache + `menu:availability` event hook (wired in M8)

**Done when:** New branch shows a copy of master menu; editing a branch item does not change master or other branches.

### M5 — Tables & QR
**Goal:** branch creates tables and prints QR codes.
- Areas + tables CRUD, bulk create
- `qrToken` generation, rotate, QR PNG/SVG, **printable PDF sheet** (table number big, logo, "Scan to order")
- Public `GET /public/qr/:qrToken` resolve endpoint (with branch open/paused checks)
- Branch UI: tables grid, QR preview/download/print

**Done when:** Scanning a printed QR opens `order.noodlejunction.in/t/{token}` and resolves to the right branch and table.

### M6 — Table Session (guest identity)
**Goal:** scan → session, no account.
- `TableSession` model with partial unique index (one open per table)
- Start/join endpoint, signed cookie + header fallback, guest auth middleware (`guestAuth`)
- Session expiry job, close on demand
- Optional `requireStaffConfirmationFirstOrder`
- Customer-web: landing page `/t/[token]` (loading → session → menu redirect), "session ended" page

**Done when:** Two phones scanning the same QR share one session; scanning after close starts a new one.

### M7 — Order Engine (API core)
**Goal:** all order rules in one tested service; UI comes next.
- Order model, counters (orderNo, kotNo), pricing engine (`calculateOrderTotals`) in shared package
- `createOrUpdateRound` (first order + add-on), item snapshot, notes, instructions
- Item state machine + guard rules (guest can remove only PENDING; staff cancel with reason/approval)
- Table status updates (VACANT ↔ OCCUPIED ↔ BILL_REQUESTED)
- Order lookup & search (orderNo/table/phone), transfer table, merge (P1), cancel
- Optimistic concurrency, idempotency keys, audit log for cancels
- Emits domain events (consumed in M8)

**Done when:** Integration tests cover: first order, add-on round, remove PENDING item ✔, remove PREPARING item ✖ (`ITEM_LOCKED`), concurrent add-ons, totals with tax, cross-branch isolation.

### M8 — Real-time Layer
**Goal:** new orders appear without refresh.
- Socket.IO server (`/staff`, `/guest`, `/customer`), auth handshake, room joins, Redis adapter
- Event emitter → socket translation; `eventId`; catch-up (`updatedSince`)
- Dashboard socket client hook (`useLiveOrders`), reconnect banner, **alert sound** + "enable sound" prompt
- Guest socket client (order status updates)
- (Push notifications wiring for the app arrives in M16; web sound covers Phase 1)

**Done when:** Placing an order from a guest phone shows it on two dashboard tabs within 1 s; killing the network and reconnecting restores missed orders.

### M9 — Branch Dashboard (operations)
**Goal:** staff run the floor.
- **Live Orders** board (New / Preparing / Ready / Served columns or list) with filters by type
- **Kitchen (KDS)** view: tickets by KOT with timers, mark preparing/ready
- **Live Tables / Ongoing Meals** page: tile per table with status, running total, elapsed time; click → order drawer
- **Order search** by order ID / table / phone; order detail with edit (add items, change qty, cancel item with reason, transfer table)
- Confirm/awaiting-confirmation handling
- Sound/visual alerts per event catalogue

**Done when:** A cashier can find table 12's ongoing order, add roti, and the kitchen sees a new KOT instantly.

### M10 — Customer Web Ordering (QR)
**Goal:** guest experience end-to-end.
- Menu page (mobile-first): category chips, search, veg filter, item sheet with variants/add-ons/notes, out-of-stock state
- Cart (bottom bar → sheet), place order, running-order screen with live item status
- Add more items any time while session open; remove only PENDING items (UI hides/locks others with message)
- Request bill, "Pay now" (wired to M11), "Pay at counter"
- Empty/error states: branch closed, session ended, offline

**Done when:** Guest can scan, order, add roti, watch status change, and request the bill without refreshing.

### M11 — Payments (COD + Razorpay)
**Goal:** money handled correctly.
- `Payment` model; record cash/UPI/card by staff; guest "pay at counter"
- Razorpay order create (server-computed amount), verify signature, **webhook** (idempotent), failure handling
- Balance model (paid vs due; add-ons after payment increase balance)
- Refund API (manager) + webhook confirmation
- Guest UI: Razorpay Checkout; payment status screens; Dashboard: payment badges, record-payment dialog

**Done when:** Online payment succeeds even if the guest closes the tab (webhook), partial payment then add-on shows correct balance, and duplicates are impossible.

### M12 — POS / Manual Invoicing
**Goal:** billing for walk-ins and settling every order.
- POS screen: item grid + search, cart, order type, table picker (appends to open order), customer info, discount/coupon hook
- Invoice generation (sequential numbering in a transaction), PDF + 58/80 mm print view, reprint
- Settle & close (payment check → invoice → session close → table vacant)
- KOT print view and reprint
- Manager-approved manual discount

**Done when:** Walk-in order can be created, billed, paid and printed in < 30 seconds; invoice numbers are gap-free.

**➡ Phase 1 release: pilot in one branch.**

---

## Phase 2 — Online orders

### M13 — Coupons
- Coupon CRUD (Admin global / Manager branch), rules engine (percent/flat, min order, cap, validity, limits, order type, branch scope, first-order)
- Validate/apply/remove on guest, customer and POS flows; redemption tracking (transactional with payment)
- Admin UI: coupon list/form; usage counts

### M14 — Customer Accounts & Takeaway
- Phone OTP auth (provider integration, DLT templates), profile, address book
- Customer-web: login, home (branch/menu), takeaway checkout, order history, order tracking (socket)
- Branch: accept/reject, prep ETA, READY → PICKED_UP flow, token number display
- COD (pay at pickup) + Razorpay

### M15 — Delivery & Geofencing
- Maps provider integration (autocomplete + geocode)
- Branch delivery config UI (radius / polygon zone, fee slabs, min order)
- `assignBranch` (nearest eligible via `$geoNear`), delivery quote, fee, ETA
- Checkout with address + pin, `delivery/check`, `checkout/quote`
- Branch delivery workflow: accept → prepare → out for delivery (rider name/phone) → delivered; COD collection
- Auto-reassign on reject/timeout (once), manual reassign by Admin/Manager escalation

**➡ Phase 2 release.**

---

## Phase 3 — Mobile, bookings, reports

### M16 — Android App + Push
- React Native app: login, branch context, Live Orders, order detail/actions (accept, status, add items), Live Tables, kitchen view, availability toggle
- FCM integration, notification channels, Notifee alert (sound/full-screen), device registration, deep links
- Background reliability: battery-optimization onboarding, optional foreground service, escalation jobs
- Socket in foreground with catch-up; Play-store internal testing track / APK distribution

### M17 — Reservations
- Slot engine + availability, OTP-verified booking (customer-web), branch reservation list, confirm/decline, seat → session, RESERVED tile on live board, reminders (P2), no-show

### M18 — Reports & Audit
- Branch + Admin dashboards: sales by day/hour/type/payment, top items, cancellations, GST summary, coupon usage, branch comparison
- Audit-log viewer, CSV export (P2)

---

## Phase 4 — Launch

### M19 — Hardening & Go-live
- Load test (sockets + order creation), security review (OWASP checklist), penetration checks on QR/session & payment flows
- Backups + restore drill, monitoring/alerts, Sentry, runbooks
- UAT with branch staff, training material, printed QR rollout, production Razorpay keys, DLT/SMS live, domain/SSL

---

## Suggested effort (1 full-stack dev + occasional help — rough)

| Module | Estimate |
|---|---|
| M0 | 3–4 days |
| M1 | 4–5 days |
| M2 | 4–5 days |
| M3 | 4–5 days |
| M4 | 3–4 days |
| M5 | 3–4 days |
| M6 | 3 days |
| M7 | 6–8 days |
| M8 | 4 days |
| M9 | 7–9 days |
| M10 | 6–8 days |
| M11 | 5–6 days |
| M12 | 5–6 days |
| **Phase 1 total** | **~8–10 weeks** |
| M13–M15 | ~4–5 weeks |
| M16–M18 | ~5–6 weeks |
| M19 | ~2 weeks |

Estimates are planning guidance only; adjust after M0–M2 to your real velocity.

## Working method (per module)
1. Read the module section + API section.
2. Implement backend + tests → merge.
3. Implement UI → merge.
4. Demo on staging → tick boxes in the tracker → add a changelog line.
5. Only then start the next module.