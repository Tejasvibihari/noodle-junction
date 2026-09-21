# Noodle Junction — Security, Roles & Permissions

Related: [TRD](02-TRD.md) · [Business rules](08-BUSINESS-RULES-AND-FLOWS.md)

## 1. Roles

| Role | Scope | Notes |
|---|---|---|
| `RESTAURANT_ADMIN` | Restaurant-wide | `branchId = null`. Setup + reports; **no order operations** |
| `BRANCH_MANAGER` | One branch | Approvals, menu, tables, staff (non-managers), reports |
| `CASHIER` | One branch | Orders, POS, payments, billing |
| `KITCHEN` | One branch | Kitchen tickets, item availability |
| `WAITER` | One branch | Live tables, add items, mark served, request bill help |
| `CUSTOMER` | Own data | Phone-OTP account |
| `GUEST` | One table session | No account; token bound to table session |

## 2. Permission matrix

✅ allowed · 👁 read-only · ❌ denied · ⚙ configurable

| Capability | Admin | Manager | Cashier | Kitchen | Waiter | Customer | Guest |
|---|---|---|---|---|---|---|---|
| Restaurant profile | ✅ | 👁 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create/edit branches | ✅ | ❌ (own settings only) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Branch settings (delivery, pause) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Staff management | ✅ all | ✅ own branch, non-managers | ❌ | ❌ | ❌ | ❌ | ❌ |
| Master menu | ✅ | 👁 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Branch menu edit | 👁 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Toggle item availability | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tables & QR | 👁 | ✅ | 👁 | ❌ | 👁 | ❌ | ❌ |
| View live tables | ❌ | ✅ | ✅ | 👁 (kitchen relevant) | ✅ | ❌ | ❌ |
| View branch orders | ❌ | ✅ | ✅ | ✅ (tickets) | ✅ | ❌ | ❌ |
| Create manual order | ❌ | ✅ | ✅ | ❌ | ✅ (add items) | ❌ | ❌ |
| Place order | — | — | — | — | — | ✅ own | ✅ own table |
| Remove PENDING item | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ own cancellable | ✅ |
| Cancel PREPARING+ item | ❌ | ✅ (reason) | ❌ (request) | ❌ | ❌ | ❌ | ❌ |
| Update item status | ❌ | ✅ | ✅ (served) | ✅ | ✅ (served) | ❌ | ❌ |
| Apply coupon | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Manual discount | ❌ | ✅ | ⚙ (limit %) | ❌ | ❌ | ❌ | ❌ |
| Record payment | ❌ | ✅ | ✅ | ❌ | ⚙ | — | — |
| Refund | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Generate/print invoice | ❌ | ✅ | ✅ | ❌ | ⚙ | ✅ own | ✅ own (view) |
| Credit note | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Coupons (global) | ✅ | 👁 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Coupons (branch) | ✅ | ⚙ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reservations | ❌ | ✅ | ✅ | ❌ | ✅ | own | ❌ |
| Branch reports | ❌ | ✅ | ⚙ (today) | ❌ | ❌ | ❌ | ❌ |
| All-branch reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Audit logs | ✅ | 👁 own branch | ❌ | ❌ | ❌ | ❌ | ❌ |

Implementation: permission strings (`order.create`, `order.item.cancel`, `payment.refund`, `menu.branch.edit` …) mapped from role in `packages/shared/permissions.ts`; endpoints use `authorize('order.item.cancel')`. Optional per-user overrides (`users.permissions`).

## 3. Security controls

### 3.1 Authentication & sessions
- Passwords: argon2id/bcrypt(12); min 8 chars; breach-list check (P2).
- Access token 15 min; refresh 30 days, rotating, hashed at rest, reuse detection revokes family.
- Login throttling, temporary lockout, generic error messages.
- OTP: 6-digit, hashed, 5-min TTL, 3 attempts, resend cooldown, per-phone + per-IP limits.
- Table-session token: signed, short-lived, bound to `sessionId` + `tableId`; server verifies session status on **every** request.
- Cookies: `HttpOnly; Secure; SameSite=Lax`; CSRF protection for cookie-authenticated mutating routes (SameSite + `Origin` check + custom header).

### 3.2 Authorization & isolation
- RBAC middleware on every route; deny by default.
- `branchId` only from token; repositories require scope.
- Cross-branch access returns 404. Automated test per endpoint.
- Object-level checks: guest can only access orders of own `tableSessionId`; customers own `customerId`.
- Sockets: rooms assigned server-side; event payload never includes data from other branches.

### 3.3 Input & data safety
- Zod validation on all inputs; strip unknown keys.
- NoSQL-injection protection (reject `$`/`.` keys; `express-mongo-sanitize` or schema-level).
- Output encoding in UI (React default); sanitize user text (notes, names).
- File upload: type/size allowlist, re-encode images, random filenames, no executable types.
- Money and totals **only computed server-side**.
- Rate limits (see API §17), request size limits, timeouts.

### 3.4 Payments
- Razorpay key secret & webhook secret only on server (env/secret manager).
- Verify checkout signature + webhook signature (raw body, constant-time compare).
- Idempotent processing; amount/currency check against stored payment.
- Never store card data (Razorpay hosted checkout).

### 3.5 Transport & infrastructure
- HTTPS everywhere, HSTS; secure headers (helmet), strict CORS allowlist (`order.`, `admin.` domains).
- Secrets in environment/secret manager, never in repo; rotate on staff exit.
- MongoDB: auth on, network-restricted (IP allowlist/VPC), TLS, least-privilege DB user, automated backups + tested restore.
- Redis: password + private network.
- Dependency scanning (npm audit/Dependabot), lockfile, minimal Docker image.

### 3.5a Abuse / fraud on QR ordering
| Threat | Control |
|---|---|
| Prank/fake orders from remote | Optional staff confirmation for first order; rate limits; geolocation soft-flag; rotate QR; block session |
| Enumeration of QR tokens | 16+ char random tokens; rate limit on `/public/qr` |
| Session hijack | Session token signed + bound; server-side status check |
| Coupon farming | Per-user/phone limits, OTP-verified phone for online orders, server-side validation |
| Price tampering | Client sends item IDs + qty only; server prices everything |
| Replaying payment verify | Idempotent by payment id |

### 3.6 Privacy (DPDP Act, India — confirm with legal)
- Collect minimal PII (phone, name, address for delivery).
- Consent + privacy policy link on customer web; purpose limitation.
- Data deletion/anonymisation on request; retention per [03-DATABASE.md §5](03-DATABASE.md).
- Mask phone numbers in staff lists when not needed (last 4 digits) — optional.
- No PII in logs; hashed IP for guest sessions.

### 3.7 Audit logging
Log: login/logout/failed login, staff create/deactivate, price change, availability change (optional), discount, item cancel after PENDING, order cancel, refund, invoice cancel/credit note, QR rotate, settings change. Fields: actor, role, branch, entity, before/after, reason, IP, timestamp. Append-only.

## 4. Security checklist before go-live
- [ ] All endpoints have `authorize` or are explicitly public
- [ ] Isolation tests green for every branch-scoped route
- [ ] Rate limits configured (login, OTP, guest order, QR resolve)
- [ ] Webhook signature tests
- [ ] Secrets rotated, `.env` not committed
- [ ] CORS locked, cookies secure
- [ ] Backups + restore drill done
- [ ] Sentry & alerts on
- [ ] Penetration test of QR/session & payment flow
- [ ] Privacy policy + terms published