# Noodle Junction — DevOps, Environments & Deployment

Related: [TRD](02-TRD.md) · [Security](09-SECURITY-AND-RBAC.md)

## 1. Environments

| Env | Purpose | Data | URLs (example) |
|---|---|---|---|
| Local | Development | Seed data, Docker Mongo/Redis | `localhost:5000`, `:3000` (dashboard), `:3001` (customer) |
| Staging | QA/UAT, demos | Copy of seed / test data; Razorpay **test** keys | `api-stg.`, `admin-stg.`, `order-stg.noodlejunction.in` |
| Production | Live | Real | `api.`, `admin.`, `order.noodlejunction.in` |

Keep API and customer web on the same registrable domain so the guest session cookie is first-party.

## 2. Suggested hosting (pick what fits your budget)

| Component | Option A (simple) | Option B (scalable) |
|---|---|---|
| API + workers | VPS (2 vCPU / 4 GB) with Docker + Nginx + PM2 | AWS ECS / Render / Railway |
| Next.js apps | Vercel (or same VPS behind Nginx) | Vercel / Cloudflare |
| MongoDB | MongoDB Atlas (M10+ replica set) | Atlas dedicated |
| Redis | Upstash / Redis Cloud / self-hosted | ElastiCache |
| Files | Cloudinary / S3 | S3 + CloudFront |
| Push | Firebase project (free) | |
| Monitoring | Sentry + UptimeRobot | Grafana/Prometheus + Sentry |

WebSockets need sticky sessions or the Redis adapter and a proxy that supports upgrades (Nginx: `proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`).

## 3. Environment variables

### API (`apps/api/.env`)
```
NODE_ENV=production
PORT=5000
APP_URL_API=https://api.noodlejunction.in
APP_URL_DASHBOARD=https://admin.noodlejunction.in
APP_URL_CUSTOMER=https://order.noodlejunction.in
CORS_ORIGINS=https://admin.noodlejunction.in,https://order.noodlejunction.in
COOKIE_DOMAIN=.noodlejunction.in

MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...

JWT_ACCESS_SECRET=...
JWT_ACCESS_TTL=15m
REFRESH_TOKEN_TTL_DAYS=30
TABLE_SESSION_SECRET=...
TABLE_SESSION_MAX_HOURS=6

RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

FCM_PROJECT_ID=...
FCM_CLIENT_EMAIL=...
FCM_PRIVATE_KEY=...

SMS_PROVIDER=msg91
SMS_AUTH_KEY=...
SMS_OTP_TEMPLATE_ID=...

MAPS_PROVIDER=google
MAPS_API_KEY=...        # server-side key (geocoding/distance)

STORAGE_PROVIDER=cloudinary|s3
STORAGE_...=...

SENTRY_DSN=...
LOG_LEVEL=info
DEFAULT_TIMEZONE=Asia/Kolkata
```
### Customer web / Dashboard (`.env`)
```
NEXT_PUBLIC_API_URL=https://api.noodlejunction.in/api/v1
NEXT_PUBLIC_SOCKET_URL=https://api.noodlejunction.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
NEXT_PUBLIC_MAPS_KEY=...       # browser key restricted by HTTP referrer
NEXT_PUBLIC_SENTRY_DSN=...
```
### Mobile app
`API_URL`, `SOCKET_URL`, Firebase `google-services.json` (per env), Sentry DSN.

Validate env on boot (zod) and fail fast.

## 4. CI/CD (GitHub Actions)

**On PR:** install (pnpm cache) → lint → typecheck → unit/integration tests (Mongo memory server / service containers) → build.
**On merge to `main`:** deploy to **staging** automatically.
**On tag `v*`:** deploy to **production** after manual approval; run DB migrations; smoke test `/health`.
Mobile: EAS Build / Gradle → internal testing track (Play Console) or signed APK artifact.

Branching: `main` (stable) · `feat/<module>-<short-desc>` · `fix/…`. Conventional Commits. One PR per module slice (backend, then UI).

## 5. Database operations
- Replica set required (transactions, change streams).
- Migrations with `migrate-mongo` (indexes and data fixes are versioned and run in CI/CD).
- Create indexes via migrations, not `autoIndex` in production.
- Backups: Atlas continuous/daily snapshots, retention ≥ 7 days; **quarterly restore drill**.
- Seed scripts: `pnpm seed:dev` (restaurant, branches, staff, menu, tables), never run on production.

## 6. Monitoring & alerting
| What | Tool | Alert when |
|---|---|---|
| Uptime `/health` | UptimeRobot/Better Uptime | down > 1 min |
| Errors | Sentry (api, web, app) | new issue / spike |
| Latency | APM/log metrics | p95 > 800 ms |
| Sockets | custom gauge: connected staff sockets per branch | branch has 0 staff connected during open hours |
| Push | FCM failure rate | > 5 % |
| Payments | Webhook failures, unmatched payments | any |
| Queue | BullMQ backlog/age | > 60 s |
| DB | connections, slow queries, disk | thresholds |

Log format JSON (pino) with `requestId`, `branchId`, `userId`; ship to Loki/Datadog/CloudWatch.

## 7. Release & rollback
1. Merge → staging → run smoke tests + module demo.
2. Tag release → prod deploy (rolling; keep previous image).
3. Migrations must be backward compatible for one release (expand → migrate → contract).
4. Rollback = redeploy previous image; feature flags for risky features (e.g., staff confirmation, auto-reassign).
5. Release notes → changelog in [07-WORKFLOW-TRACKER.md](07-WORKFLOW-TRACKER.md).

## 8. Runbooks (create as you go)
- Branch not receiving orders (socket/FCM checklist).
- Razorpay payment stuck (reconcile by order id; webhook replay).
- Rotate QR for a table / all tables.
- Restore from backup.
- Rotate secrets.
- Add a new branch (checklist below).

### New branch go-live checklist
- [ ] Admin creates branch (address, GPS, timings, GSTIN)
- [ ] Master menu imported; prices reviewed
- [ ] Tables created; QR sheet printed & placed
- [ ] Staff accounts created; devices logged in; sound & notification permissions tested
- [ ] Printer tested (KOT + invoice)
- [ ] Test order → kitchen → bill → close
- [ ] Delivery zone configured (if applicable)
- [ ] Branch unpaused

## 9. Domains, SSL, email/SMS
- DNS: `api`, `admin`, `order` subdomains; TLS via Let's Encrypt/Cloudflare.
- Transactional email (password reset) via SES/Resend/Brevo with SPF/DKIM.
- SMS: DLT entity + template registration for OTP/order messages (India) — start early, it takes days.

## 10. Play Store / app distribution
- Internal testing → closed testing → production (or private APK for staff-only).
- Firebase App Distribution is a good option for staff-only builds.
- Version code discipline; `GET /version` returns `minSupportedAppVersion` to force updates.