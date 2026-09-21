# Noodle Junction — Documentation Index

Restaurant order management & booking system: **dine-in (QR), takeaway, delivery** for a multi-branch restaurant.
Stack: **Next.js** (web) · **React Native** (Android app) · **Node + Express** · **MongoDB** (+ Redis, Socket.IO, FCM, Razorpay).

| # | Document | What it answers |
|---|---|---|
| 01 | [PRD](01-PRD.md) | What are we building, for whom, what is in/out of scope, priorities |
| 02 | [TRD](02-TRD.md) | How it is built: architecture, sessions, real-time, payments, geofencing, isolation |
| 03 | [Database](03-DATABASE.md) | MongoDB collections, fields, indexes, transactions |
| 04 | [API](04-API.md) | Every endpoint with roles, examples, error codes |
| 05 | [Events & Notifications](05-EVENTS-AND-NOTIFICATIONS.md) | Socket events, rooms, push notifications |
| 06 | [Modules](06-MODULES.md) | Full system split into M0–M19 with build order |
| 07 | [Workflow Tracker](07-WORKFLOW-TRACKER.md) | **Living doc** — implemented vs not implemented, decisions, changelog |
| 08 | [Business Rules & Flows](08-BUSINESS-RULES-AND-FLOWS.md) | Dine-in, add-on, item removal, POS, delivery, payment and coupon rules, edge cases |
| 09 | [Security & RBAC](09-SECURITY-AND-RBAC.md) | Roles, permission matrix, security controls |
| 10 | [Theme & Design System](10-THEME-DESIGN-SYSTEM.md) | Colors, typography, components, print styles, RN theme |
| 11 | [DevOps](11-DEVOPS.md) | Environments, env vars, CI/CD, backups, monitoring, go-live checklist |
| 12 | [Screens & Sitemap](12-SCREENS-AND-SITEMAP.md) | Every screen for customer web, dashboard and app |
| 13 | [QA & Testing](13-QA-TESTING.md) | Test strategy, critical cases, UAT scripts |

## How to use these docs
1. Put this folder in your repo as `/docs`.
2. Build in the order in [06-MODULES.md](06-MODULES.md): **M0 → M1 → M2 …** Finish one module (API + UI + tests) before starting the next.
3. After each module, tick the boxes and add a changelog line in [07-WORKFLOW-TRACKER.md](07-WORKFLOW-TRACKER.md). If an endpoint or schema changed, update [04-API.md](04-API.md) / [03-DATABASE.md](03-DATABASE.md) in the same PR.

## Key design decisions (summary)
- **Session for QR guests:** a server-side **table session** + signed HttpOnly cookie. The QR holds an opaque token resolved on the server (not the raw table number). All phones at a table join one session and one running order. → [TRD §5.3](02-TRD.md)
- **Add-ons:** every extra order at a table becomes a new *round (KOT)* on the same order. → [TRD §6](02-TRD.md), [Rules §3](08-BUSINESS-RULES-AND-FLOWS.md)
- **"Can't remove once prepared":** enforced per item by a status machine (`PENDING → PREPARING → READY → SERVED`); guest can remove only `PENDING`. → [Rules §4](08-BUSINESS-RULES-AND-FLOWS.md)
- **Branch isolation:** `branchId` comes from the JWT only; all queries are scoped; cross-branch access returns 404; tested on every endpoint. → [TRD §4](02-TRD.md)
- **Nearest branch:** server-side `$geoNear` on branch GPS + delivery radius/zone. → [TRD §10](02-TRD.md)
- **Master menu:** copied into each branch (linked by `masterItemId`), then independent. → [TRD §11](02-TRD.md)
- **Real-time:** Socket.IO rooms per branch + FCM high-priority push for the closed app. → [Events](05-EVENTS-AND-NOTIFICATIONS.md)
- **Payments:** server-computed amounts, Razorpay signature + webhook (source of truth), COD/counter recorded by staff, balance model works with add-ons. → [TRD §9](02-TRD.md)

## Assumptions to confirm (also in PRD §10)
1. Single restaurant brand, many branches. Admin is **read-only on orders** (reports only).
2. GST rates/SAC and service charge to be confirmed with your CA; tax mode (inclusive/exclusive) is configurable.
3. Delivery uses the branch's own riders in v1; MVP zone = radius (polygon supported by design).
4. Android app is Phase 3 in the suggested order; web dashboard already gives sound alerts in Phase 1. Move M16 earlier if closed-app alerts are needed at launch.

## Suggested first three steps
1. **M0** — scaffold monorepo, API skeleton, Docker Mongo (replica set) + Redis, CI.
2. **M1** — staff auth + RBAC + isolation test helper (everything else depends on it).
3. **M2** — restaurant/branches/staff, so you can create a branch and log in as its manager.

Document version: **1.0** · Created: 2026-09-21