# Noodle Junction — Workflow & Implementation Tracker

> **This is the living document.** Update it after every module/task. It answers: *what are we building, what is done, what is left.*
> Status: ⬜ Not started · 🟨 In progress · ✅ Done · ⏸ Blocked · 🔻 Deferred

**Last updated:** 2026-09-21 · **Current phase:** Phase 1 — Dine-in MVP · **Current module:** M0 (in progress — step 1 of 8 done)

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
| M0 | Project foundation | 🟨 | 🟨 | ⬜ | ⬜ | — | ⬜ | ⬜ | Step 1/8 done (monorepo tooling) |
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
- [x] Monorepo (pnpm + turbo), TS config, ESLint/Prettier, Husky (+ commitlint, lint-staged)
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
| 2026-09-21 | Repo layout: `client/` (Next.js web) + `server/` (Express API) + `packages/*` (shared) instead of `apps/*`; docs in `documentation/` | Supersedes TRD §3 folder names |
| | | |

## 7. Open questions / blockers

| # | Question | Owner | Status |
|---|---|---|---|
| Q1 | Delivery zone: radius vs polygon for MVP | | Open |
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
| 2026-09-21 | M0 | Step 1: monorepo root tooling (pnpm workspace over `client`, `server`, `packages/*`, turbo, tsconfig.base, ESLint flat config in `packages/eslint-config`, Prettier, Husky + commitlint + lint-staged). Verified locally: install, eslint, prettier, commitlint OK | Claude |
| | | | |

## 9. How to update this file
1. When you start a module set its status to 🟨 and update **Current module** at the top.
2. Tick the sub-checklist items as they are merged.
3. When all boxes for a module are ticked and staging demo passes → ✅, update the progress summary counts and the "implemented" table.
4. Add a changelog row and, if you changed an API/DB shape, update [04-API.md](04-API.md) / [03-DATABASE.md](03-DATABASE.md) in the same PR.